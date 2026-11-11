import { gradeAnswer } from '../src/grader.mjs';
import { gradeRenderedAnswer } from '../src/render-grader.mjs';

export async function checkGradingRegressions(catalog) {
  const items = new Map(catalog.flatMap(quiz=>quiz.items.map(item=>[item.id,item]))), lines=[];
  const cases=[
    ['web-06-answer-1','模範のインライン指定','<div style="position:relative;background:gray;width:200px;height:200px"><div style="position:absolute;bottom:0;right:0">テキスト</div></div>',true],
    ['web-06-answer-1','0pxと#808080','<div style="position:relative;background:#808080;width:200px;height:200px"><div style="position:absolute;bottom:0px;right:0px">テキスト</div></div>',true],
    ['web-06-answer-1','rgbとinset','<div style="width:200px;height:200px;background-color:rgb(128,128,128);position:relative"><div style="position:absolute;inset:auto 0 0 auto">テキスト</div></div>',true],
    ['web-06-answer-1','greyキーワード','<div style="position:relative;background:grey;width:200px;height:200px"><div style="position:absolute;right:0;bottom:0">テキスト</div></div>',true],
    ['web-06-answer-1','style要素だけ（インラインでない）','<style>div{position:relative;background:gray;width:200px;height:200px}div div{position:absolute;bottom:0;right:0}</style><div><div>テキスト</div></div>',false],
    ['web-06-answer-1','右下でない','<div style="position:relative;background:gray;width:200px;height:200px"><div style="position:absolute;top:0;left:0">テキスト</div></div>',false],
    ['web-06-answer-1','サイズ違い','<div style="position:relative;background:gray;width:100px;height:100px"><div style="position:absolute;bottom:0;right:0">テキスト</div></div>',false],
    ['web-06-answer-1','背景が赤','<div style="position:relative;background:red;width:200px;height:200px"><div style="position:absolute;bottom:0;right:0">テキスト</div></div>',false],
    ['web-31-answer-2',':emptyで文字表示','p:empty::before{content:"文字"}',true],
    ['web-31-answer-2','::afterでも可','p:empty::after{content:"OK"}',true],
    ['web-31-answer-2',':emptyなしのlast-child','p:last-child::before{content:"文字"}',false],
    ['web-32-answer-3','タグ名を省略した属性セレクタ','[type="text"]{width:300px}',true],
    ['web-32-answer-3','大文字の属性セレクタ','INPUT[TYPE="text"]{width:300px}',true],
    ['web-32-answer-3','nameの属性セレクタ','[name^="text"]{width:300px}',true],
    ['web-32-answer-3','notの中の属性セレクタ','input:not([type=submit]){width:300px}',true],
    ['web-32-answer-3','属性セレクタをコメントにだけ書く','/* input[type=text] */ input:not(:last-child){width:300px}',false],
    ['web-32-answer-3','属性セレクタなし','input:not(:last-child){width:300px}',false],
    ['web-48-answer-1','同じ縦グラデーションを角度で指定','.gradation1{background:linear-gradient(.5turn,red,yellow)}',true],
    ['web-48-answer-1','方向と色順を逆にして同じ表示','.gradation1{background:linear-gradient(0deg,yellow,red)}',true],
    ['web-48-answer-1','横向きのグラデーション','.gradation1{background:linear-gradient(to left,red,yellow)}',false],
    ['web-48-answer-1','上下の色が逆','.gradation1{background:linear-gradient(to top,red,yellow)}',false],
    ['web-48-answer-2','同じ斜めグラデーションを角度で指定','.gradation2{background:linear-gradient(135deg,blue,transparent)}',true],
    ['web-48-answer-2','青でない色','.gradation2{background:linear-gradient(135deg,red,transparent)}',false],
    ['web-48-answer-2','斜めでなく横方向','.gradation2{background:linear-gradient(to right,blue,transparent)}',false],
    ['web-48-answer-3','中心と外側の色を逆にする','.gradation3{background:radial-gradient(circle,white,lime)}',false],
    ['web-60-answer-1','同じ回転をrotateZで指定','@keyframes turn{0%{transform:rotateZ(0deg)}90%{transform:rotateZ(750deg)}100%{transform:rotateZ(720deg)}}.box{animation:turn 2s}',true],
    ['web-60-answer-1','回転の代わりに拡大する','@keyframes turn{0%{transform:scale(1)}90%{transform:scale(2)}100%{transform:scale(1)}}.box{animation:turn 2s}',false],
    ['web-72-answer-1','グレースケールなし','img{filter:grayscale(0)}',false],
    ['web-72-answer-3','色相を変えていない','img{filter:hue-rotate(0deg)}',false],
    ['quiz-06-answer-2','日本語の変数名','let 名前;',true],
    ['quiz-06-answer-3','日本語の変数に代入','let 名前; 名前="太郎";',true],
    ['quiz-06-answer-4','日本語の変数を表示','let 名前="太郎"; console.log(名前);',true]
  ];
  for(const [id,label,answer,expected] of cases) {
    const item=items.get(id);
    let result;
    try{result=item.grading.kind==='render'?await gradeRenderedAnswer(item,answer):gradeAnswer(item,answer);}catch(error){result={passed:false,feedback:error.message};}
    lines.push(`${id} ${label} ${result.passed===expected?'PASS':`FAIL ${result.feedback}`}`);
  }
  return lines;
}
