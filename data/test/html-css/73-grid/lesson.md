---
id: web-73
course: HTML・CSS・Web基礎
number: 73
title: グリッドレイアウト
images:
  - file: images/web-73-01.png
    path: images/web-73-01.png
    alt: 説明のない画像
---

今回は、CSSの
グリッドレイアウトについてです。

「display: grid;」を使うと、
格子状のレイアウトを簡単に組むことができて便利です。

他の手段でも、同じような見た目を作ることはできますが、
状況に応じて、適切なCSSを使いたいところです。

下記のコードに
「display: grid;」などのCSSを追加して、

下の画像の見た目を作ってみましょう！

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="box red"></div>
            <div class="box green"></div>
            <div class="box blue"></div>
            <div class="box yellow"></div>
        </div>
        <style>
            .wrapper {
                width: 900px;
                margin: 0 auto;
            }
            .box {
                width: 100%;
                min-height: 100px;
            }
            .red {background: #f00;}
            .green {background: #0f0;}
            .blue {background: #00f;}
            .yellow {background: #ff0;}
        </style>
    </body>
</html>
