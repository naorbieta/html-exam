---
id: quiz-33
course: JavaScript / 初級
number: 33
title: 文字を書き換える
images:
  - file: images/quiz-33-01.png
    path: images/quiz-33-01.png
    alt: 第33問 文字を書き換えるの参考画像
---

今回は、実際にHTMLの内容を書き換えてみましょう。

下の方に、HTMLコードを用意しました。

「こんにちは」と書いたテキストボックスがあるので、
これの文字を書き換えてみましょう。

<div id=“text”></div>を取得するには、

getElementByIdメソッドを使用すると、
id名を指定して、オブジェクトを取得できます。

文字の書き換えは、いくつか方法がありますが、
innerHTMLプロパティが使えます。

このヒントをもとに、
テキストを書き換えてみてください！

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div id="text">
                こんにちは
            </div>
        </div>
        <style>
            #text {
                background: #f7f7f7;
                box-shadow: 0 2px 3px rgb(0 0 0 / 15%);
                padding: 2em;
            }
        </style>
    </body>
</html>
