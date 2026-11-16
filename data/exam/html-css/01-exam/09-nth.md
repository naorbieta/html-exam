---
id: exam-html-09
number: 9
type: 単一選択
title: |-
  次のHTMLに、セレクタ p:nth-of-type(2) でスタイルを指定しました。
  スタイルが当たる要素の文字はどれですか？
required: true
choices:
  - "A"
  - "B"
  - "見出し"
  - "A と B の両方"
answers:
  - "B"
feedback: "nth-of-type は同じ種類（ここでは p）の要素だけを数えます。nth-child は種類を問わず数えます。"
---

```html label="index.html"
<section>
  <h2>見出し</h2>
  <p>A</p>
  <p>B</p>
</section>
```
