---
id: web-72
course: HTML・CSS・Web基礎
number: 72
title: CSS フィルター
images:
  - file: images/web-72-01.png
    path: images/web-72-01.png
    alt: 説明のない画像
---

Webサイトを作っていて、

画像などに、
ぼかしや色変化などの効果をつけたい…… というとき

それ、CSSで書くことができます。

画像などにフィルターをかけることができる
CSSプロパティを書くことで、効果を適用できます。

画像ごとにPhotoshopなどで編集しなくて済むので、
画像の入れ替わりがある、CMSと
相性がいいプロパティです。

下記のコードを使って、
どんな効果をつくることができるか
確認してみましょう。

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
