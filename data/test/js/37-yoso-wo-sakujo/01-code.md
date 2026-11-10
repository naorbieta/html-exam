---
id: quiz-37-answer-2
number: 1
type: コード
title: |-
  removeChildメソッドを使って、
  「こんばんは」というテキストボックスを削除してみましょう！
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div id="afternoon" class="text">
                  こんにちは
              </div>
              <div id="evening" class="text">
                  こんばんは
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
              <div id="afternoon" class="text">
                  こんにちは
              </div>
              <div id="evening" class="text">
                  こんばんは
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
  const evening=document.getElementById('evening');
  evening.parentNode.removeChild(evening);
  </script>
  </body>
  </html>
feedback: removeChildを使い、#evening要素を削除してください。
---
