---
id: exam-js-07
number: 7
type: 単一選択
title: |-
  次のコードを実行すると、コンソールに表示される数字はどれですか？
required: true
choices:
  - "1 と 3"
  - "1 と 2 と 3"
  - "1 と 3 と 5"
  - "1 と 2 と 3 と 4 と 5"
answers:
  - "1 と 3"
feedback: "continue はその周の残りを飛ばして次の周へ、break は繰り返しそのものを終わらせます。"
---

```js
for (let i = 1; i <= 5; i++) {
  if (i === 2) {
    continue;
  }
  if (i === 4) {
    break;
  }
  console.log(i);
}
```
