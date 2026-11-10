---
id: web-58
course: HTML・CSS・Web基礎
number: 58
title: コンテンツの増減に備える pt.2
---

前回に引き続き、
コンテンツを増減することで、

問題が起きるコードを組みました。

タグをつけることができる
記事の一覧のようなもののイメージです。

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
                        <div class="tag">
                            <span>ブログ</span>
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
                        <div class="tag">
                            <span>ブログ</span>
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
                        <div class="tag">
                            <span>ブログ</span><span>新着情報</span>
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
                gap: 3em 5%;
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
            .tag span {
                font-size: 0.8em;
                padding: 0.5em 1em;
                background: rgb(142, 169, 226);
                border-radius: 9999px;
            }
            .tag span + span {
                margin-left: 0.5em;
            }
        </style>
    </body>
</html>
