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

function answerBook(rows, options = {}) {
  const sheet = {
    rows,
    getLastRow: () => rows.length,
    getLastColumn: () => Math.max(0, ...rows.map(row => row.length)),
    getRange: (row, col, height = 1, width = 1) => ({
      getValues: () => rows.slice(row - 1, row - 1 + height).map(values => (values || []).slice(col - 1, col - 1 + width)),
      setValues: values => { values.forEach((value, i) => { rows[row - 1 + i] ??= []; value.forEach((cell, j) => { rows[row - 1 + i][col - 1 + j] = cell; }); }); },
      setNumberFormat() { return this; },
      createTextFinder: id => ({ matchEntireCell: () => ({ findNext: () => rows.slice(row - 1, row - 1 + height).some(values => String(values[col - 1]) === id) ? {} : null }) })
    }),
    insertColumnAfter(index) { for (const row of rows) row.splice(index, 0, ''); },
    setFrozenRows() {},
    appendRow(row) { rows.push(row); },
    getName: () => 'answers'
  };
  const book = { getSheetByName: name => name === 'answers' ? sheet : null, insertSheet: () => sheet, getId: () => 'book', getUrl: () => 'https://example.invalid/book' };
  const properties = { SPREADSHEET_ID: options.spreadsheetId === undefined ? 'book' : options.spreadsheetId };
  return { sheet, book, properties, spreadsheetApp: {
    getActiveSpreadsheet: () => options.active === false ? null : book,
    openById: () => book,
    create: () => book,
    flush() {}
  }, session: {
    getActiveUser: () => ({ getEmail: () => options.email ?? 'student@example.com' }),
    getEffectiveUser: () => ({ getEmail: () => options.email ?? 'student@example.com' })
  } };
}

async function loadServer(contextExtras) {
  const context = vm.createContext({ console, HtmlService: { createHtmlOutputFromFile() { throw new Error('Catalog should be stubbed'); } }, ...contextExtras });
  vm.runInContext((await readFile(new URL('../src/editor-files.mjs', import.meta.url), 'utf8') + '\n' + await readFile(new URL('../src/gas-data.mjs', import.meta.url), 'utf8') + '\n' + await readFile(new URL('../src/submission.mjs', import.meta.url), 'utf8')).replace(/^import .*;\n/gm, '').replace(/^export /gm, '') + '\n' + await readFile(new URL('../src/gas/Code.gs', import.meta.url), 'utf8'), context);
  return context;
}

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
  const rows = [['記録ID', 'タイムスタンプ', 'ユーザー', 'セッションID', 'レッスンID', '問題ID', '回答内容', '正誤', 'フィードバック']];
  let released = 0, failWrite = false;
  const env = answerBook(rows);
  const originalSet = env.sheet.getRange;
  env.sheet.getRange = (row, col, height, width) => {
    const range = originalSet(row, col, height, width);
    const setValues = range.setValues;
    range.setValues = values => { if (failWrite) throw new Error('write failed'); return setValues(values); };
    return range;
  };
  const context = await loadServer({
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => env.properties[key] ?? null, setProperty: (key, value) => { env.properties[key] = value; } }) },
    SpreadsheetApp: env.spreadsheetApp,
    Session: env.session,
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() { released++; } }) }
  });
  context.getCatalog = () => catalog;
  const p = payload();
  context.submitQuiz(p); context.submitQuiz(p);
  assert.equal(rows.length, 3); assert.equal(released, 2);
  assert.equal(rows[1][2], 'student@example.com');
  assert.equal(rows[1][5], 'code');
  assert.equal(rows[1][6], "'=1+1;\nconsole.log(\"test\");");
  assert.equal(rows[1][7], '正解');
  assert.equal(rows[1][8], '正解です。');
  const files = { entry: 'index.html', files: { 'index.html': '<html><link rel="stylesheet" href="style.css"><p>本文</p></html>', 'style.css': 'p{color:blue}' } };
  context.submitQuiz({ ...p, attemptId: 'attempt-000000000003', answers: { ...p.answers, code: files } });
  assert.deepEqual(JSON.parse(rows[3][6]), files);
  failWrite = true;
  assert.throws(() => context.submitQuiz({ ...p, attemptId: 'attempt-000000000002' }), /write failed/);
  assert.equal(released, 4);
});

test('埋め込みのCatalogからカタログを読む', async () => {
  const files = { Catalog: '<script type="application/json" id="Catalog">{"catalog":[{"id":"q1","items":[]}],"imageFiles":{}}</script>\n' };
  const context = await loadServer({
    HtmlService: { createHtmlOutputFromFile: name => ({ getContent: () => files[name] }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => null, setProperty() {} }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => null, openById() {}, create() {}, flush() {} },
    Session: { getActiveUser: () => ({ getEmail: () => '' }), getEffectiveUser: () => ({ getEmail: () => '' }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) }
  });
  assert.deepEqual(JSON.parse(JSON.stringify(context.getCatalog())), [{ id: 'q1', items: [] }]);
});

test('実習ページの変更内容をGASへ保存でき、欠損・過大な回答を拒否する', async () => {
 const quiz=[{id:'exercise',items:[{id:'post',type:'dom_task',required:true}]}];
 const answer={text:'こんにちは',color:'rgb(0, 0, 255)',visible:true};
 const make=value=>({...payload(),quizId:'exercise',answers:{post:value},grading:{items:[{itemId:'post',passed:true,feedback:'正解です。'}]}});
 assert.deepEqual(validateSubmission(make(answer),quiz).answers[0].value,answer);
 for(const invalid of ['', {name:'old.png',dataUrl:'data:image/png;base64,AAAA'}, {...answer,text:''}, {...answer,text:'x'.repeat(20001)}, {...answer,color:5}, {...answer,visible:'true'}]) assert.throws(()=>validateSubmission(make(invalid),quiz));
 const rows=[['記録ID', 'タイムスタンプ', 'ユーザー', 'セッションID', 'レッスンID', '問題ID', '回答内容', '正誤', 'フィードバック']];
 const env=answerBook(rows);
 const context=await loadServer({PropertiesService:{getScriptProperties:()=>({getProperty:key=>env.properties[key]??null,setProperty:(key,value)=>{env.properties[key]=value;}})},SpreadsheetApp:env.spreadsheetApp,Session:env.session,LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})}});
 context.getCatalog=()=>quiz;
 context.submitQuiz(make(answer));assert.deepEqual(JSON.parse(rows[1][6]),answer);
});
