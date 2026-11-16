---
id: exam-html-14
number: 14
type: コード
title: |-
  style.css に CSS を書いて、メニューの3つの項目（li）を見本のように横一列に並べてください。flexbox を使います。
language: css
required: true
starter: |-
  <!doctype html>
  <html lang="ja">
  <head>
  <meta charset="utf-8">
  <style>
  .menu {
    /* ここに書いてください */
  }
  </style>
  </head>
  <body>
  <ul class="menu">
    <li>ホーム</li>
    <li>案内</li>
    <li>連絡</li>
  </ul>
  </body>
  </html>
example: |-
  <!doctype html>
  <html lang="ja">
  <head>
  <meta charset="utf-8">
  <style>
  .menu {
    display: flex;
  }
  </style>
  </head>
  <body>
  <ul class="menu">
    <li>ホーム</li>
    <li>案内</li>
    <li>連絡</li>
  </ul>
  </body>
  </html>
feedback: "flexbox を使って、メニューの項目が横一列に並ぶようにしてください。"
---

- 右の解答欄には **index.html**（HTML）と **style.css**（CSS）のタブがあります。style.css の `.menu { }` の中に書いてください。
- 書いた結果は、下のプレビューにすぐ表示されます。
- HTML は変えなくてかまいません。

```preview height=70 label="見本（完成形）"
<ul style="display:flex;margin:0">
  <li style="margin-right:2.5em">ホーム</li><li style="margin-right:2.5em">案内</li><li>連絡</li>
</ul>
```
