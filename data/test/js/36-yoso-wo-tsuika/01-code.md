---
id: quiz-36-answer-2
number: 1
type: コード
title: |-
  JavaScriptを使って、
  <div id="add_element"></div>を、HTML上の<div class="text"></div>の前に追加してください。
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
  const el=document.createElement('div');
  el.id='add_element';
  const text=document.querySelector('.text');
  text.parentNode.insertBefore(el,text);
  </script>
  </body>
  </html>
feedback: 新しく作成したdivを、.text要素の直前に追加してください。
---
