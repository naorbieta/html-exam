---
id: quiz-38
course: JavaScript / 初級
number: 38
title: イベントリスナー
images:
  - file: images/quiz-38-01.png
    path: images/quiz-38-01.png
    alt: 第38問 イベントリスナーの参考画像
---

ここまでの問題では、記述したプログラムは
読み込んだらすぐに実行されていました。

では、「ボタンをクリックする」「キーボードを操作する」などの
ユーザーの操作きっかけ（イベント）で、プログラムを作動させるにはどうすればいいのでしょうか。

これは、イベントリスナーというものを使うと
実装することができます。

addEventListenerメソッドで
対象の要素に何か起きたときは、この動作をする
というふうに書くことができます。

では、問題です。

下にHTMLコードを用意しました。

ボタンをクリックしたとき、
テキストボックスが開閉するように

JavaScriptを記述してみましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <button id="toggle-btn">開閉ボタン</button>
            <div class="text" style="display: none;">
                こんにちは
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
