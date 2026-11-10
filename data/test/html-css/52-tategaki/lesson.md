---
id: web-52
course: HTML・CSS・Web基礎
number: 52
title: 縦書き
---

Webサイトは、

通常  左から右へ、文字が流れる
横書きですが、

これを縦書きにすることもできます。

ちょっと凝ったデザインにするときに
使いどころがあると思います。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <blockquote class="haiku">
                <p>五月雨を<br>集めてはやし<br>最上川</p>
                <p class="author">松尾芭蕉<br>(寛永<span class="digits">21</span>年 - 元禄<span class="digits">7</span>年)</p>
            </blockquote>
        </div>
        <style>
            .wrapper {
                width: 30vw;
                margin: 0 auto;
            }
            .haiku {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin: 0;
                border: 3px solid green;
                line-height: 2;
                padding: 20% 10%;
                box-sizing: border-box;
            }
            .author {
                margin-top: 3em;
            }
            .author:before {
                content: '―――';
                margin-top: -3em;
            }
        </style>
    </body>
</html>
