---
id: quiz-40
course: JavaScript / 初級
number: 40
title: 入力数の判定
images:
  - file: images/quiz-40-01.png
    path: images/quiz-40-01.png
    alt: 第40問 入力数の判定の参考画像
---

前回のクイズで、
キーボードのキーを押したときをトリガーにすることができたと思うので、

これを利用して、もう一つプログラムを作ってみましょう。

また、下にコードを用意しました。

今回は、文字を入力することができるテキストエリアを設置しています。
このテキストエリアに、何文字入っているか、
数字が表示されるようにしてみましょう。

ヒントとしては、
lengthプロパティというのを使うと、
文字数がいくつか調べることができます。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="text">
                入力された文字数を判定します。
            </div>
            <textarea id="textarea" cols="50" rows="10"></textarea>
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
