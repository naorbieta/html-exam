---
id: web-72-answer-2
number: 2
type: コード
title: |-
  ②(画像参照)
  この効果を適用するCSSを書きましょう。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="box">
                  <img src="https://i.postimg.cc/YCbHZBQR/sunset-7504891-1920.jpg">
              </div>
          </div>
          <style>
              .wrapper {
                  width: 900px;
                  margin: 0 auto;
              }
              .box img {
                  width: 100%;
                  display: block;
              }
          </style>
      </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="box">
                  <img src="https://i.postimg.cc/YCbHZBQR/sunset-7504891-1920.jpg">
              </div>
          </div>
          <style>
              .wrapper {
                  width: 900px;
                  margin: 0 auto;
              }
              .box img {
                  width: 100%;
                  display: block;
              }
          </style>
      </body>
  <style>
  img{filter:blur(5px);transform:scale(1.03)}.box{overflow:hidden}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※追加するCSSを記述してください。

※画像のふちが、ボケないように注意！
