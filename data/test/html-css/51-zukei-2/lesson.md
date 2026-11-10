---
id: web-51
course: HTML・CSS・Web基礎
number: 51
title: CSSで図形を描こう pt.2
images:
  - file: images/web-51-01.png
    path: images/web-51-01.png
    alt: 説明のない画像
---

前回に引き続き、
CSSで図形を描きましょう。

ちょっと応用編ですが、
画像のような図形を描いてみましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="balloon"></div>
            <div class="trapezoid"></div>
        </div>
        <style>
            .wrapper {
                width: 30vw;
                margin: 5em auto;
            }
            .wrapper > * + * {
                margin-top: 20em;
            }
        </style>
    </body>
</html>
