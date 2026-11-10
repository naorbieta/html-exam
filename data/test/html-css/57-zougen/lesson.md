---
id: web-57
course: HTML・CSS・Web基礎
number: 57
title: コンテンツの増減に備える
---

CMSでは、
ユーザーが簡単に、コンテンツの内容を書き換えることができますが、

それはつまり、決まったコンテンツの内容のときだけ、
キレイに見えればいいのではなく、

いろいろなパターンの入稿内容に耐えうる
コーディングをする必要があります。

下に、
簡単な事例のコードを組んでみました。

これのテキストを書き換えて、
問題点を探してみましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <ul>
                <li>
                    <div class="card">
                        <div class="title">
                            <p>タイトルテキスト</p>
                        </div>
                        <div class="text">
                            <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                        </div>
                        <div class="button">
                            <span class="dot"></span>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="card">
                        <div class="title">
                            <p>タイトルテキストタイトルテキスト</p>
                        </div>
                        <div class="text">
                            <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                        </div>
                        <div class="button">
                            <span class="dot"></span>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="card">
                        <div class="title">
                            <p>タイトルテキストタイトルテキスト</p>
                        </div>
                        <div class="text">
                            <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                        </div>
                        <div class="button">
                            <span class="dot"></span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <style>
            * {
                box-sizing: border-box;
            }
            .wrapper {
                width: 1200px;
                margin: 0 auto;
            }
            ul {
                list-style-type: none;
                display: flex;
                flex-wrap: wrap;
                padding: 0;
                gap: 5%;
            }
            li {
                width: 30%;
                padding: 1%;
                border: 1px solid #eee;
                border-radius: 5px;
            }
            .card {
                position: relative;
            }
            .title {
                font-size: 1.2em;
                font-weight: 700;
            }
            .button {
                width: 30px;
                height: 30px;
                position: absolute;
                top: 0;
                right: 0;
                cursor: pointer;
            }
            .dot {
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                margin: auto;
            }
            .dot, .dot::before, .dot::after {
                display: block;
                position: absolute;
                border-radius: 50%;
                width: 3px;
                height: 3px;
                background-color: #333;
            }
            .dot::before {
                content: '';
                top: -6px;
            }

            .dot::after {
                content: '';
                top: 6px;
            }
        </style>
    </body>
</html>
