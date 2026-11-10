---
id: web-50-answer-1
number: 1
type: コード
title: |-
  ①
  CSSで、「正三角形」を描いてください。
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
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※ .triangle に対して、CSSを記述してください。(もちろん擬似要素は可)
※ どんなプロパティを使うかなど、やり方はおまかせします。

(ただし、コードがぐちゃぐちゃにならないように注意してください。)
