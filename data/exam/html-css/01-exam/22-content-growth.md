---
id: exam-html-22
number: 22
type: 単一選択
title: |-
  見本のカードは、タイトルが長くなると、右上のボタンとタイトルの文字が重なってしまいます。
  直し方として最も適切なものはどれですか？
required: true
choices:
  - "タイトルの右側に、ボタンの幅のぶんだけ余白（padding-right）をとる"
  - "タイトルの文字サイズを 10px まで小さくして、ボタンとの重なりを避ける"
  - "ボタンの z-index を大きくして、タイトル文字の上に重ねて表示する"
  - "カード全体の高さを 50px に固定して、タイトルが長くならないようにする"
answers:
  - "タイトルの右側に、ボタンの幅のぶんだけ余白（padding-right）をとる"
feedback: "文字の量が変わっても崩れないよう、ボタンのぶんの場所をタイトル側にあけておきます。"
---

```preview height=130 label="いまの表示（タイトルが長いと重なる）"
<div style="position:relative;width:300px;border:1px solid #ccc;border-radius:8px;padding:12px">
  <button style="position:absolute;top:10px;right:10px;padding:4px 10px">保存</button>
  <h3 style="margin:0;font-size:16px">とても長いタイトルが入ったときのカードの見え方</h3>
  <p style="margin:8px 0 0;font-size:13px;color:#555">本文が入ります。</p>
</div>
```
