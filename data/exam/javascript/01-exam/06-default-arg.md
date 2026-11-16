---
id: exam-js-06
number: 6
type: 単一選択
title: |-
  次のコードを実行すると、コンソールに何が表示されますか？
required: true
choices:
  - "ゲスト"
  - "name"
  - "undefined"
  - "エラーになる"
answers:
  - "ゲスト"
feedback: "name = 'ゲスト' はデフォルト引数です。引数を省略すると、この値が使われます。"
---

```js
function greet(name = 'ゲスト') {
  return name;
}

console.log(greet());
```
