---
id: exam-html-06
number: 6
type: 単一選択
title: 次のHTMLに対して、セレクタ「.container > p」が当たる要素の内容はどれですか？
required: true
choices:
  - A だけ
  - B だけ
  - A と B の両方
  - どれにも当たらない
answers:
  - A だけ
feedback: 「>」は直下の子要素だけに当たります。B の p は .container の孫なので当たりません。
---

```html
<div class="container">
  <p>A</p>
  <div>
    <p>B</p>
  </div>
</div>
```
