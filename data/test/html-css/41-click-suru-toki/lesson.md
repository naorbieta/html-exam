---
id: web-41
course: HTML・CSS・Web基礎
number: 41
title: クリックするとき
images:
  - file: images/web-41-01.png
    path: images/web-41-01.png
    alt: 説明のない画像
---

ここに、
クリックすると開閉するアコーディオンがあります。

このアコーディオンを使って、

クリックできることを示したり、
クリックを反応させたくないなど……

クリックに関連するCSSをやってみましょう。
ユーザーに操作させるコンテンツを作るときに役に立つと思います。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <input id="acd-lock" class="acd-lock" type="checkbox">
        <input id="acd-check" class="acd-check" type="checkbox">
        <label class="acd-label" for="acd-check">クリックで開く</label>
        <div class="acd-content">
            <p>クイズ第４１問</p>
        </div>
        <style>
            .acd-check{
                display: none;
            }
            .acd-label{
                background: #333;
                color: #fff;
                display: block;
                margin-bottom: 1px;
                padding: 10px;
            }
            .acd-content{
                border: 1px solid #333;
                height: 0;
                opacity: 0;
                padding: 0 10px;
                visibility: hidden;
            }
            .acd-check:checked + .acd-label + .acd-content{
                height: 40px;
                opacity: 1;
                padding: 10px;
                visibility: visible;
            }
        </style>
    </body>
</html>
