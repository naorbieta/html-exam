---
id: exam-html-08
number: 8
type: 単一選択
title: |-
  次のHTMLに、セレクタ a[target="_blank"] でスタイルを指定しました。
  スタイルが当たるリンクはどれですか？
required: true
choices:
  - "リンク1 だけ"
  - "リンク2 だけ"
  - "リンク1 とリンク2 の両方"
  - "どちらにも当たらない"
answers:
  - "リンク1 だけ"
feedback: "属性セレクタ [target=\"_blank\"] は、target 属性の値が _blank の要素にだけ当たります。"
---

```html label="index.html"
<a href="https://example.com/" target="_blank">リンク1</a>
<a href="#top">リンク2</a>
```
