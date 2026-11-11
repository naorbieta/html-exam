---
id: exam-html-09
number: 9
type: 単一選択
title: 次のHTMLに対して、セレクタ p:nth-of-type(2) が当たる要素の内容はどれですか？
required: true
choices:
  - A
  - B
  - 見出し
  - A と B の両方
answers:
  - B
feedback: nth-of-type は、同じ種類の要素だけを数えます。p の 2番目は B です。nth-child は種類を問わず子要素を数える点が違います。
---

```html
<section>
  <h2>見出し</h2>
  <p>A</p>
  <p>B</p>
</section>
```
