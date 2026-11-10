---
id: quiz-26-answer-2
number: 1
type: コード
title: |-
  function greet に続いてデフォルト引数を使用したコードを記述し、
  あいさつが返ってくる関数を完成させてください。
language: js
required: true
starter: |-
  function greet(name = /* 省略時の名前 */) {
    // あいさつを表示してください
  }

  greet();
  greet("太郎");
example: |-
  function greet(name='名無し'){
   alert('こんにちは、'+name+'さん。');
  }
feedback: デフォルト引数を定義して、引数を省略した場合にもあいさつしてください。
---
