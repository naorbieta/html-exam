---
id: exam-html-17
number: 17
type: 単一選択
title: |-
  見本のように、ページをスクロールしてもフッターがいつも画面の下に表示されるようにしたいです。
  フッターに指定するCSSとして正しいものはどれですか？
required: true
choices:
  - "position: fixed; bottom: 0;"
  - "position: relative; bottom: 0;"
  - "position: static; bottom: 0;"
  - "float: bottom;"
answers:
  - "position: fixed; bottom: 0;"
feedback: "画面（ビューポート）に対して固定するには position: fixed を使い、bottom: 0 で下端に置きます。"
---

```preview height=170 label="見本（本文はスクロールしても、フッターは画面の下に残る）"
<div style="position:relative;height:150px;border:1px solid #ccc;overflow:hidden">
  <div style="height:150px;overflow:auto;padding:8px 12px 40px">
    <p style="margin:0 0 8px">本文 1</p><p style="margin:0 0 8px">本文 2</p><p style="margin:0 0 8px">本文 3</p><p style="margin:0 0 8px">本文 4</p><p style="margin:0 0 8px">本文 5</p><p style="margin:0 0 8px">本文 6</p>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:0;background:#37474f;color:#fff;padding:6px 12px;font-size:13px">フッター（いつも画面の下）</div>
</div>
```
