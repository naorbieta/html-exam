---
id: quiz-42
course: JavaScript / 初級
number: 42
title: 連打ゲームを作ってみる
images:
  - file: images/quiz-42-01.png
    path: images/quiz-42-01.png
    alt: 第42問 連打ゲームを作ってみるの参考画像
  - file: images/quiz-42-02.png
    path: images/quiz-42-02.png
    alt: 第42問 連打ゲームを作ってみるの参考画像
---

前回は、setIntervalメソッドというのを使って、
一定間隔で処理を発動してみました。

これと似たもので、
時間がたったら一回だけ処理する、

setTimeoutメソッドというものがあります。

では、問題です。
これを使って、簡単なゲームを作ってみようと思います。

下にコードを用意しました。

「スタート」ボタンを押すと
「5秒以内にEnterを10回連打せよ!」という
メッセージが表示されるようにしてあります。

メッセージの通り、

5秒以内にEnterを10回押したら「クリア！」
押せなかったら「失敗！」

と表示されるようにしてみましょう。

※失敗になってからEnterを押したとき、クリア！と出ないように注意しましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="text">
                <button id="trigger">スタート</button>
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
        <script>
            const text = document.querySelector('.text');
            const btn = document.getElementById('trigger');
            btn.addEventListener('click', function() {
                let count = 0;
                let flag = true;
                text.innerHTML = '5秒以内にEnterを10回連打せよ!';
                「？」
            });
        </script>
    </body>
</html>
