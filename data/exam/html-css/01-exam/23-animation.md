---
id: exam-html-23
number: 23
type: 単一選択
title: |-
  CSSアニメーションで、「0% のときは左、100% のときは右」のように、動きの途中の状態を定義するときに使う書き方はどれですか？
required: true
choices:
  - "@keyframes"
  - "@media"
  - "@import"
  - "!important"
answers:
  - "@keyframes"
feedback: "動きの途中の状態は @keyframes で定義し、animation プロパティで要素に適用します。"
---

```css label="style.css（？？？ の部分）"
？？？ slide {
  0%   { transform: translateX(0); }
  100% { transform: translateX(200px); }
}
.box {
  animation: slide 2s;
}
```
