---
id: web-45-answer-2
number: 2
type: コード
title: |-
  ②
  横並びのコンテンツがあります。
  スマホで見たときは、そのままだと見づらいので
  メディアクエリというのを使って、縦並びに変えましょう。
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
  <style>
  @media(max-width:767px){.wrapper{width:100%}ul{display:block;padding:0}.box{width:100%}}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※CSSを記述してください。
このとき、コンテンツが画面をはみださないように調整しましょう。
