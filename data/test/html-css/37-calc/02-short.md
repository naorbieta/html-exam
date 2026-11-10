---
id: web-37-answer-2
number: 2
type: 短文
title: ② 以下のCSSのとき、赤い箱(.box)の横幅はいくつ？
required: true
answers:
  - "380"
  - 380px
feedback: calc内の式と、親要素の幅・文字サイズを確認してください。
---

.box {
    width: calc((100% - 30px) / 3);
}
