---
id: quiz-41-answer-3
number: 1
type: コード
title: |-
  画像の「？」のところに書き加えて、
  カウントダウンのプログラムを完成させてください。
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
                  let count = 5;
                  text.innerHTML = count;
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
                  let count = 5;
                  text.innerHTML = count;
  		const timer=setInterval(()=>{
   count--;
   if(count>0) text.innerHTML=count;
   else {text.innerHTML='ドーン！';clearInterval(timer);}
  },1000);
              });
          </script>
      </body>
  </html>
feedback: 1秒ごとに5から1へ減らし、最後にドーン！を表示してタイマーを停止してください。
hint: 画像の「？」の部分だけを入力します。text、btn、countは画像のコードどおり用意されています。
---
