import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { readAuthoringData } from '../scripts/data.mjs';
import { catalogFromTables } from '../src/catalog.mjs';
import { authoringFromTables, questionColumns } from '../src/authoring.mjs';

const serverCode = (await Promise.all(['authoring.mjs','catalog.mjs','uploaded-file.mjs','submission.mjs'].map(name=>readFile(new URL('../src/'+name,import.meta.url),'utf8')))).join('\n').replace(/^import .*;\n/gm,'').replace(/^export /gm,'') + '\n' + await readFile(new URL('../gas/Code.gs',import.meta.url),'utf8');

class Sheet {
  constructor(name, rows = []) { this.name=name;this.rows=structuredClone(rows);this.hidden=false;this.validations=[]; }
  getName() { return this.name; }
  getMaxRows() { return Math.max(1000,this.rows.length); }
  getLastColumn() { return this.rows[0]?.length || 0; }
  getDataRange() { return this.getRange(1,1,this.rows.length,this.getLastColumn()); }
  getRange(row,col,height=1,width=1) {
    const range = {
      getValues:()=>this.rows.slice(row-1,row-1+height).map(values=>values.slice(col-1,col-1+width)),
      setValues:values=>{values.forEach((values,i)=>{this.rows[row-1+i]??=[];values.forEach((v,j)=>{this.rows[row-1+i][col-1+j]=typeof v==='string'?v.replace(/^'(?=[=+\-@])/,''):v;});});return range;},
      setValue:value=>range.setValues([[value]]),
      setNumberFormat:()=>range,setVerticalAlignment:()=>range,setWrap:()=>range,
      setFontWeight:()=>range,setBackground:()=>range,createFilter:()=>{this.filterHeight=height;return range;},
      shiftColumnGroupDepth:()=>range,
      setDataValidation:rule=>{this.validations.push({col,rule});return range;}
    };
    return range;
  }
  setFrozenRows(value) { this.frozenRows=value; }
  setFrozenColumns(value) { this.frozenColumns=value; }
  setColumnWidths() {} setColumnWidth() {} setRowHeights() {}
  getColumnGroup() { return {collapse:()=>{this.collapsed=true;}}; }
  hideColumns() { this.hiddenColumns=true; }
  hideSheet() { this.hidden=true; }
  appendRow(row) { this.rows.push(row); }
}

function server(tables, initial = {}) {
  const sheets = new Map(Object.entries(initial).map(([name,rows])=>[name,new Sheet(name,rows)]));
  let sequence=0, released=0;
  const book={getSheetByName:name=>sheets.get(name)||null,insertSheet:name=>{const sheet=new Sheet(name);sheets.set(name,sheet);return sheet;},getId:()=> 'book',getUrl:()=> 'https://example.invalid/book'};
  const context=vm.createContext({console:{log(){}},Utilities:{getUuid:()=>String(++sequence)},
    HtmlService:{createHtmlOutputFromFile:()=>({getContent:()=>JSON.stringify(tables)})},
    PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'book'})},
    LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){released++;}})},
    SpreadsheetApp:{openById:()=>book,newDataValidation:()=>{
      const rule={requireValueInList(values){this.values=values;return this;},setAllowInvalid(value){this.allowInvalid=value;return this;},build(){return this;}};return rule;
    }}
  });
  vm.runInContext(serverCode,context);
  return {context,sheets,book,releases:()=>released};
}

test('GASの設問シートに1行足すと読み込まれ、自動IDは並べ替えや編集で変わらない', async () => {
  const tables=await readAuthoringData();
  const app=server(tables); app.context.setup_();
  assert.deepEqual([...app.sheets.keys()],['レッスン','設問','answers']);
  const questions=app.sheets.get('設問');
  assert.equal(questions.frozenColumns,2); assert.equal(questions.collapsed,true);
  assert.equal(questions.filterHeight,questions.getMaxRows());
  assert.ok(questions.validations.some(v=>v.col===4&&v.rule.values.includes('単一選択')));
  const row=questionColumns.map(key=>({'分野':'JavaScript / 初級','レッスン番号':'1','設問':'追加した問い','回答形式':'単一選択','選択肢':'A\nB','正解':'B'}[key]||''));
  questions.rows.push(row);
  let catalog=app.context.getCatalog(), item=catalog.find(q=>q.id==='quiz-01').items.at(-1);
  assert.equal(item.title,'追加した問い'); assert.equal(item.grading.config.accept[0],'B');
  const id=item.id;
  row[2]='編集した問い'; questions.rows.splice(1,0,questions.rows.pop());
  item=app.context.getCatalog().flatMap(q=>q.items).find(item=>item.id===id);
  assert.equal(item.title,'編集した問い');
  assert.equal(questions.rows[1][questionColumns.indexOf('設問ID')],id);
  const saved=JSON.stringify(questions.rows);
  app.context.setup_(); assert.equal(JSON.stringify(questions.rows),saved);
  assert.equal(app.releases(),2);
});

test('旧シートの実データと独自採点条件を移し、元シートと回答記録を保持する', () => {
  const old={quizzes:[['id','number','title','description','course'],['q',1,'元のタイトル','元の導入文','Web']],items:[['id','quiz_id','position','type','title','description','required','context','language'],['i','q',1,'code','元の問い','条件文','true','','js']],options:[['item_id','position','value']],images:[['quiz_id','position','path','alt']],graders:[['item_id','kind','config','example','feedback','hint','starter'],['i','code','{"check":"h.assert(h.logs.length===2);"}','console.log(1);console.log(2);','2回出力','','console.log();']]};
  const snapshot=JSON.stringify(old), source=authoringFromTables(old);
  const app=server({...source,rules:{}},{...old,answers:[['attempt_id'],['existing-answer']]});
  app.context.setup_();
  const loaded=JSON.parse(JSON.stringify(app.context.getCatalog()));
  assert.deepEqual(loaded,catalogFromTables(old));
  assert.equal(app.sheets.get('_採点ルール').hidden,true);
  assert.equal(app.sheets.get('quizzes').hidden,true);
  for(const [name,rows]of Object.entries(old))assert.deepEqual(app.sheets.get(name).rows,rows);
  assert.equal(JSON.stringify(old),snapshot);
  assert.equal(app.sheets.get('answers').rows[1][0],'existing-answer');
});

test('GAS読み込み時の入力エラーでもロックを解放する', async () => {
  const source=await readAuthoringData(), app=server(source);app.context.setup_();
  const sheet=app.sheets.get('設問'), type=sheet.rows[0].indexOf('回答形式');sheet.rows[1][type]='不明';
  assert.throws(()=>app.context.getCatalog(),/設問シート 2行目.*回答形式/);
  assert.equal(app.releases(),1);
});
