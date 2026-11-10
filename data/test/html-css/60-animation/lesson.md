---
id: web-60
course: HTML・CSS・Web基礎
number: 60
title: アニメーション
images:
  - file: images/web-60-01.gif
    path: images/web-60-01.gif
    alt: 説明のない画像
---

Webサイトで
コンテンツがアニメーションで動くと、
やはり興味を引くかと思います。

そんなアニメーション、
CSSで、結構複雑な動きを作ることが可能です。

下記に例のコードを用意しました。
これをアニメーションさせてみましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="box"></div>
        </div>
        <style>
            * {
                box-sizing: border-box;
            }
            .wrapper {
                width: 900px;
                margin: 0 auto;
                padding: 5em 0;
            }
            .box {
                width: 100px;
                height: 100px;
                background: linear-gradient(to bottom, #FFC778, #F89174 50%, #748af8);
            }
        </style>
    </body>
</html>
