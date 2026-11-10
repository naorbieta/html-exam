---
id: quiz-22-answer-2
number: 1
type: コード
title: |-
  (画像参照)
  画像の通り動作するプログラムを
  ここに記述してください。
language: js
required: true
example: |-
  const day=prompt('曜日を入力してください。');
  switch(day){
   case '土曜日': case '日曜日': alert('今日は'+day+'です。ゆっくり休みましょう！');break;
   case '月曜日':case '火曜日':case '水曜日':case '木曜日':case '金曜日':alert('今日は'+day+'です。がんばりましょう！');break;
   default:alert('曜日を正しく指定してください。');
  }
feedback: switchで曜日を分岐し、休日・平日・不正な入力を処理してください。
---
