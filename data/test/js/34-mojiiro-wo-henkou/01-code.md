---
id: quiz-34-answer-2
number: 1
type: コード
title: |-
  HTML上の<div class="text">を、querySelectorを使って取得し、
  文字色を変更してください。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="text">
                  こんにちは
              </div>
          </div>
          <style>
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
                  こんにちは
              </div>
          </div>
          <style>
              .text {
                  background: #f7f7f7;
                  box-shadow: 0 2px 3px rgb(0 0 0 / 15%);
                  padding: 2em;
              }
          </style>
      <script>
  document.querySelector('.text').style.color='red';
  </script>
  </body>
  </html>
feedback: querySelectorで取得し、style.colorを変更してください。
---
