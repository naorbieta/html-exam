---
id: exam-js-05
number: 5
type: コード
title: |-
  関数 maxNumber を完成させてください。
  2つの数値 a と b を受け取り、大きいほうの数値を return します。
language: js
required: true
starter: |-
  function maxNumber(a, b) {
    // ここに書いてください
  }

  // 試しに呼び出して確かめられます（「実行」で表示されます）
  console.log(maxNumber(5, 10)); // 10 になればOK
  console.log(maxNumber(8, 3));  // 8 になればOK

example: |-
  function maxNumber(a, b) {
    return a > b ? a : b;
  }
feedback: "2つの引数を比べて、大きいほうを return してください。"
---

採点では、いろいろな数の組み合わせ（同じ数どうしや、マイナスの数も）で maxNumber を呼び出して確かめます。
