---
id: exam-html-12
number: 12
type: 単一選択
title: |-
  見本では、赤い箱が青い箱の手前に表示されています。
  青い箱を赤い箱より手前に表示するには、青い箱（.blue）に何を指定しますか？
required: true
choices:
  - "z-index: 2;"
  - "z-index: -1;"
  - "order: 2;"
  - "top: 2px;"
answers:
  - "z-index: 2;"
feedback: "z-index は、数字が大きいほど手前に表示されます（position が static 以外の要素に効きます）。"
---

```css label="style.css（いまの指定）"
.red  { position: absolute; top: 20px; left: 20px;  z-index: 1; }
.blue { position: absolute; top: 50px; left: 70px; }
```

```preview height=170 label="いまの表示"
<div style="position:relative;height:150px">
  <div style="position:absolute;top:20px;left:20px;width:110px;height:80px;background:#e53935;z-index:1;color:#fff;padding:4px 8px">.red</div>
  <div style="position:absolute;top:50px;left:70px;width:110px;height:80px;background:#1e88e5;color:#fff;padding:4px 8px;text-align:right;display:flex;align-items:flex-end;justify-content:flex-end">.blue</div>
</div>
```
