---
id: quiz-16-answer-2
number: 1
type: コード
title: |-
  (画像参照)
  画像の通り動作するプログラムを
  ここに記述してください。
language: js
required: true
example: |-
  const money=Number(prompt('今いくら持っていますか？'));
  const hungry=confirm('今、おなかが空いていますか？');
  if(money>=1500 && hungry) alert('コーヒーとケーキのセットを注文しました。');
  else if(money>=500) alert('コーヒーのみ注文しました。');
  else alert('節約しておこう');
feedback: 1500円以上でも空腹でなければコーヒーだけ、500円未満なら節約です。
---
