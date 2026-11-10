---
id: quiz-40-answer-2
number: 1
type: コード
title: テキストエリアの文字数が出るようにしてください。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="text">
                  入力された文字数を判定します。
              </div>
              <textarea id="textarea" cols="50" rows="10"></textarea>
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
                  入力された文字数を判定します。
              </div>
              <textarea id="textarea" cols="50" rows="10"></textarea>
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
  const ta=document.getElementById('textarea');
  ta.addEventListener('input',()=>{document.querySelector('.text').textContent=ta.value.length;});
  </script>
  </body>
  </html>
feedback: 入力イベントに合わせて、textarea.value.lengthを表示してください。
---
