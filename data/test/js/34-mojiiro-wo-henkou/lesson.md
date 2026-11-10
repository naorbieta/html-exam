---
id: quiz-34
course: JavaScript / 初級
number: 34
title: 文字色を変更する
images:
  - file: images/quiz-34-01.png
    path: images/quiz-34-01.png
    alt: 第34問 文字色を変更するの参考画像
---

前回は、テキストを書き換えましたが、
文字色などのスタイルもJavaScriptで変更することができます。

下の方に、HTMLコードを用意しました。

前回とほとんど一緒ですが、
テキストボックスはidではなくclassをつけています。

classを取得するときは、querySelectorメソッドが使えます。
これは、HTML文書の先頭から一致するclassを探して、
最初にマッチした要素を取得してくれます。

また、文字色の変更は、
styleプロパティが使えます。

これらのヒントをもとに、
テキストを書き換えてみてください！

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="text">
                こんにちは
            </div>
        </div>
        <style>
            .text {
                background: #f7f7f7;
                box-shadow: 0 2px 3px rgb(0 0 0 / 15%);
                padding: 2em;
            }
        </style>
    </body>
</html>
