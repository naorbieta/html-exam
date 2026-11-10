---
id: web-44
course: HTML・CSS・Web基礎
number: 44
title: テーブル CSS編
images:
  - file: images/web-44-01.png
    path: images/web-44-01.png
    alt: 説明のない画像
---

以前、テーブル、
表のHTMLの書き方の問題があったのですが、

今回はテーブルの見た目を整えよう編です。

テーブルって、実はちょっと癖が強くて
難しいところがあるのですが、

見た目を整えるときによく使う
CSSを確認していきましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <table>
                <tr>
                    <th>新宿駅</th>
                    <td>2,404,763人</td>
                    <td>東京都</td>
                </tr>
                <tr>
                    <th>渋谷駅</th>
                    <td>2,284,302人</td>
                    <td>東京都</td>
                </tr>
                <tr>
                    <th>池袋駅</th>
                    <td>1,926,362人</td>
                    <td>東京都</td>
                </tr>
                <tr>
                    <th>横浜駅</th>
                    <td>1,673,613人</td>
                    <td>神奈川県</td>
                </tr>
                <tr>
                    <th>梅田駅</th>
                    <td>838,158人</td>
                    <td>大阪府</td>
                </tr>
            </table>
        </div>
    </body>
    <style>
        .wrapper {
            width: 900px;
            margin: 0 auto;
        }
        table {
            width: 100%;
        }
        th, td {
            border: 1px solid #333;
        }
    </style>
</html>
