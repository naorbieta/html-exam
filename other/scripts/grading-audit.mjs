import http from 'node:http';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { build,transform } from 'esbuild';
import { parseHTML } from 'linkedom/worker';
import { readAuthoringData } from './data.mjs';
import { catalogFromTables } from '../../src/catalog.mjs';

const catalog=catalogFromTables(await readAuthoringData()), variations={};
const js = async source => (await transform(source,{loader:'js',minifyWhitespace:true,charset:'utf8',target:'es2022'})).code;
const css = async source => (await transform(source,{loader:'css',minify:true,target:'chrome120'})).code;
for(const quiz of catalog) for(const item of quiz.items) {
  if(!['code','inspection'].includes(item.type))continue;
  const source=item.grading.example;
  if(/^\s*</.test(source)) {
    const {document}=parseHTML(source);
    for(const style of document.querySelectorAll('style'))style.textContent=await css(style.textContent);
    for(const element of document.querySelectorAll('[style]')) {
      const code=await css(`x{${element.getAttribute('style')}}`);
      element.setAttribute('style',code.slice(code.indexOf('{')+1,code.lastIndexOf('}')));
    }
    for(const script of document.querySelectorAll('script'))script.textContent=await js(script.textContent);
    variations[item.id]=document.toString();
  } else if(item.grading.kind==='render') {
    const code=await css(source.includes('{')?source:`x{${source}}`);
    variations[item.id]=source.includes('{')?code:code.slice(code.indexOf('{')+1,code.lastIndexOf('}'));
  } else if(item.grading.kind==='code') variations[item.id]=item.id==='quiz-08-answer-2' ? source.split('\n').map(line=>line.trim()).join('\n') : await js(source);
}
const bundle=await build({entryPoints:[new URL('../tests/grading-audit-browser.mjs',import.meta.url).pathname],bundle:true,write:false,format:'iife',globalName:'gradingAudit',target:'es2022',minify:true});
const output=path.join(tmpdir(),'html-test-grading-audit');await mkdir(output,{recursive:true});
const json=value=>JSON.stringify(value).replaceAll('<','\\u003c');
const page=`<!doctype html><meta charset="utf-8"><title>全設問の採点確認</title><button id="run">検証する</button><p id="progress"></p><pre id="failures"></pre><script>${bundle.outputFiles[0].text.replaceAll('</script','<\\/script')}</script><script>
document.querySelector('#run').onclick=async()=>{
 document.querySelector('#run').disabled=true;document.querySelector('#failures').textContent='';
 const rows=await gradingAudit.auditGrading(${json(catalog)},${json(variations)},(row,count)=>{
 document.querySelector('#progress').textContent=count+'件 '+row.id;
 if(!row.ok)document.querySelector('#failures').textContent+=JSON.stringify(row)+'\\n';
 });
 document.querySelector('#progress').textContent='完了 '+new Set(rows.map(row=>row.id)).size+'設問 '+rows.length+'件、失敗 '+rows.filter(row=>!row.ok).length+'件';
 await fetch('/results',{method:'POST',body:JSON.stringify(rows,null,2)});document.querySelector('#run').disabled=false;
};</script>`;
http.createServer(async(req,res)=>{
 if(req.method==='POST'){let body='';for await(const part of req)body+=part;await writeFile(path.join(output,'results.json'),body);res.end('ok');return;}
 res.setHeader('Content-Type','text/html; charset=utf-8');res.end(page);
}).listen(4176,'127.0.0.1',()=>console.log(`http://127.0.0.1:4176/ → 検証する（結果: ${output}/results.json）`));
