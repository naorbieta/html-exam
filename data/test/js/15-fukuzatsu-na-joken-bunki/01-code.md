---
id: quiz-15-answer-2
number: 1
type: コード
title: |-
  (画像参照)
  画像の通り動作するプログラムを
  ここに記述してください。
language: js
required: true
example: |-
  if (!confirm('財布を持っていますか？')) {
   alert('財布を取りに家に帰ろう');
  } else {
   const money=Number(prompt('今いくら持っていますか？'));
   if(money>=1500) alert('ハンバーガーセットを注文しました。');
   else if(money>=500) alert('ポテトのみ注文しました。');
   else alert('注文しませんでした。');
  }
feedback: 財布の有無と、500円・1500円の境界を確認してください。
---
