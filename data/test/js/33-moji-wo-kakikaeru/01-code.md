---
id: quiz-33-answer-2
number: 1
type: コード
title: |-
  HTML上の<div id="text">を、getElementByIdを使って取得し、
  文字を書き換えてください。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div id="text">
                  こんにちは
              </div>
          </div>
          <style>
              #text {
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
              <div id="text">
                  こんにちは
              </div>
          </div>
          <style>
              #text {
                  background: #f7f7f7;
                  box-shadow: 0 2px 3px rgb(0 0 0 / 15%);
                  padding: 2em;
              }
          </style>
      <script>
  document.getElementById('text').textContent='こんばんは';
  </script>
  </body>
  </html>
feedback: getElementByIdで要素を取得し、テキストを書き換えてください。
---
