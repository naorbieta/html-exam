---
id: web-43
course: HTML・CSS・Web基礎
number: 43
title: initial と inherit
---

CSSで、「initial」や「inherit」という値を
いろいろなプロパティで指定することができます。

initial は、"最初の" などという意味で、
これは、プロパティの初期値を設定することができます。

inherit は、"受け継ぐ"などという意味で、
親要素の値を継承するということです。

これらを使った方が、
例えば、何回も同じ色を指定しなくて済むときがあるなど、
便利で、あとから変更するときにもよい

ということがあるので
どういう動きになるか、実際に確認していきましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <h1>クイズ第４３問</h1>
            <p class="text1">クイズクイズクイズ！</p>
            <div class="box">
                <p class="text2">クイズクイズクイズ！</p>
            </div>
            <div class="box2">
                <p class="text3">クイズクイズクイズ！</p>
                <p class="text4">【１】ここの文字は何色？</p>
            </div>
        </div>
    </body>
    <style>
        .wrapper {
            color: #ff0000;
        }
        .box {
            background: #0000ff;
            color: #ffff00;
        }
        .box2 {
            background: #00ff00;
            position: relative;
        }
        .box2:before {
            content: '【２】この箱の背景色は何色？';
            width: 200px;
            height: 200px;
            position: absolute;
            top: 100%;
            left: 0;
            background: inherit;
        }
        .text4 {
            color: initial;
        }
    </style>
</html>
