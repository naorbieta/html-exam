import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { readAuthoringData } from '../scripts/data.mjs';
import { catalogFromTables } from '../../src/catalog.mjs';
import { packRowsFromTables, tablesFromPack, PACK_SHEET_NAME } from '../../src/pack.mjs';

const serverCode = (await Promise.all(['pack.mjs','catalog.mjs','uploaded-file.mjs','submission.mjs'].map(name=>readFile(new URL('../../src/'+name,import.meta.url),'utf8')))).join('\n').replace(/^import .*;\n/gm,'').replace(/^export /gm,'') + '\n' + await readFile(new URL('../../src/gas/Code.gs',import.meta.url),'utf8');

class Sheet {
  constructor(name, rows = []) { this.name=name;this.rows=structuredClone(rows);this.hidden=false; }
  getName() { return this.name; }
  getDataRange() { return this.getRange(1,1,this.rows.length,this.rows[0]?.length || 0); }
  getLastRow() { return this.rows.length; }
  getRange(row,col,height=1,width=1) {
    const range = {
      getValues:()=>this.rows.slice(row-1,row-1+height).map(values=>values.slice(col-1,col-1+width)),
      setValues:values=>{values.forEach((values,i)=>{this.rows[row-1+i]??=[];values.forEach((v,j)=>{this.rows[row-1+i][col-1+j]=typeof v==='string'?v.replace(/^'(?=[=+\-@])/,''):v;});});return range;},
      setValue:value=>range.setValues([[value]]),
      setNumberFormat:()=>range,
      createTextFinder:value=>({matchEntireCell(){return this;},findNext:()=>this.rows.slice(row-1,row-1+height).some(values=>String(values[col-1])===value)?{}:null})
    };
    return range;
  }
  setFrozenRows(value) { this.frozenRows=value; }
  appendRow(row) { this.rows.push(row); }
}

function server(sheetRows, options = {}) {
  const sheets = new Map();
  if (sheetRows) sheets.set(PACK_SHEET_NAME, new Sheet(PACK_SHEET_NAME, sheetRows));
  let released=0;
  const spreadsheetId = options.spreadsheetId === undefined ? 'book' : options.spreadsheetId;
  const book={getSheetByName:name=>sheets.get(name)||null,insertSheet:name=>{const sheet=new Sheet(name);sheets.set(name,sheet);return sheet;},getId:()=> 'book',getUrl:()=> 'https://example.invalid/book'};
  const context=vm.createContext({console:{log(){}},
    PropertiesService:{getScriptProperties:()=>({getProperty:()=>spreadsheetId, setProperty(){}})},
    LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){released++;}})},
    SpreadsheetApp:{openById:()=>book,create:()=>book}
  });
  vm.runInContext(serverCode,context);
  return {context,sheets,book,releases:()=>released};
}

test('CSVを取り込んだシートから問題と採点・画像を読み込み、差し替えると載せ替わる', async () => {
  const { imageFiles, ...tables } = await readAuthoringData();
  const imageData = { 'images/quiz-01-01.png': 'data:image/png;base64,AAAA' };
  const pack = packRowsFromTables(tables, imageData);
  const app = server(pack);
  app.context.setup_();
  assert.ok(app.sheets.get('answers'));
  assert.equal(app.sheets.get('answers').frozenRows, 1);
  const catalog = app.context.getCatalog();
  assert.deepEqual(JSON.parse(JSON.stringify(catalog.map(quiz => quiz.id))), catalogFromTables(tables).map(quiz => quiz.id));
  const hello = catalog.find(quiz => quiz.id === 'quiz-01').items[0];
  assert.equal(hello.grading.kind, 'code');
  assert.match(hello.grading.config.check, /Hello World/);
  const images = app.context.getQuizImages('quiz-01');
  assert.equal(images['images/quiz-01-01.png'], 'data:image/png;base64,AAAA');

  const swapped = packRowsFromTables({
    quizzes: [['id','number','title','description','course'],['new-1',1,'差し替えレッスン','導入','JavaScript / 初級']],
    items: [['id','quiz_id','position','type','title','description','required','context','language','reference_editable'],['new-a','new-1',1,'short_text','新しい問い','','true','','','false']],
    options: [['item_id','position','value']],
    images: [['quiz_id','position','path','alt']],
    graders: [['item_id','kind','config','example','feedback','hint','starter'],['new-a','text','{"accept":["はい"]}','はい','ちがいます','','']]
  });
  app.sheets.get(PACK_SHEET_NAME).rows = swapped;
  const next = app.context.getCatalog();
  assert.deepEqual([...next.map(quiz => quiz.id)], ['new-1']);
  assert.equal(next[0].items[0].grading.config.accept[0], 'はい');
  const saved = JSON.stringify(app.sheets.get(PACK_SHEET_NAME).rows);
  app.context.setup_();
  assert.equal(JSON.stringify(app.sheets.get(PACK_SHEET_NAME).rows), saved);
  assert.ok(app.releases() >= 1);
});

test('問題データシートが無い場合は取り込み手順を案内する', () => {
  const app = server(null);
  assert.throws(() => app.context.setup_(), /問題データ/);
  assert.throws(() => app.context.getCatalog(), /問題データ/);
});

test('GAS読み込み時の入力エラーでもロックを解放する', async () => {
  const { imageFiles, ...tables } = await readAuthoringData();
  const pack = packRowsFromTables(tables);
  pack[1][0] = '';
  const app = server(pack);
  assert.throws(() => app.context.getCatalog(), /問題データ/);
  assert.equal(app.releases(), 1);
});
