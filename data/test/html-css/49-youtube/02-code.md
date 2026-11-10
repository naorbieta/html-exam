---
id: web-49-answer-2
number: 2
type: コード
title: |-
  ②
  埋め込んだ動画を、
  .wrapperの幅いっぱいになるようにして、
  さらに、ウィンドウ幅が変わっても
  動画のアスペクト比が維持されるようにしてください。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <!-- ここに埋め込み -->
          </div>
          <style>
              .wrapper {
                  width: 80vw;
                  margin: 0 auto;
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
              <iframe src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="動画"></iframe>
          </div>
          <style>
              .wrapper {
                  width: 80vw;
                  margin: 0 auto;
              }
          </style>
      </body>
  <style>
  iframe{width:100%;aspect-ratio:16/9;height:auto;border:0}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※CSSを記述してください。
