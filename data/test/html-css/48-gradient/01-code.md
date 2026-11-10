---
id: web-48-answer-1
number: 1
type: コード
title: |-
  ①(画像参照)
  このグラデーションをCSSで再現してください。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="box gradation1">
              </div>
              <div class="box gradation2">
              </div>
              <div class="box gradation3">
              </div>
          </div>
      </body>
      <style>
          .wrapper {
              width: 900px;
              margin: 0 auto;
              display: flex;
              gap: 5em;
          }
          .box {
              width: 200px;
              height: 200px;
              background: #ccc;
          }
      </style>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="box gradation1">
              </div>
              <div class="box gradation2">
              </div>
              <div class="box gradation3">
              </div>
          </div>
      </body>
      <style>
          .wrapper {
              width: 900px;
              margin: 0 auto;
              display: flex;
              gap: 5em;
          }
          .box {
              width: 200px;
              height: 200px;
              background: #ccc;
          }
      </style>
  <style>
  .gradation1{background:linear-gradient(to bottom,red,yellow);}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※.gradation1 に対して、CSSを記述してください。
