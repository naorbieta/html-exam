---
id: web-31
course: HTML・CSS・Web基礎
number: 31
title: 便利な擬似クラス
images:
  - file: images/web-31-01.jpg
    path: images/web-31-01.jpg
    alt: 説明のない画像
---

今回は便利な疑似クラスについて紹介します。

下記のようなコードがあったとします。
次の質問にお答えください！

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <section>
            <h1>クイズ第３１問！</h1>
            <p>【１】この文字は赤色？</p>
            <p>【２】この文字は赤色？</p>
            <p>【３】この文字は赤色？</p>
            <p>【４】この文字は赤色？</p>
            <p>【５】この文字は赤色？</p>
            <!-- ② -->
            <p></p>
        </section>
        <style>
            /* ① */
            section p:not(:first-of-type) {
                color: red;
            }
        </style>
    </body>
</html>
