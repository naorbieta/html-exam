---
id: quiz-39
course: JavaScript / 初級
number: 39
title: イベントオブジェクト
images:
  - file: images/quiz-39-01.png
    path: images/quiz-39-01.png
    alt: 第39問 イベントオブジェクトの参考画像
---

前回は、「クリックしたとき」を判定したので、

今度は、キーボードのキーを操作したときの
動作を何か起こしてみましょう。

下記に、HTMLコードを用意しました。

テキストボックスには、
「押されたキーを判定します。」と表示しています。

キーを押したら、
このテキストボックスに、押したキーの名前が
出るようにしてみましょう。

addEventListenerメソッドをまた使いますが、
このとき、起きたイベントの情報がまとめられた
「イベントオブジェクト」から、
押されたキーの名前を呼び出すようにします。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="text">
                押されたキーを判定します。
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
