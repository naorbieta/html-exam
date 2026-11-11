---
id: exam-js-10
number: 10
type: 単一選択
title: 次のオブジェクトについて、正しい説明はどれですか？
required: true
choices:
  - person.name は「太郎」で、person.city = '大阪' のようにプロパティを追加できる
  - person は配列なので、person[0] が「太郎」である
  - name と age は取り出せない
  - person.name は常に undefined である
answers:
  - person.name は「太郎」で、person.city = '大阪' のようにプロパティを追加できる
feedback: オブジェクトは名前（プロパティ）でデータをまとめます。取り出しは person.name、追加は person.city = '大阪' のように書けます。
---

```js
const person = {
  name: '太郎',
  age: 20
};
```
