---
id: exam-html-11
number: 11
type: 単一選択
title: 次のCSSを適用したとき、p 要素の文字色はどうなりますか？
required: true
choices:
  - 赤（red）
  - 「--main」という文字
  - 透明
  - 指定は無効になる
answers:
  - 赤（red）
feedback: var(--main) はカスタムプロパティ --main の値を参照します。ここでは red です。
---

```css
:root {
  --main: red;
}
p {
  color: var(--main);
}
```
