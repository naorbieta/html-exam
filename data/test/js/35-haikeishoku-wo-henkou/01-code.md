---
id: quiz-35-answer-2
number: 1
type: コード
title: |-
  ①(画像参照)
  赤枠の部分、正しく背景色が変更されるように書き換えてください。
language: js
required: true
starter: |-
  <!doctype html><html><body><div class="wrapper"><div class="text">こんにちは</div></div><style>.text{background:#f7f7f7;box-shadow:0 2px 3px rgb(0 0 0 / 15%);padding:2em}</style><script>
  const text = document.querySelector(".text");
  text.style.background-color = "#ffff00";
  </script></body></html>
example: text.style.backgroundColor='#ff0000';
feedback: background-colorは、JSではbackgroundColorと記述します。
hint: textは.text要素として用意されています。修正する行を入力してください。
---
