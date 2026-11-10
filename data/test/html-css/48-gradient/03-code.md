---
id: web-48-answer-3
number: 3
type: コード
title: |-
  ③(画像参照)
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
  .gradation3{background:radial-gradient(circle,lime,white);}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※.gradation3 に対して、CSSを記述してください。
