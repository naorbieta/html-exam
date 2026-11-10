---
id: web-48-answer-2
number: 2
type: コード
title: |-
  ②(画像参照)
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
  .gradation2{background:linear-gradient(to bottom right,blue,transparent);}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※.gradation2 に対して、CSSを記述してください。
