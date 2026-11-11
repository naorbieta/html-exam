import test from 'node:test';
import assert from 'node:assert/strict';
import { readAuthoringData } from '../scripts/data.mjs';
import { catalogFromTables } from '../catalog.mjs';
import { gradeAnswer } from '../grader.mjs';
const tables=await readAuthoringData();
const catalog=catalogFromTables(tables);
const item=(number,index=0)=>catalog.find(quiz=>quiz.number===number).items[index];

test('変数の宣言・代入・表示では日本語の有効な変数名も受け付ける', () => {
  const fields=catalog.find(quiz=>quiz.id==='quiz-06').items;
  for(const [index,source]of ['let 名前;','let 名前; 名前="太郎";','let 名前="太郎"; console.log(名前);'].entries()) {
    assert.equal(gradeAnswer(fields[index],source).passed,true,fields[index].id);
  }
});

test('テンプレートリテラルでは画像内の感嘆符・疑問符の全角半角で誤答にしない', () => {
  const field=catalog.find(quiz=>quiz.id==='quiz-49').items[0];
  for(const punctuation of [['!','?'],['！','？']]) {
    const [bang,question]=punctuation;
    const source='let friendName="太郎"; console.log(`こんにちは、${friendName}'+bang+'\\n今日は何をしましょうか'+question+'\\n公園で遊ぶのはどうですか'+question+'`);';
    assert.equal(gradeAnswer(field,source).passed,true);
  }
  assert.equal(gradeAnswer(field,'let friendName="太郎"; console.log(`こんにちは、${friendName}！`);').passed,false);
});

test('自動採点対象の解答例がすべて採点条件を満たす',()=>{
  let count=0;
  for(const quiz of catalog){
    const answers=Object.fromEntries(quiz.items.map(item=>[item.id,['checkboxes','dom_task','file'].includes(item.type)&&item.grading.kind!=='manual'?JSON.parse(item.grading.example):item.grading.example]));
    for(const item of quiz.items){if(['manual','render'].includes(item.grading.kind))continue;const result=gradeAnswer(item,answers[item.id],answers);assert.equal(result.passed,true,`第${quiz.number}問 ${item.id}: ${result.feedback}`);count++;}
  }
  assert.ok(count>0);
  assert.equal(count,catalog.flatMap(q=>q.items).filter(i=>!['manual','render'].includes(i.grading.kind)).length);
});

test('初期コードだけでは問題の解答にならない', () => {
  const fields = catalog.flatMap(quiz => quiz.items).filter(item => item.type === 'code' && item.grading.starter && item.grading.kind !== 'render');
  assert.ok(fields.length > 0);
  for (const field of fields) assert.equal(gradeAnswer(field, field.grading.starter).passed, false, field.id);
});

test('誤答と動作が一部しか合わないコードを不正解にする',()=>{
  const wrong=[
    [3,'12'],[25,'function maxNumber(a,b){return 10;}'],
    [38,'document.getElementById("btn").onclick=()=>{document.querySelector(".text").style.display="none";}'],
    [41,'let count=5;setInterval(()=>{console.log(count--);},1000);'],
    [50,'<img id="main-image" src="a.jpg"><p id="caption">A</p>']
  ];
  for(const [number,answer] of wrong)assert.equal(gradeAnswer(item(number),answer).passed,false,`第${number}問`);
});

test('解答例と書き方が違っても必要な動作があれば正解にする',()=>{
  assert.equal(gradeAnswer(item(25),'function maxNumber(a,b){return Math.max(a,b);}').passed,true);
  assert.equal(gradeAnswer(item(33),'document.getElementById("text").textContent="新しい文章";').passed,true);
});

test('全文を表示する継続問題は、前問の宣言を重ねずに採点する', () => {
  const field = { id: 'assignment', type: 'code', grading: { kind: 'code', config: { completeProgram: true, previous: ['declaration'], check: "h.assert(userName === '太郎');" } } };
  assert.equal(gradeAnswer(field, "let userName='太郎';", { declaration: 'let userName;' }).passed, true);
  assert.equal(gradeAnswer(field, "let userName='花子';", { declaration: 'let userName;' }).passed, false);
});

test('構文エラーを解答欄単位のフィードバックとして返す',()=>{
  const result=gradeAnswer(item(1),'const = ;');
  assert.equal(result.passed,false);assert.match(result.feedback,/エラー/);
});

test('チェックボックスはクリックした順序によらず完全一致で採点する', () => {
  const field=catalog.find(q=>q.id==='web-27').items[0];
  assert.equal(gradeAnswer(field,['４','３']).passed,true);
  assert.equal(gradeAnswer(field,['３']).passed,false);
  assert.equal(gradeAnswer(field,['３','４','５']).passed,false);
});

