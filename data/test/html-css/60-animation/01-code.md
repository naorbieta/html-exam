---
id: web-60-answer-1
number: 1
type: コード
title: |-
  画像のような、
  2回転をちょっとこえるくらいの回転をして、
  最後キュッと定位置にもどるような
  アニメーションを作ってみてください。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <div class="box"></div>
          </div>
          <style>
              * {
                  box-sizing: border-box;
              }
              .wrapper {
                  width: 900px;
                  margin: 0 auto;
                  padding: 5em 0;
              }
              .box {
                  width: 100px;
                  height: 100px;
                  background: linear-gradient(to bottom, #FFC778, #F89174 50%, #748af8);
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
              <div class="box"></div>
          </div>
          <style>
              * {
                  box-sizing: border-box;
              }
              .wrapper {
                  width: 900px;
                  margin: 0 auto;
                  padding: 5em 0;
              }
              .box {
                  width: 100px;
                  height: 100px;
                  background: linear-gradient(to bottom, #FFC778, #F89174 50%, #748af8);
              }
          </style>
      </body>
  <style>
  @keyframes turn{0%{transform:rotate(0deg)}90%{transform:rotate(750deg)}100%{transform:rotate(720deg)}}.box{animation:turn 2s}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※追加するCSSを記述してください。
