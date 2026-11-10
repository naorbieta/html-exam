---
id: web-74
course: HTML・CSS・Web基礎
number: 74
title: グリッドレイアウト pt.2
images:
  - file: images/web-74-01.png
    path: images/web-74-01.png
    alt: 説明のない画像
---

前回に引き続き、
グリッドレイアウトについてです。

ここからが、gridの本領が
発揮されてくるところだと思います。

なんとなく、flexを使っているという方も、
gridが使いたくなるかも！

下に、例題のコードを用意しました。
画像のような動きになるように、

CSSを追記しましょう！

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
            <div class="box"></div>
        </div>
        <style>
            .wrapper {
                width: 80vw;
                margin: 0 auto;
            }
            .box {
                width: 100%;
                min-height: 100px;
                background: #adadad;
            }
        </style>
    </body>
</html>
