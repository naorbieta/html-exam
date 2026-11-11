---
id: exam-js-06
number: 6
type: 単一選択
title: 次の関数を、引数なしで呼び出したときの戻り値はどれですか？
required: true
choices:
  - ゲスト
  - name
  - undefined
  - エラーになる
answers:
  - ゲスト
feedback: name = 'ゲスト' がデフォルト引数です。引数を省略すると、この値が使われます。
---

```js
function greet(name = 'ゲスト') {
  return name;
}
greet();
```
