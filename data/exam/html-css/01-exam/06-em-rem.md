---
id: exam-html-06
number: 6
type: 単一選択
title: |-
  次のCSSのとき、.child の文字の大きさ（2rem）は何px になりますか？
required: true
choices:
  - "16px"
  - "20px"
  - "32px"
  - "40px"
answers:
  - "32px"
feedback: "rem はルート（html 要素）の font-size を基準にします。em なら親要素の font-size が基準です。"
---

```html label="index.html"
<div class="parent">
  <p class="child">テキスト</p>
</div>
```

```css label="style.css"
html    { font-size: 16px; }
.parent { font-size: 20px; }
.child  { font-size: 2rem; }
```