test('HTMLの断片を採点し、要素や属性の不足を不正解にする', () => {
  const field=catalog.find(q=>q.id==='web-45').items[0];
  assert.equal(gradeAnswer(field,'<meta name="viewport" content="width=device-width, initial-scale=1">').passed,true);
  assert.equal(gradeAnswer(field,'<meta name="viewport" content="width=980">').passed,false);
});

test('フォントの印象は正しい選択肢の組み合わせで採点し、欠落・余分な選択・逆の組み合わせを拒否する', () => {
 const fields=catalog.find(q=>q.id==='web-66').items;
 const sets=[['親近感','カジュアル','力強い'],['高級感','和風','大人っぽい']];
 for(const [i,field] of fields.slice(0,2).entries()){
  const correct=gradeAnswer(field,[...sets[i]].reverse());
  assert.equal(correct.passed,true);assert.equal(correct.unscored,undefined);
  assert.equal(gradeAnswer(field,sets[i].slice(0,2)).passed,false);
  assert.equal(gradeAnswer(field,[...sets[i],sets[1-i][0]]).passed,false);
  assert.equal(gradeAnswer(field,sets[1-i]).passed,false);
 }
});

const web=(number,index=0)=>catalog.find(quiz=>quiz.id===`web-${String(number).padStart(2,'0')}`).items[index];
test('負のz-indexの子要素は、自身のスタッキングコンテキストの親背景より上に描かれる',()=>{
 assert.equal(gradeAnswer(web(33,1),'３→２→１').passed,true);
 assert.equal(gradeAnswer(web(33,1),'３→１→２').passed,false);
});
test('配色は指定した背景とのコントラスト比を計算して採点する',()=>{
 assert.equal(gradeAnswer(web(64,1),'#000').passed,true);
 assert.equal(gradeAnswer(web(64,1),'#ffffff').passed,false);
 assert.equal(gradeAnswer(web(64,1),'#999').passed,false);
 assert.equal(gradeAnswer(web(64,1),'dark').passed,false);
 assert.equal(gradeAnswer(web(64),['【２】の文字']).passed,true);
 assert.equal(gradeAnswer(web(64),['【１】の文字']).passed,false);
});
test('図の名称ごとに番号を選び、対応しない番号を不正解にする',()=>{
 assert.equal(gradeAnswer(web(15),'⑤').passed,true);
 assert.equal(gradeAnswer(web(15),'②').passed,false);
 assert.equal(gradeAnswer(web(15,1),'②').passed,true);
 assert.equal(gradeAnswer(web(15,1),'③').passed,false);
});
test('レイアウト手法と、その配置に適した理由を組にして選ぶ',()=>{
 assert.equal(gradeAnswer(web(36),'float').passed,false);
 assert.equal(gradeAnswer(web(36),'float：要素の周りに文章を回り込ませる').passed,true);
 assert.equal(gradeAnswer(web(36),'grid：行と列を組み合わせて二次元に配置する').passed,false);
});
test('説明文の自由回答をキーワード一致で採点せず、選択肢の中だけで正誤を判定する',()=>{
 for(const field of catalog.flatMap(q=>q.items)){
  if(['short_text','paragraph'].includes(field.type)) assert.equal(field.grading.config.patterns,undefined,field.id);
  if(field.type!=='multiple_choice')continue;
  const passes=field.options.filter(value=>gradeAnswer(field,value).passed);
  assert.equal(passes.length,1,field.id);
  assert.equal(gradeAnswer(field,'選択肢にない回答').passed,false,field.id);
 }
});
test('アンカーのidはHTML属性として読み、リンク先を前問で選んだidに合わせる',()=>{
 const target=web(38,1),link=web(38,2);
 for(const attr of ['id="target"',"id='section-2'",'id=123','id="日本語"']){
  assert.equal(gradeAnswer(target,attr).passed,true,attr);
 }
 for(const attr of ['class="target"','id=""','id="two words"'])assert.equal(gradeAnswer(target,attr).passed,false,attr);
 assert.equal(gradeAnswer(link,'/test.html#section-2',{[target.id]:"id='section-2'"}).passed,true);
 assert.equal(gradeAnswer(link,'test.html#123',{[target.id]:'id=123'}).passed,true);
 assert.equal(gradeAnswer(link,'/test.html#%E6%97%A5%E6%9C%AC%E8%AA%9E',{[target.id]:'id="日本語"'}).passed,true);
 for(const url of ['/test.html#wrong','/other.html#section-2','https://elsewhere.example/test.html#section-2'])assert.equal(gradeAnswer(link,url,{[target.id]:'id="section-2"'}).passed,false,url);
 assert.equal(gradeAnswer(link,'/test.html#section-2',{}).passed,false);
});
test('パスは対象URLへの到達を判定し、大文字小文字が違うファイルを拒否する',()=>{
 assert.equal(gradeAnswer(web(7),'https://EXAMPLE.com/image/test.jpg').passed,true);
 assert.equal(gradeAnswer(web(7),'https://example.com/image/Test.jpg').passed,false);
 assert.equal(gradeAnswer(web(7,1),'../image/./test.jpg').passed,true);
 assert.equal(gradeAnswer(web(7,1),'/image/test.jpg').passed,false);
 assert.equal(gradeAnswer(web(17),'../../../items/js/./staff.js').passed,true);
 assert.equal(gradeAnswer(web(17),'../../../items/js/Staff.js').passed,false);
 assert.equal(gradeAnswer(web(17),'https://example.com/items/js/staff.js').passed,false);
 assert.equal(gradeAnswer(web(17,1),'../../../items/image/staff/staff.jpg').passed,true);
});
test('見本の書体名を選択し、別の書体を拒否する',()=>{
 assert.equal(gradeAnswer(web(71),'ヒラギノ角ゴ').passed,true);
 assert.equal(gradeAnswer(web(71),'A1明朝').passed,false);
 assert.equal(gradeAnswer(web(71,2),'Noto Sans').passed,true);
 assert.equal(gradeAnswer(web(71,1),'Noto Sans').passed,false);
});

