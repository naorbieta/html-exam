---
id: web-27
course: HTML・CSS・Web基礎
number: 27
title: 隣接・直下・間接セレクタ
---

下記のようなコードがあったとします。

CSSを
①、②、③のように書いたとき、

それぞれ、
どの「この文字は赤色？」の文字が
赤くなるでしょう？

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <h1>クイズ第２７問！</h1>
        <div class="box">
            <span>【１】この文字は赤色？</span>
            <div class="box">
                <span>【２】この文字は赤色？</span>
            </div>
        </div>
        <div class="box">
            <span>【３】この文字は赤色？</span>
            <div class="box">
                <span>【４】この文字は赤色？</span>
            </div>
        </div>
        <p>Webスクール</p>
        <div class="box">
            <span>【５】この文字は赤色？</span>
            <div class="box">
                <span>【６】この文字は赤色？</span>
            </div>
        </div>
        <style>
            /* ① */
            .box + .box {
                color: red;
            }
            /* ② */
            .box > .box {
                color: red;
            }
            /* ③ */
            .box ~ .box {
                color: red;
            }
        </style>
    </body>
</html>
