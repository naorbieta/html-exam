---
id: web-39
course: HTML・CSS・Web基礎
number: 39
title: フッター固定
---

以下のコードの①に追記をして、フッターを画面下に固定して下さい。
・この時、フッターは横幅一杯。
・スクロールをしてもフッターの位置は動かないように。
・Bのセクションを削除しても画面下に固定されているように。


<!DOCTYPE html>
<html>
<head>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        footer{
            ①
            height: 30px;
            background-color: gray;
        }
       </style>
</head>
<body>
    <main>
        <h1>タイトル</h1>
        <section> <!-- A -->
            <h2>タイトル2</h2>
            <div style="height:200px;background-color: red;">コンテンツ</div>
        </section>
        <section> <!-- B -->
            <h2>タイトル3</h2>
            <div style="height:2000px;background-color: red;">コンテンツ</div>
        </section>
    </main>
    <footer>フッター</footer>
</div>
</body>
</html>
