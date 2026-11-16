---
id: exam-js-11
number: 11
type: 単一選択
title: |-
  次のコードを実行すると、コンソールの1行目と2行目に何が表示されますか？
required: true
choices:
  - "1行目: undefined　2行目: null"
  - "1行目: null　2行目: undefined"
  - "1行目: null　2行目: null"
  - "1行目: 0　2行目: 0"
answers:
  - "1行目: undefined　2行目: null"
feedback: "宣言しただけで値を入れていない変数は undefined です。null は「値がない」ことを表すために自分で入れる値です。"
---

```js
let a;
let b = null;

console.log(a); // 1行目
console.log(b); // 2行目
```
