---
id: web-33-answer-1
number: 1
type: 単一選択
title: |-
  ①下記のとき、
  重なり順は？
required: true
choices:
  - １→２
  - ２→１
answers:
  - ２→１
feedback: 問題の条件と回答をもう一度確認してください。
---

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="box"></div><!-- この箱が １ -->
        <div class="box2"></div><!-- この箱が ２ -->
        <style>
            .box {
                width: 100px;
                height: 100px;
                background: #f00;
                z-index: 2;
            }
            .box2 {
                width: 100px;
                height: 100px;
                background: #0f0;
                z-index: 1;
                margin: -20px;
            }
        </style>
    </body>
</html>

上に重なる→下に重なる
の順で解答してください。
