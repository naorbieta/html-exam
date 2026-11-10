---
id: web-50-answer-2
number: 2
type: コード
title: |-
  ②
  ①で作った正三角形にマウスカーソルをのせたときに
  くるっと180度回転させて、逆三角形になるようにしてみましょう。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="triangle"></div>
          </div>
          <style>
              .wrapper {
                  width: 80vw;
                  margin: 5em auto;
              }
          </style>
      </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="triangle"></div>
          </div>
          <style>
              .wrapper {
                  width: 80vw;
                  margin: 5em auto;
              }
          </style>
      </body>
  <style>
  .triangle{width:0;height:0;border-left:50px solid transparent;border-right:50px solid transparent;border-bottom:86.6px solid cyan}
  </style>
  <style>
  .triangle{transition:transform 1s}.triangle:hover{transform:rotate(180deg)}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※CSSを記述してください。
※ パッと切り替わるのではなく、簡単なアニメーションをつけましょう。
※ 回転したとき、もとの位置から大きくずれることがないようにしましょう。
