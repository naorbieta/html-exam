import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeAnswer } from '../src/grader.mjs';
import { validateSubmission } from '../src/submission.mjs';

const item={id:'file',type:'file',required:true,grading:{kind:'file',config:{extension:'.js'},feedback:'.jsを選んでください。'}};
test('JavaScriptファイルは空でも受け付け、他の拡張子・ファイル未選択を拒否する', () => {
  for(const name of ['empty.js','プログラム.js','main.JS'])assert.equal(gradeAnswer(item,{name,content:''}).passed,true,name);
  for(const answer of ['',{name:'main.js.txt',content:''},{name:'.js',content:''},{name:'main.zip',content:''},{name:'../main.js',content:''}])assert.equal(gradeAnswer(item,answer).passed,false);
});
test('選んだファイルを空の内容も含めて保存し、過大・欠損・不正な形式を拒否する', () => {
  const make=answer=>({sessionId:'session-000000000001',attemptId:'attempt-000000000001',quizId:'q',answers:{file:answer},grading:{items:[{itemId:'file',passed:true,feedback:'正解です。'}]}});
  const catalog=[{id:'q',items:[item]}],answer={name:'empty.js',content:''};
  assert.deepEqual(validateSubmission(make(answer),catalog).answers[0].value,answer);
  for(const invalid of ['',{name:'main.js'},{name:'main.js',content:'x'.repeat(20000)},{name:'main.js',content:'',extra:'x'}])assert.throws(()=>validateSubmission(make(invalid),catalog),/ファイル/);
});
