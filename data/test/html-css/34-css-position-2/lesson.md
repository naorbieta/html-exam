---
id: web-34
course: HTML・CSS・Web基礎
number: 34
title: CSSのposition pt.2
images:
  - file: images/web-34-01.jpg
    path: images/web-34-01.jpg
    alt: 説明のない画像
---

今回は、positionを使った配置についてです。

positionは便利な反面、
理解せずに、無理やりな使い方をすると、

保守性に欠けるコードになりがちです。

positionの、
メリット、デメリットがわかるようにがんばりましょう！

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="box">
            <div class="box2"></div>
        </div>
        <style>
            .box {
                width: 400px;
                height: 400px;
                background: #f00;
            }
            .box2 {
                width: 100px;
                height: 100px;
                background: #0f0;
            }
        </style>
    </body>
</html>
