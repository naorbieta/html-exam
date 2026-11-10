---
id: web-28
course: HTML・CSS・Web基礎
number: 28
title: nth-child と nth-of-type について
images:
  - file: images/web-28-01.jpg
    path: images/web-28-01.jpg
    alt: 説明のない画像
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
        <section>
            <h1>クイズ第２８問！</h1>
            <p class="hoge">【１】この文字は赤色？</p>
            <p class="hoge">【２】この文字は赤色？</p>
            <p class="fuga">【３】この文字は赤色？</p>
            <p class="hoge">【４】この文字は赤色？</p>
            <p class="fuga">【５】この文字は赤色？</p>
            <p class="hoge">【６】この文字は赤色？</p>
            <p class="hoge">【７】この文字は赤色？</p>
            <p class="fuga">【８】この文字は赤色？</p>
            <p class="hoge">【９】この文字は赤色？</p>
        </section>
        <style>
            /* ① */
            section p:nth-child(2n+1) {
                color: red;
            }
            /* ② */
            section .hoge:nth-child(4) {
                color: red;
            }
            /* ③ */
            section p:nth-of-type(3n) {
                color: red;
            }
        </style>
    </body>
</html>
