---
id: exam-html-11
number: 11
type: 単一選択
title: |-
  見本のように、カードの右上の角に「NEW」のバッジを重ねて表示したいです。
  CSSの組み合わせとして正しいものはどれですか？
required: true
choices:
  - ".card { position: relative; }  .badge { position: absolute; top: 0; right: 0; }"
  - ".card { position: absolute; }  .badge { position: relative; top: 0; right: 0; }"
  - ".card { position: static; }  .badge { position: static; top: 0; right: 0; }"
  - ".card { position: relative; }  .badge { position: relative; top: 0; right: 0; }"
answers:
  - ".card { position: relative; }  .badge { position: absolute; top: 0; right: 0; }"
feedback: "absolute は、position が static 以外の祖先（ここでは .card）を基準に置かれます。"
---

```html label="index.html"
<div class="card">
  <span class="badge">NEW</span>
  <p>新商品のお知らせ</p>
</div>
```

```preview height=150 label="見本（完成形）"
<div style="position:relative;width:260px;padding:28px 16px 16px;border:1px solid #ccc;border-radius:8px">
  <span style="position:absolute;top:0;right:0;background:#e53935;color:#fff;font-size:12px;padding:2px 8px;border-radius:0 8px 0 8px">NEW</span>
  <p style="margin:0">新商品のお知らせ</p>
</div>
```
