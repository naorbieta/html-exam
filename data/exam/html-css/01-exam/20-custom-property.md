---
id: exam-html-20
number: 20
type: 単一選択
title: |-
  次のCSSを適用したとき、p 要素の文字は何色で表示されますか？
required: true
choices:
  - "赤"
  - "黒（初期値のまま）"
  - "透明（見えなくなる）"
  - "--main という文字が表示される"
answers:
  - "赤"
feedback: "var(--main) は、カスタムプロパティ --main に入れた値（ここでは red）を使います。"
---

```css label="style.css"
:root {
  --main: red;
}
p {
  color: var(--main);
}
```
