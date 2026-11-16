---
id: exam-html-13
number: 13
type: 単一選択
title: |-
  見本のように、ナビゲーションの項目を横一列に並べ、すき間をそろえたいです。
  最も適した方法はどれですか？
required: true
choices:
  - "親要素に display: flex を指定する（flexbox）"
  - "各項目に float: left を指定する"
  - "各項目に position: absolute を指定して1つずつ位置を決める"
  - "table タグで表を作って並べる"
answers:
  - "親要素に display: flex を指定する（flexbox）"
feedback: "一方向の横並びや、すき間の調整には flexbox が向きます。"
---

```preview height=70 label="見本"
<ul style="display:flex;gap:24px;list-style:none;margin:0;padding:12px 16px;background:#263238">
  <li style="color:#fff">ホーム</li><li style="color:#fff">サービス</li><li style="color:#fff">会社案内</li><li style="color:#fff">お問い合わせ</li>
</ul>
```
