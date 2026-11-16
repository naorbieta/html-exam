---
id: exam-js-10
number: 10
type: 単一選択
title: |-
  次のコードを実行すると、コンソールに何が表示されますか？
required: true
choices:
  - "太郎 大阪"
  - "太郎 undefined"
  - "name city"
  - "エラーになる"
answers:
  - "太郎 大阪"
feedback: "オブジェクトの値は person.name のように取り出し、person.city = '大阪' のように追加できます。"
---

```js
const person = {
  name: '太郎',
  age: 20
};
person.city = '大阪';

console.log(person.name, person.city);
```
