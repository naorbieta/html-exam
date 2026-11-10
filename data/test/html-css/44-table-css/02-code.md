---
id: web-44-answer-2
number: 2
type: コード
title: |-
  ②テーブルの列の幅がバラバラです。
  均等の幅になるようにしましょう。
language: html
required: true
starter: |-
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
example: |-
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
  <style>
  table{table-layout:fixed;width:100%}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※追加するCSSを記述してください。
