---
id: exam-html-07
number: 7
type: 複数選択
title: |-
  次のHTMLに、セレクタ .menu > li でスタイルを指定しました。
  スタイルが当たる li はどれですか？
required: true
choices:
  - "A"
  - "B"
  - "C"
  - "D"
answers:
  - "A"
  - "B"
feedback: "「>」は直下の子だけに当たります。空白（.menu li）なら子孫すべてに当たります。"
---

```html label="index.html"
<ul class="menu">
  <li>A</li>
  <li>B
    <ul>
      <li>C</li>
    </ul>
  </li>
</ul>
<ul class="sub">
  <li>D</li>
</ul>
```

当たるものが2つ以上あるときは、すべて選んでください。
