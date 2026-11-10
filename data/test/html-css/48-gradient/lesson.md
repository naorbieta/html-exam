---
id: web-48
course: HTML・CSS・Web基礎
number: 48
title: グラデーション
images:
  - file: images/web-48-01.png
    path: images/web-48-01.png
    alt: 説明のない画像
---

今回はグラデーションをCSSでつくります。

CSSでは、単色の色だけでなく、
徐々に色が変化するグラデーションも設定することができます。

3つ、例を用意しました。
これをCSSで再現してみましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="box gradation1">
            </div>
            <div class="box gradation2">
            </div>
            <div class="box gradation3">
            </div>
        </div>
    </body>
    <style>
        .wrapper {
            width: 900px;
            margin: 0 auto;
            display: flex;
            gap: 5em;
        }
        .box {
            width: 200px;
            height: 200px;
            background: #ccc;
        }
    </style>
</html>
