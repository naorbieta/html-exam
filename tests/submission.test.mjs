import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { validateSubmission, sheetText } from '../src/submission.mjs';

const catalog = [{ id: 'q1', items: [
  { id: 'code', type: 'code', required: true },
  { id: 'type', type: 'multiple_choice', required: true, options: ['文字列','数値'] }
] }];
const payload = () => ({ quizId: 'q1', sessionId: 'session-000000000001', attemptId: 'attempt-000000000001', answers: { code: '=1+1;\nconsole.log("test");', type: '数値' }, grading: { items: catalog[0].items.map(item => ({ itemId:item.id, passed:true, feedback:'正解です。' })) } });

test('回答テキストを保持し、未入力・不正な選択肢・別問題の欄を拒否する', () => {
  const p = payload();
  assert.equal(validateSubmission(p, catalog).answers[0].value, p.answers.code);
  p.answers.type = '不明'; assert.throws(() => validateSubmission(p, catalog), /選び直/);
  p.answers.type = '数値'; p.answers.code = ' '; assert.throws(() => validateSubmission(p, catalog), /必須/);
  p.answers.code = '0'; p.answers.unknown = 'extra'; assert.throws(() => validateSubmission(p, catalog), /含まれない/);
});

test('HTMLとCSSのファイル回答を保存し、不正なパス・形式・過大な内容を拒否する', () => {
  const p = payload();
  p.answers.code = { entry: 'index.html', files: { 'index.html': '<html><head><link rel="stylesheet" href="style.css"></head><body>本文</body></html>', 'style.css': 'body{color:blue}' } };
  assert.deepEqual(validateSubmission(p, catalog).answers[0].value, p.answers.code);
  for (const files of [
    { 'index.html': '', '../style.css': 'body{}' },
    { 'index.html': '', 'style.css': 1 },
    { 'index.html': '', 'style.css': 'x'.repeat(20001) },
    { 'style.css': 'body{}' }
  ]) {
    p.answers.code = { entry: 'index.html', files };
    assert.throws(() => validateSubmission(p, catalog), /ファイル形式/);
  }
});

test('採点結果の欠落・重複・型違い・過大な内容を拒否する', () => {
  for (const change of [p=>delete p.grading, p=>p.grading.items.pop(), p=>p.grading.items[1].itemId='code', p=>p.grading.items[0].passed='true', p=>p.grading.items[0].feedback='x'.repeat(2001)]) {
    const p=payload(); change(p); assert.throws(()=>validateSubmission(p,catalog), /採点結果/);
  }
});

test('回答コードをスプレッドシートの数式にしない', () => {
  assert.equal(sheetText('=SUM(A1:A3)'), "'=SUM(A1:A3)");
  assert.equal(sheetText('+code'), "'+code");
  assert.equal(sheetText('console.log(1);'), 'console.log(1);');
});

test('GASは回答と採点結果を保存し、再送を重複記録せず、失敗時もロックを解放する', async () => {
  const rows = [];
  let released = 0, failWrite = false;
  const sheet = {
    getLastRow: () => rows.length + 1,
    getRange: () => ({
      createTextFinder: id => ({ matchEntireCell: () => ({ findNext: () => rows.find(row => row[0] === id) || null }) }),
      setNumberFormat() { return this; },
      setValues: values => { if (failWrite) throw new Error('write failed'); rows.push(...values); }
    })
  };
  const context = vm.createContext({ console,
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'book' }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush() {} },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() { released++; } }) }
  });
  vm.runInContext((await readFile(new URL('../src/editor-files.mjs', import.meta.url), 'utf8') + '\n' + await readFile(new URL('../src/submission.mjs', import.meta.url), 'utf8')).replace(/^import .*;\n/gm, '').replace(/^export /gm, '') + '\n' + await readFile(new URL('../gas/Code.gs', import.meta.url), 'utf8'), context);
  context.getCatalog = () => catalog;
  const p = payload();
  context.submitQuiz(p); context.submitQuiz(p);
  assert.equal(rows.length, 2); assert.equal(released, 2);
  assert.equal(rows[0][5], "'=1+1;\nconsole.log(\"test\");");
  assert.deepEqual(JSON.parse(rows[0][6]), { passed:true,feedback:'正解です。' });
  const files = { entry: 'index.html', files: { 'index.html': '<html><link rel="stylesheet" href="style.css"><p>本文</p></html>', 'style.css': 'p{color:blue}' } };
  context.submitQuiz({ ...p, attemptId: 'attempt-000000000003', answers: { ...p.answers, code: files } });
  assert.deepEqual(JSON.parse(rows[2][5]), files);
  failWrite = true;
  assert.throws(() => context.submitQuiz({ ...p, attemptId: 'attempt-000000000002' }), /write failed/);
  assert.equal(released, 4);
});

test('旧GASシートの採点条件も読み込める', async () => {
  const names=[];
  const context=vm.createContext({ PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'book'})}, SpreadsheetApp:{openById:()=>({getSheetByName:name=>{if(['レッスン','設問'].includes(name))return null;names.push(name);return {getDataRange:()=>({getValues:()=>[[name]]})};}})}, catalogFromTables:tables=>tables });
  vm.runInContext(await readFile(new URL('../gas/Code.gs',import.meta.url),'utf8'),context);
  assert.equal(context.getCatalog().graders[0][0],'graders');
  assert.deepEqual(names,['quizzes','items','options','images','graders']);
});

test('実習ページの変更内容をGASへ保存でき、欠損・過大な回答を拒否する', async () => {
 const quiz=[{id:'exercise',items:[{id:'post',type:'dom_task',required:true}]}];
 const answer={text:'こんにちは',color:'rgb(0, 0, 255)',visible:true};
 const make=value=>({...payload(),quizId:'exercise',answers:{post:value},grading:{items:[{itemId:'post',passed:true,feedback:'正解です。'}]}});
 assert.deepEqual(validateSubmission(make(answer),quiz).answers[0].value,answer);
 for(const invalid of ['', {name:'old.png',dataUrl:'data:image/png;base64,AAAA'}, {...answer,text:''}, {...answer,text:'x'.repeat(20001)}, {...answer,color:5}, {...answer,visible:'true'}]) assert.throws(()=>validateSubmission(make(invalid),quiz));
 const rows=[];const context=vm.createContext({console,PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'book'})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>({getLastRow:()=>1,getRange:()=>({setNumberFormat(){return this},setValues:values=>rows.push(...values)})})}),flush(){}},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})}});
 vm.runInContext((await readFile(new URL('../src/editor-files.mjs',import.meta.url),'utf8')+'\n'+await readFile(new URL('../src/submission.mjs',import.meta.url),'utf8')).replace(/^import .*;\n/gm,'').replace(/^export /gm,'')+'\n'+await readFile(new URL('../gas/Code.gs',import.meta.url),'utf8'),context);context.getCatalog=()=>quiz;
 context.submitQuiz(make(answer));assert.deepEqual(JSON.parse(rows[0][5]),answer);
});
