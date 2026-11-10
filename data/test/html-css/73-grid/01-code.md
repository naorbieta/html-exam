---
id: web-73-answer-1
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
              <div class="box red"></div>
              <div class="box green"></div>
              <div class="box blue"></div>
              <div class="box yellow"></div>
          </div>
          <style>
              .wrapper {
                  width: 900px;
                  margin: 0 auto;
              }
              .box {
                  width: 100%;
                  min-height: 100px;
              }
              .red {background: #f00;}
              .green {background: #0f0;}
              .blue {background: #00f;}
              .yellow {background: #ff0;}
          </style>
      </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="box red"></div>
              <div class="box green"></div>
              <div class="box blue"></div>
              <div class="box yellow"></div>
          </div>
          <style>
              .wrapper {
                  width: 900px;
                  margin: 0 auto;
              }
              .box {
                  width: 100%;
                  min-height: 100px;
              }
              .red {background: #f00;}
              .green {background: #0f0;}
              .blue {background: #00f;}
              .yellow {background: #ff0;}
          </style>
      </body>
  <style>
  .wrapper{display:grid;grid-template-columns:150px 1fr;grid-template-rows:150px 300px 200px}.red{grid-column:1/3}.yellow{grid-column:1/3}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※追加するCSSを記述してください。
