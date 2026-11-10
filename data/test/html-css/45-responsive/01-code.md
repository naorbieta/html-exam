---
id: web-45-answer-1
number: 1
type: コード
title: |-
  ①
  <!-- 【ここに何か必要】 -->　と書いてあるところがあります。
  <head>タグの中にviewportのタグというのを書くことから始まります。
  書いてみましょう。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head>
          <!-- 【ここに何か必要】 -->
      </head>
      <body>
          <div class="wrapper">
              <ul>
                  <li class="box">
                      <h1>タイトル</h1>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                  </li>
                  <li class="box">
                      <h1>タイトル</h1>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                  </li>
                  <li class="box">
                      <h1>タイトル</h1>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                  </li>
              </ul>
          </div>
      </body>
      <style>
          .wrapper {
              width: 900px;
              margin: 0 auto;
          }
          ul {
              display: flex;
              list-style-type: none;
          }
          .box {
              width: calc(100% / 3);
              background: #ccc;
          }
      </style>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
      <head>
          <!-- 【ここに何か必要】 -->
      <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
      <body>
          <div class="wrapper">
              <ul>
                  <li class="box">
                      <h1>タイトル</h1>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                  </li>
                  <li class="box">
                      <h1>タイトル</h1>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                  </li>
                  <li class="box">
                      <h1>タイトル</h1>
                      <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                  </li>
              </ul>
          </div>
      </body>
      <style>
          .wrapper {
              width: 900px;
              margin: 0 auto;
          }
          ul {
              display: flex;
              list-style-type: none;
          }
          .box {
              width: calc(100% / 3);
              background: #ccc;
          }
      </style>
  </html>
feedback: HTMLの要素・属性と問題の条件を確認してください。
---
