---
id: web-74-answer-1
number: 1
type: コード
title: |-
  CSSを記述して、
  画像の見た目を再現してください！
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
          </div>
          <style>
              .wrapper {
                  width: 80vw;
                  margin: 0 auto;
              }
              .box {
                  width: 100%;
                  min-height: 100px;
                  background: #adadad;
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
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
              <div class="box"></div>
          </div>
          <style>
              .wrapper {
                  width: 80vw;
                  margin: 0 auto;
              }
              .box {
                  width: 100%;
                  min-height: 100px;
                  background: #adadad;
              }
          </style>
      </body>
  <style>
  .wrapper{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※追加するCSSを記述してください。
