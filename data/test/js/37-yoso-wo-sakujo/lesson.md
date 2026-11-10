---
id: quiz-37
course: JavaScript / 初級
number: 37
title: 要素を削除する
images:
  - file: images/quiz-37-01.png
    path: images/quiz-37-01.png
    alt: 第37問 要素を削除するの参考画像
---

要素を追加することができれば、もちろん削除をすることもできます。

要素の変更、追加、削除と、
一通りできるようになれば、

コーディングにJavaScriptを結構活かせるようになると思うので、
がんばっていきましょう。

要素を削除するには、
removeChildメソッドというのを使うことで可能です。

これを使って、
「こんばんは」というテキストボックスを削除してみましょう！

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div id="afternoon" class="text">
                こんにちは
            </div>
            <div id="evening" class="text">
                こんばんは
            </div>
        </div>
        <style>
            .wrapper > * + * {margin-top: 2em;}
            .text {
                background: #f7f7f7;
                box-shadow: 0 2px 3px rgb(0 0 0 / 15%);
                padding: 2em;
            }
        </style>

    </body>
</html>
