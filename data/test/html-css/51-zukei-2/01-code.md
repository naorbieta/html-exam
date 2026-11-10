---
id: web-51-answer-1
number: 1
type: コード
title: |-
  ①(画像参照)
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
  .balloon{height:200px;background:#10c1ed;position:relative}.balloon:after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border-left:84px solid transparent;border-right:84px solid transparent;border-top:50px solid #10c1ed}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※ .balloon に対して、CSSを記述してください。(もちろん擬似要素は可)

※ 横幅は .wrapperの幅いっぱいにしてください。
※ 練習なので、正確に画像と同じ形でなくても構いません。
ただし、ウィンドウ幅を変えたときに、図形が変形しないように注意してください。

※ どんなプロパティを使うかなど、やり方はおまかせします。
(ただし、コードがぐちゃぐちゃにならないように注意してください。)