test('検証ツールの本文編集は対象の文字の変更を採点する',()=>{
 const field=web(55),base={text:'ふとんがふっとんだ',color:'rgb(15, 20, 25)',visible:true};
 assert.equal(gradeAnswer(field,base).passed,false);
 assert.equal(gradeAnswer(field,{...base,text:'新しい投稿'}).passed,true);
 assert.equal(gradeAnswer(field,{...base,text:' ふとんがふっとんだ\n'}).passed,false);
 assert.equal(gradeAnswer(field,{...base,text:' '}).passed,false);
 assert.equal(gradeAnswer(field,{...base,text:'新しい投稿',visible:false}).passed,false);
});
test('検証ツールの文字色編集は前の本文を保ち、色そのものの変更を採点する',()=>{
 const field=web(55,1),prior={text:'新しい投稿',color:'rgb(15, 20, 25)',visible:true};
 const answers={'web-55-answer-1':prior};
 assert.equal(gradeAnswer(field,prior,answers).passed,false);
 assert.equal(gradeAnswer(field,{...prior,color:'rgb(0, 0, 255)'},answers).passed,true);
 assert.equal(gradeAnswer(field,{...prior,text:'別の投稿',color:'rgb(0, 0, 255)'},answers).passed,false);
 assert.equal(gradeAnswer(field,{...prior,color:'rgba(0, 0, 0, 0)'},answers).passed,false);
 const red={...prior,color:'rgb(255, 0, 0)'};
 assert.equal(gradeAnswer(field,red,{'web-55-answer-1':red}).passed,false);
 assert.equal(gradeAnswer(field,prior,{'web-55-answer-1':red}).passed,true);
});

test('文字色の変更は色の書き方が違っても結果で正解にする', () => {
  const field = catalog.find(quiz => quiz.id === 'quiz-34').items[0];
  for (const source of [
    'document.querySelector(".text").style.color="red";',
    'document.querySelector(".text").style.color="#f00";',
    'document.querySelector(".text").style.color="rgb(255,0,0)";',
    'document.querySelector(".text").style.setProperty("color","blue");',
  ]) {
    assert.equal(gradeAnswer(field, source).passed, true, source);
  }
  assert.equal(gradeAnswer(field, 'document.querySelector(".text");').passed, false);
});

test('背景色の変更は色の書き方が違っても結果で正解にする', () => {
  const field = catalog.find(quiz => quiz.id === 'quiz-35').items[0];
  for (const source of [
    'text.style.backgroundColor="red";',
    'text.style.backgroundColor="#ff0000";',
    'text.style.background="rgb(0, 128, 0)";',
    'text.style.setProperty("background-color","yellow");',
  ]) {
    assert.equal(gradeAnswer(field, source).passed, true, source);
  }
  assert.equal(gradeAnswer(field, 'text.style.color="red";').passed, false);
});

test('開閉ボタンはdisplayやhiddenの切替でも正解にする', () => {
  const field = catalog.find(quiz => quiz.id === 'quiz-38').items[0];
  const script = source => `<!doctype html><html><body><div class="wrapper"><button id="toggle-btn">開閉ボタン</button><div class="text" style="display:none">こんにちは</div></div><script>${source}<\/script></body></html>`;
  assert.equal(gradeAnswer(field, script('document.getElementById("toggle-btn").addEventListener("click",()=>{const t=document.querySelector(".text");t.style.display=t.style.display==="none"?"block":"none";});')).passed, true, 'display toggle');
  assert.equal(gradeAnswer(field, script('const t=document.querySelector(".text");t.style.display="";t.hidden=true;document.getElementById("toggle-btn").addEventListener("click",()=>{t.hidden=!t.hidden;});')).passed, true, 'hidden toggle');
  assert.equal(gradeAnswer(field, script('document.getElementById("toggle-btn").addEventListener("click",()=>{});')).passed, false);
});
