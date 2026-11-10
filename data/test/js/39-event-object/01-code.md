---
id: quiz-39-answer-2
number: 1
type: コード
title: |-
  テキストボックスに、押したキーの名前が
  出るようにしてみましょう。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="text">
                  押されたキーを判定します。
              </div>
          </div>
          <style>
              .wrapper > * + * {margin-top: 2em;}
              .text {
                  background: #f7f7f7;
                  box-shadow: 0 2px 3px rgb(0 0 0 / 15%);
                  padding: 2em;
              }
          </style>
      <script>

  </script>
  </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="text">
                  押されたキーを判定します。
              </div>
          </div>
          <style>
              .wrapper > * + * {margin-top: 2em;}
              .text {
                  background: #f7f7f7;
                  box-shadow: 0 2px 3px rgb(0 0 0 / 15%);
                  padding: 2em;
              }
          </style>
      <script>
  document.addEventListener('keydown',event=>{document.querySelector('.text').textContent=event.key;});
  </script>
  </body>
  </html>
feedback: イベントオブジェクトのkeyから押されたキーを取得してください。
---
