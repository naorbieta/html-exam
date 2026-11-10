---
id: quiz-29-answer-2
number: 1
type: コード
title: 条件に合うプログラムを記述してください。
language: js
required: true
starter: |-
  for (let i = 1; i <= 10; i++) {
      let num = Math.floor(Math.random() * 10) + 1;
      console.log(num);


  }
example: |-
  for(let i=1;i<=10;i++){
   const num=Math.floor(Math.random()*10)+1;
   console.log(num);
   if(num===7){alert('当たり');break;}
   if(i===10) alert('ハズレ');
  }
feedback: 当たりの数字を1つ決め、当たりならbreak、10回外れたらハズレを表示してください。
hint: プログラム全体を入力してください。「当たり」「ハズレ」に相当する表示と試行回数を採点します。
---
