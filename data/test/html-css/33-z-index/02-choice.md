---
id: web-33-answer-2
number: 2
type: 単一選択
title: |-
  ②下記のとき、
  重なり順は？
required: true
choices:
  - １→２→３
  - １→３→２
  - ２→１→３
  - ２→３→１
  - ３→１→２
  - ３→２→１
answers:
  - ３→２→１
feedback: 親が作るスタッキングコンテキスト内では、負のz-indexの子も親の背景より後に描かれます。
---

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="box"><!-- この箱が １ -->
            <div class="box_bg"></div><!-- この箱が ２ -->
        </div>
        <div class="box2"></div><!-- この箱が ３ -->
        <style>
            .box {
                width: 100px;
                height: 100px;
                background: #f00;
                position: relative;
                z-index: 2;
            }
            .box_bg {
                width: 100px;
                height: 100px;
                background: #0f0;
                position: relative;
                top: 20px;
                left: 20px;
                z-index: -1;
            }
            .box2 {
                width: 100px;
                height: 100px;
                background: #00f;
                position: relative;
                bottom: 20px;
                z-index: 3;
            }
        </style>
    </body>
</html>

上に重なる→下に重なる
の順で解答してください。
