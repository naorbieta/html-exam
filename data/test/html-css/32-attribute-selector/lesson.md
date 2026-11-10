---
id: web-32
course: HTML・CSS・Web基礎
number: 32
title: 属性セレクタ
---

今回は、属性セレクタについてです。

指定された属性があるかどうかで、要素を選択できるため、
例えばアンカーリンクが指定されているときだけ反映したいということも
簡単に反映できます。

下記のようなコードがあったとします。
次の質問にお答えください！

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <section>
            <h1>クイズ第３２問！</h1>
            <a href="https://example.com/" target="_blank">【１】この文字は赤色？</a>
            <a href="#example">【２】この文字は赤色？</a>
            <a href="/question/">【３】この文字は赤色？</a>
            <a href="hogehoge.jpg">【４】この文字は赤色？</a>
            <a href="fugaguga.pdf">【５】この文字は赤色？</a>
        </section>
        <section id="example">
            <h1>Example</h1>
            <form action="#" method="post">
                <!-- ③ ここから -->
                <input type="text" name="text1">
                <input type="text" name="text2">
                <!-- ③ ここまで -->
                <input type="submit" name="button">
            </form>
        </section>
        <style>
            /* ① */
            a[href^="#"] {
                color: red;
            }
            /* ② */
            a[href$=".pdf"] {
                color: red;
            }
        </style>
    </body>
</html>
