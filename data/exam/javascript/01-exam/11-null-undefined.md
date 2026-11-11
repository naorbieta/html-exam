---
id: exam-js-11
number: 11
type: 単一選択
title: 次のコードを実行したとき、a と b の値の組み合わせとして正しいものはどれですか？
required: true
choices:
  - "a は undefined、b は null"
  - "a は null、b は undefined"
  - "どちらも null"
  - "どちらも 0"
answers:
  - "a は undefined、b は null"
feedback: 宣言しただけで代入していない変数は undefined です。null は「値がない」ことを明示して代入する値です。
---

```js
let a;
let b = null;
```
