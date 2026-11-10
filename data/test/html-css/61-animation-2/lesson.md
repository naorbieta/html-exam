---
id: web-61
course: HTML・CSS・Web基礎
number: 61
title: アニメーション pt.2
images:
  - file: images/web-61-01.gif
    path: images/web-61-01.gif
    alt: 説明のない画像
---

前回に引き続き、
今回もアニメーションを作ります。

前回よりもちょっと複雑ですが、
例えばメインビジュアルを効果的に見せたりすることが
できそうです。

下記に例のコードを用意しました。
これをアニメーションさせてみましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="box">
                <img src="https://i.postimg.cc/YCbHZBQR/sunset-7504891-1920.jpg">
            </div>
        </div>
        <style>
            .wrapper {
                width: 900px;
                margin: 0 auto;
            }
            .box img {
                width: 100%;
                display: block;
            }
        </style>
    </body>
</html>
