---
id: web-51-answer-2
number: 2
type: コード
title: |-
  ②(画像参照)
  CSSで、この図形を描いてください。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="balloon"></div>
              <div class="trapezoid"></div>
          </div>
          <style>
              .wrapper {
                  width: 30vw;
                  margin: 5em auto;
              }
              .wrapper > * + * {
                  margin-top: 20em;
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
              <div class="balloon"></div>
              <div class="trapezoid"></div>
          </div>
          <style>
              .wrapper {
                  width: 30vw;
                  margin: 5em auto;
              }
              .wrapper > * + * {
                  margin-top: 20em;
              }
          </style>
      </body>
  <style>
  .trapezoid{height:200px;background:#10c1ed;clip-path:polygon(100px 0,100% 0,100% 100%,0 100%)}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※ .trapezoid に対して、CSSを記述してください。(もちろん擬似要素は可)


※ 横幅は .wrapperの幅いっぱいにしてください。

※ 練習なので、正確に画像と同じ形でなくても構いません。
ただし、ウィンドウ幅を変えたときに、図形が変形しないように注意してください。


※ どんなプロパティを使うかなど、やり方はおまかせします。
(ただし、コードがぐちゃぐちゃにならないように注意してください。)
