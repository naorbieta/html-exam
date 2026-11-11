---
id: exam-html-08
number: 8
type: 単一選択
title: 次のHTMLに対して、セレクタ a[target="_blank"] が当たる要素はどれですか？
required: true
choices:
  - 1 だけ
  - 2 だけ
  - 1 と 2 の両方
  - どれにも当たらない
answers:
  - 1 だけ
feedback: 属性セレクタ [target="_blank"] は、target 属性の値が _blank の要素にだけ当たります。
---

```html
<a href="https://example.com/" target="_blank">1</a>
<a href="#top">2</a>
```
