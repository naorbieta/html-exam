---
id: quiz-38-answer-2
number: 1
type: コード
title: |-
  ボタンをクリックしたとき、
  テキストボックスが開閉するようにしてみましょう。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <button id="toggle-btn">開閉ボタン</button>
              <div class="text" style="display: none;">
                  こんにちは
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
              <button id="toggle-btn">開閉ボタン</button>
              <div class="text" style="display: none;">
                  こんにちは
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
  const btn=document.getElementById('toggle-btn');
  const text=document.querySelector('.text');
  btn.addEventListener('click',()=>{text.style.display=text.style.display==='none'?'block':'none';});
  </script>
  </body>
  </html>
feedback: ボタンをクリックするたびに表示・非表示を切り替えてください。
---
