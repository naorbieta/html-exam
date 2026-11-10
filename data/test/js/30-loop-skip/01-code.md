---
id: quiz-30-answer-3
number: 1
type: コード
title: |-
  continueを交えて分岐を追加し、

  完成させたコードをここに貼ってください！
language: js
required: true
starter: |-
  diceGame(5);

  function diceGame(tryTimes) { // tryTimes: 抽選回数
      let hit = false; // 当たりが出たかどうかのフラグ
      alert('サイコロゲーム!\n\n6が出たら当たり!\nチャンスは' + tryTimes + '回!');
      for (let i = 1; i <= tryTimes; i++) {
          let diceResult = Math.floor(Math.random() * 6) + 1; // 1~6までの数値をランダムに生成
          console.log(i +'回目: ' + diceResult);
          if (diceResult === 6) {
              alert(i +'回目: ' + diceResult + '\n\n6が出た!\n当たり!👏');
              hit = true;
              break;
          }
          if (i < tryTimes) {
              alert(i +'回目: ' + diceResult + '\nハズレ!もう一回!');
          } else {
              alert(i +'回目: ' + diceResult + '\nハズレ!');
          }
      }
      if (!hit) { // 当たりが出ていない場合
          alert("終了!ざんねん!");
      }
  }
example: |-
  diceGame(5);
  function diceGame(tryTimes){
   let hit=false;
   for(let i=1;i<=tryTimes;i++){
    const diceResult=Math.floor(Math.random()*6)+1;
    console.log(i+'回目: '+diceResult);
    if(diceResult===6){alert('当たり');hit=true;break;}
    if(diceResult===5){i++;continue;}
   }
   if(!hit) alert('終了！ざんねん！');
  }
feedback: 5のときはループ変数を1つ進めてcontinueし、次の回へ進んでください。
---
