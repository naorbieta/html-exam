---
id: web-34-answer-3
number: 3
type: コード
title: ③box2の中心を、boxの右下の角に合わせて配置してください。 (画像参照)
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="box">
              <div class="box2"></div>
          </div>
          <style>
              .box {
                  width: 400px;
                  height: 400px;
                  background: #f00;
              }
              .box2 {
                  width: 100px;
                  height: 100px;
                  background: #0f0;
              }
          </style>
      </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="box">
              <div class="box2"></div>
          </div>
          <style>
              .box {
                  width: 400px;
                  height: 400px;
                  background: #f00;
              }
              .box2 {
                  width: 100px;
                  height: 100px;
                  background: #0f0;
              }
          </style>
      </body>
  <style>
  .box{position:relative}.box2{position:absolute;top:100%;left:100%;transform:translate(-50%,-50%)}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

CSSを記述してください。
※positionを使ってください。
※たとえwidthやheightが変わったとしても
位置がずれないようにしてみましょう。
