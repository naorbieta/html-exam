---
id: exam-js-12
number: 12
type: コード
title: |-
  関数 greet を完成させてください。
  テンプレートリテラルを使って、受け取った name を埋め込んだ「こんにちは、〇〇さん」という文字列を return します。
language: js
required: true
starter: |-
  function greet(name) {
    // ここに書いてください
  }

  // 試しに呼び出して確かめられます（「実行」で表示されます）
  console.log(greet('太郎')); // こんにちは、太郎さん になればOK

example: |-
  function greet(name) {
    return `こんにちは、${name}さん`;
  }
feedback: "テンプレートリテラルで name を埋め込み、「こんにちは、〇〇さん」を return してください。"
---

- 「+」でつなぐのではなく、**テンプレートリテラル**で書いてください。
- 採点では、いろいろな名前で greet を呼び出して確かめます。
