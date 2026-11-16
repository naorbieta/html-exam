---
id: exam-html-03
number: 3
type: 単一選択
title: |-
  画面の色は、R（赤）・G（緑）・B（青）の3つの光を混ぜて表します。
  R・G・B をすべて最大の強さ（255）にすると、何色になりますか？
required: true
choices:
  - "白"
  - "黒"
  - "灰色"
  - "茶色"
answers:
  - "白"
feedback: "R・G・B は光の三原色です。すべてを最大の強さで重ねると白になります。"
---

```preview height=120 label="rgb() で指定した色"
<div style="display:flex;gap:12px;text-align:center;font:13px/1.4 monospace">
  <div><div style="width:90px;height:50px;background:rgb(255,0,0)"></div>rgb(255, 0, 0)</div>
  <div><div style="width:90px;height:50px;background:rgb(0,255,0)"></div>rgb(0, 255, 0)</div>
  <div><div style="width:90px;height:50px;background:rgb(0,0,255)"></div>rgb(0, 0, 255)</div>
  <div><div style="width:90px;height:50px;border:2px dashed #999;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font-size:24px">？</div>rgb(255, 255, 255)</div>
</div>
```
