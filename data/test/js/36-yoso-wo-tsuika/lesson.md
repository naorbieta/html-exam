---
id: quiz-36
course: JavaScript / 初級
number: 36
title: 要素を追加する
images:
  - file: images/quiz-36-01.png
    path: images/quiz-36-01.png
    alt: 第36問 要素を追加するの参考画像
---

ここまで、
すでにHTML上にある要素の変更というのを行ってきましたが、

実は、
HTML上にない要素をJavaScript側で生成して追加するということも可能です。

試しに、
「<div id="add_element"></div>」という要素を
追加してみましょう。

新規にHTMLの要素を作成するのは、
createElementメソッドが使えます。

追加した要素にidを入れるのは、
setAttributeメソッドが使えます。

作った要素を、実際にHTMLのどこに追加するのかの指定は、
insertBeforeメソッドが使えます。

これらのヒントをもとに、実際に追加してみましょう。

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
