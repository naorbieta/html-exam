---
id: quiz-41
course: JavaScript / 初級
number: 41
title: タイマー処理
images:
  - file: images/quiz-41-01.png
    path: images/quiz-41-01.png
    alt: 第41問 タイマー処理の参考画像
  - file: images/quiz-41-02.png
    path: images/quiz-41-02.png
    alt: 第41問 タイマー処理の参考画像
---

クリックや、キーボードのキーをトリガーにすることができましたが、
押してすぐ直後に発動するのではなく、
少し待ってから発動させたいということもあると思います。

そこで登場するのが、setIntervalメソッドです。
これを使うと、処理が一定間隔で発動されるようにすることができます。

では、問題です。
下に、コードを用意しました。

スタートボタンを押したら、
5、4、3、2、1、ドーン！
とカウントダウンが表示されるようにしてみましょう。

画像の「？」のところに書き加えて、
カウントダウンのプログラムを完成させてください。

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
                let count = 5;
                text.innerHTML = count;
		「？」
            });
        </script>
    </body>
</html>
