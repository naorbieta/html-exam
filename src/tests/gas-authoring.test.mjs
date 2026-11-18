import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { readAuthoringData } from '../scripts/data.mjs';
import { catalogFromTables } from '../catalog.mjs';
import { jsonHtmlDocument, packImageFiles } from '../gas-data.mjs';

const serverCode = (await Promise.all(['gas-data.mjs','submission.mjs'].map(name=>readFile(new URL('../'+name,import.meta.url),'utf8')))).join('\n').replace(/^import .*;\n/gm,'').replace(/^export /gm,'') + '\n' + await readFile(new URL('../gas/Code.gs',import.meta.url),'utf8');

class Sheet {
  constructor(name, rows = []) { this.name=name;this.rows=structuredClone(rows);this.hidden=false;this.frozenRows=0; }
  getName() { return this.name; }
  getDataRange() { return this.getRange(1,1,this.rows.length,this.rows[0]?.length || 0); }
  getLastRow() { return this.rows.length; }
  getLastColumn() { return this.rows.reduce((max, row) => Math.max(max, row.length), 0); }
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
  insertColumnAfter(index) {
    for (const row of this.rows) row.splice(index, 0, '');
  }
  setFrozenRows(value) { this.frozenRows=value; }
  appendRow(row) { this.rows.push(row); }
}

function server(options = {}) {
  const files = { ...(options.files || {}) };
  const sheets = new Map();
  if (options.answerRows) sheets.set('answers', new Sheet('answers', options.answerRows));
  let released=0;
  const meta={createdName:''};
  const properties = { SPREADSHEET_ID: options.spreadsheetId === undefined ? 'book' : options.spreadsheetId };
  const book={getSheetByName:name=>sheets.get(name)||null,insertSheet:name=>{const sheet=new Sheet(name);sheets.set(name,sheet);return sheet;},getId:()=> 'book',getUrl:()=> 'https://example.invalid/book'};
  const context=vm.createContext({console:{log(){}},
    PropertiesService:{getScriptProperties:()=>({getProperty:key=>properties[key] ?? null, setProperty:(key,value)=>{properties[key]=value;}})},
    LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){released++;}})},
    SpreadsheetApp:{
      getActiveSpreadsheet:()=>options.active === false ? null : (options.activeBook || (properties.SPREADSHEET_ID ? book : null)),
      openById:()=>book,
      create:name=>{meta.createdName=name;properties.SPREADSHEET_ID='book';return book;},
      flush(){}
    },
    HtmlService:{createHtmlOutputFromFile:name=>{
      if (!files[name]) throw new Error('ファイルがありません: ' + name);
      return { getContent:()=>files[name] };
    }},
    Session:{
      getActiveUser:()=>({getEmail:()=>options.email ?? ''}),
      getEffectiveUser:()=>({getEmail:()=>options.email ?? ''})
    }
  });
  vm.runInContext(serverCode,context);
  return {context,sheets,book,releases:()=>released,properties,meta,files,get createdName(){return meta.createdName;}};
}

function filesFor(catalog, imageData = {}) {
  const packed = packImageFiles(imageData);
  const files = { Catalog: jsonHtmlDocument('Catalog', { catalog, imageFiles: packed.index }) };
  for (const file of packed.files) files[file.name] = file.html;
  return files;
}

test('アプリに埋め込んだ問題と画像を読み、差し替えると載せ替わる', async () => {
  const { imageFiles, ...tables } = await readAuthoringData();
  const catalog = catalogFromTables(tables);
  const samplePath = 'images/sample.png';
  const withImage = catalog.map((quiz, index) => index === 0 ? { ...quiz, images: [{ path: samplePath, alt: '例' }] } : quiz);
  const imageData = { [samplePath]: 'data:image/png;base64,AAAA' };
  const app = server({ files: filesFor(withImage, imageData) });
  app.context.setup_();
  assert.ok(app.sheets.get('answers'));
  assert.equal(app.sheets.get('answers').frozenRows, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(app.sheets.get('answers').rows[0])), ['記録ID', 'タイムスタンプ', 'ユーザー', 'セッションID', 'レッスンID', '問題ID', '回答内容', '正誤', 'フィードバック']);
  const loaded = app.context.getCatalog();
  assert.deepEqual(JSON.parse(JSON.stringify(loaded.map(quiz => quiz.id))), catalog.map(quiz => quiz.id));
  assert.ok(loaded.every(quiz => quiz.id.startsWith('exam-')));
  assert.ok(loaded[0].items[0].grading);
  const images = app.context.getQuizImages(catalog[0].id);
  assert.equal(images[samplePath], 'data:image/png;base64,AAAA');

  const swapped = [{
    id: 'new-1', number: 1, title: '差し替えレッスン', description: '導入', course: '試験 / 確認',
    images: [],
    items: [{ id: 'new-a', type: 'multiple_choice', title: '新しい問い', description: '', required: true, options: ['はい', 'いいえ'], grading: { kind: 'text', config: { accept: ['はい'] }, example: 'はい', feedback: 'ちがいます' } }]
  }];
  Object.assign(app.files, filesFor(swapped));
  const next = app.context.getCatalog();
  assert.deepEqual([...next.map(quiz => quiz.id)], ['new-1']);
  assert.equal(next[0].items[0].grading.config.accept[0], 'はい');
  const savedAnswers = JSON.stringify(app.sheets.get('answers').rows);
  app.context.setup_();
  assert.equal(JSON.stringify(app.sheets.get('answers').rows), savedAnswers);
});

test('回答ログのシートが無ければ作成し、スプレッドシートも自動で用意する', () => {
  const catalog = [{ id: 'q1', images: [], items: [] }];
  const app = server({ files: filesFor(catalog), spreadsheetId: null, active: false });
  const url = app.context.setup_();
  assert.equal(url, 'https://example.invalid/book');
  assert.equal(app.createdName, 'Web試験 回答ログ');
  assert.equal(app.properties.SPREADSHEET_ID, 'book');
  assert.ok(app.sheets.get('answers'));
});

test('空の answers シートなら、現在の見出しを書く', () => {
  const catalog = [{ id: 'q1', images: [], items: [] }];
  const app = server({ files: filesFor(catalog), answerRows: [['未設定']] });
  app.context.setup_();
  assert.deepEqual(JSON.parse(JSON.stringify(app.sheets.get('answers').rows[0])), ['記録ID', 'タイムスタンプ', 'ユーザー', 'セッションID', 'レッスンID', '問題ID', '回答内容', '正誤', 'フィードバック']);
});

test('埋め込みデータが壊れていてもロックを使わずに案内する', () => {
  const app = server({ files: { Catalog: 'broken' } });
  assert.throws(() => app.context.getCatalog(), /形式|JSON|Unexpected/);
  assert.equal(app.releases(), 0);
});
