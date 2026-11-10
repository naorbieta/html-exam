---
id: web-61-answer-1
number: 1
type: コード
title: |-
  （上の画像を参照）
  画像の円形に切り取られた一部分が跳ねて、
  そのあと、画像の全体が見えるようになる
  アニメーションを作ってみましょう。
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
  @keyframes reveal{0%{clip-path:circle(10%)}50%{clip-path:circle(10%);transform:translateY(50px)}100%{clip-path:circle(100%)}}.box img{animation:reveal 2s}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※追加するCSSを記述してください。
