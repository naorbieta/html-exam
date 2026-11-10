---
id: web-59
course: HTML・CSS・Web基礎
number: 59
title: コンテンツの増減に備える pt.3
---

またまた、
コンテンツを増減することで、

問題が起きるコードを組みました。

同じく記事一覧のようなコンテンツです。

このコードを書き換えて、
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
                            <p>タイトル</p>
                        </div>
                        <div class="text">
                            <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="card">
                        <div class="title">
                            <p>タイトルテキスト</p>
                        </div>
                        <div class="text">
                            <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
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
                    </div>
                </li>
                <li>
                    <div class="card">
                        <div class="title">
                            <p>タイトルテキスト</p>
                        </div>
                        <div class="text">
                            <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="card">
                        <div class="title">
                            <p>タイトル</p>
                        </div>
                        <div class="text">
                            <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="card">
                        <div class="title">
                            <p>タイトル</p>
                        </div>
                        <div class="text">
                            <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
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
                justify-content: space-between;
            }
            li {
                width: 30%;
                padding: 1%;
                border: 1px solid #eee;
                border-radius: 5px;
            }
            li:nth-child(n+4) {
                margin-top: 5%;
            }
            .card {
                position: relative;
            }
            .title {
                font-size: 1.2em;
                font-weight: 700;
            }
        </style>
    </body>
</html>
