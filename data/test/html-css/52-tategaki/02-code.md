---
id: web-52-answer-2
number: 2
type: コード
title: |-
  ②
  次に、数字が90度横になっていて、読みにくいです。
  これを縦中横にしましょう。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <blockquote class="haiku">
                  <p>五月雨を<br>集めてはやし<br>最上川</p>
                  <p class="author">松尾芭蕉<br>(寛永<span class="digits">21</span>年 - 元禄<span class="digits">7</span>年)</p>
              </blockquote>
          </div>
          <style>
              .wrapper {
                  width: 30vw;
                  margin: 0 auto;
              }
              .haiku {
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  margin: 0;
                  border: 3px solid green;
                  line-height: 2;
                  padding: 20% 10%;
                  box-sizing: border-box;
              }
              .author {
                  margin-top: 3em;
              }
              .author:before {
                  content: '―――';
                  margin-top: -3em;
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
              <blockquote class="haiku">
                  <p>五月雨を<br>集めてはやし<br>最上川</p>
                  <p class="author">松尾芭蕉<br>(寛永<span class="digits">21</span>年 - 元禄<span class="digits">7</span>年)</p>
              </blockquote>
          </div>
          <style>
              .wrapper {
                  width: 30vw;
                  margin: 0 auto;
              }
              .haiku {
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  margin: 0;
                  border: 3px solid green;
                  line-height: 2;
                  padding: 20% 10%;
                  box-sizing: border-box;
              }
              .author {
                  margin-top: 3em;
              }
              .author:before {
                  content: '―――';
                  margin-top: -3em;
              }
          </style>
      </body>
  <style>
  .haiku{writing-mode:vertical-rl}
  </style>
  <style>
  .digits{text-combine-upright:all}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※追加するCSSを記述してください。
※縦中横とは、縦書きの中の数字2～3桁くらいを
横並びに組み込むことです。
