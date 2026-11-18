import http from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { build } from 'esbuild';
import { readAuthoringData } from './data.mjs';
import { catalogFromTables } from '../catalog.mjs';
import { openHeadless, wantsHeadless } from './headless-chrome.mjs';
const tables=await readAuthoringData();
const catalog=catalogFromTables(tables);
const bundle=await build({entryPoints:[new URL('./browser-check-entry.jsx',import.meta.url).pathname],bundle:true,write:false,format:'iife',globalName:'renderGrader',minify:true,target:'es2022',jsx:'automatic',loader:{'.module.css':'empty','.css':'empty'},define:{'process.env.NODE_ENV':'"production"'}});
const directory=path.join(tmpdir(),'html-exam-render-check');await mkdir(directory,{recursive:true});
const invalid = {
 'exam-html-14':'.menu{display:block}',
 'exam-html-24':'.cards{display:flex}'
};
const valid = {
 'exam-html-14':[
  'ul{display:flex}',
  '.menu{display:inline-flex;gap:8px}'
 ],
 'exam-html-24':[
  '.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}',
  '.cards{display:grid;grid-template-columns:100px 100px 100px}'
 ]
};
const page=`<!doctype html><meta charset="utf-8"><title>表示採点の検証</title><button id="run">検証する</button><pre id="results"></pre><script>${bundle.outputFiles[0].text.replaceAll('</script','<\\/script')}</script><script>
const catalog=${JSON.stringify(catalog).replaceAll('<','\\u003c')};const invalid=${JSON.stringify(invalid)};const valid=${JSON.stringify(valid)};
document.querySelector('#run').onclick=async()=>{
 const output=document.querySelector('#results');output.textContent='';let failures=0,count=0;
 if(!location.search.includes('preview')){
  for(const quiz of catalog){const answers=Object.fromEntries(quiz.items.map(i=>[i.id,i.type==='code' ? renderGrader.splitEditorFiles(i.grading.example)||i.grading.example : i.grading.example]));
   for(const item of quiz.items.filter(i=>i.grading.kind==='render')){
    const result=await renderGrader.gradeRenderedAnswer(item,answers[item.id],answers);count++;if(!result.passed)failures++;
    output.textContent+=item.id+' '+(result.passed?'PASS':'FAIL '+result.feedback)+'\\n';
    if(valid[item.id]){for(const alt of valid[item.id]){const copied=await renderGrader.gradeRenderedAnswer(item,alt,answers);count++;if(!copied.passed)failures++;output.textContent+=item.id+' 別解 '+(copied.passed?'PASS':'FAIL '+copied.feedback)+'\\n';}}
    if(invalid[item.id]){const wrong=await renderGrader.gradeRenderedAnswer(item,invalid[item.id],answers);count++;if(wrong.passed)failures++;output.textContent+=item.id+' 誤答 '+(!wrong.passed?'PASS':'FAIL 誤答を受理')+'\\n';}
   }
  }
 }
 if(location.search.includes('preview')){
  try{const lines=await renderGrader.checkPreview();output.textContent+=lines.join('\\n')+'\\n';count+=lines.length;failures+=lines.filter(line=>line.includes(' FAIL ')).length;}catch(error){failures++;output.textContent+='プレビュー FAIL '+error.message+'\\n';}
 }
 output.textContent+='完了 '+count+'件、失敗 '+failures+'件';await fetch('/result',{method:'POST',body:output.textContent});
};if(location.search.includes('autorun'))document.querySelector('#run').click();</script>`;
const resultFile=path.join(directory,'results.txt');
http.createServer(async(req,res)=>{
 if(req.method==='POST') {let body='';for await(const chunk of req)body+=chunk;await writeFile(resultFile,body);res.end('ok');return;}
 res.setHeader('Content-Type','text/html; charset=utf-8');res.end(page);
}).listen(4175,'127.0.0.1',async()=>{
 console.log('http://localhost:4175/ → 検証する（結果: '+resultFile+'）');
 if(!wantsHeadless())return;
 const suites=[['model','http://127.0.0.1:4175/?autorun']];
 let failed=false;
 for(const [name,url] of suites){
  console.log('headless '+name+' '+url);
  await openHeadless(url,resultFile,{timeoutMs:240000});
  const text=await readFile(resultFile,'utf8');
  await writeFile(path.join(directory,name+'.txt'),text);
  const summary=text.trim().split('\n').at(-1)||'';
  console.log(summary);
  if(!/失敗 0件/.test(summary)){
   console.log(text);
   failed=true;
  }
 }
 process.exit(failed?1:0);
});
