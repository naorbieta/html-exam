---
id: web-46
course: HTML・CSS・Web基礎
number: 46
title: カスタムプロパティ
---

CSSでは、カスタムプロパティといって、

プログラミングの世界のように、
変数を宣言し値を代入して、
それをあとから参照することができます。

これを使うことで、値を一か所で管理できたり、
値に名前が付くわけですから、どのような意図の値なのかがわかりやすいです。

実際にどのような動きになるか
確認しましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="box first_cont">
                【１】この箱の背景色は？
            </div>
            <div class="box second_cont">
                【２】この箱の背景色は？
            </div>
            <div class="box third_cont">
                【３】この文の文字色は？
            </div>
        </div>
    </body>
    <style>
        :root {
            --bg-color: #ff0000;
            --main-color: #00ffff;
            --accent-color: #0000ff;
        }
        .wrapper {
            width: 900px;
            margin: 0 auto;
            display: flex;
            gap: 1em;
        }
        .box {
            width: 200px;
            height: 200px;
            background: var(--bg-color);
        }
        .first_cont {
            color: var(--main-color);
        }
        .second_cont {
            --bg-color: #00ff00;
        }
        .third_cont {
            color: var(--txt-color, #ffff00);
        }
    </style>
</html>
