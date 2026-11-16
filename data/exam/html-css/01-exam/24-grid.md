---
id: exam-html-24
number: 24
type: コード
title: |-
  style.css に CSS を書いて、3枚のカードを見本のように横3列に並べてください。CSSグリッド（display: grid）を使います。
language: css
required: true
starter: |-
  <!doctype html>
  <html lang="ja">
  <head>
  <meta charset="utf-8">
  <style>
  .cards {
    /* ここに書いてください */
  }
  .card {
    padding: 16px;
    background: #e3f2fd;
  }
  </style>
  </head>
  <body>
  <div class="cards">
    <div class="card">カード1</div>
    <div class="card">カード2</div>
    <div class="card">カード3</div>
  </div>
  </body>
  </html>
example: |-
  <!doctype html>
  <html lang="ja">
  <head>
  <meta charset="utf-8">
  <style>
  .cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .card {
    padding: 16px;
    background: #e3f2fd;
  }
  </style>
  </head>
  <body>
  <div class="cards">
    <div class="card">カード1</div>
    <div class="card">カード2</div>
    <div class="card">カード3</div>
  </div>
  </body>
  </html>
feedback: "CSSグリッドを使って、3枚のカードが横に3列で並ぶようにしてください。"
---

- style.css の `.cards { }` の中に書いてください（.card の指定は変えなくてかまいません）。
- カードどうしのすき間は、あってもなくてもかまいません。

```preview height=90 label="見本（完成形）"
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
  <div style="padding:16px;background:#e3f2fd">カード1</div>
  <div style="padding:16px;background:#e3f2fd">カード2</div>
  <div style="padding:16px;background:#e3f2fd">カード3</div>
</div>
```
