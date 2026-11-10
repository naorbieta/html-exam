---
id: quiz-42-answer-3
number: 1
type: コード
title: |-
  画像の「？」のところに追記して、
  5秒以内にEnterを10回押したら「クリア！」
  押せなかったら「失敗！」
  と表示されるようにしてみましょう。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="text">
                  <button id="trigger">スタート</button>
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
              const text = document.querySelector('.text');
              const btn = document.getElementById('trigger');
              btn.addEventListener('click', function() {
                  let count = 0;
                  let flag = true;
                  text.innerHTML = '5秒以内にEnterを10回連打せよ!';
                  「？」
              });
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
                  <button id="trigger">スタート</button>
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
              const text = document.querySelector('.text');
              const btn = document.getElementById('trigger');
              btn.addEventListener('click', function() {
                  let count = 0;
                  let flag = true;
                  text.innerHTML = '5秒以内にEnterを10回連打せよ!';
                  document.addEventListener('keydown',event=>{
   if(flag && event.key==='Enter'){
    count++;
    if(count>=10){flag=false;text.innerHTML='クリア！';}
   }
  });
  setTimeout(()=>{if(flag){flag=false;text.innerHTML='失敗！';}},5000);
              });
          </script>
      </body>
  </html>
feedback: 成功と時間切れの両方でflagを切り替え、それ以降の状態変更を止めてください。
hint: 画像の「？」の部分だけを入力します。text、btn、count、flagは用意されています。
---
