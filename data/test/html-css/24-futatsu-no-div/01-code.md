---
id: web-24-answer-1
number: 1
type: コード
title: Aのdivに追加するCSS
language: css
required: true
starter: |-
  <!DOCTYPE html>
  <html>
  <head>
  <style>
  .a, .b {
      height: 100px;
      width: 100px;
      padding: 20px;
      margin: 20px;
  }
  .a { background: cyan; }
  .b { background: #9146e6; }
  </style>
  </head>
  <body>
  <div class="a">A</div>
  <div class="b">B</div>
  </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
  <head>
  <style>
  .a, .b {
      height: 100px;
      width: 100px;
      padding: 20px;
      margin: 20px;
  }
  .a { background: cyan; }
  .b { background: #9146e6; }
  .a { box-sizing: border-box; }
  </style>
  </head>
  <body>
  <div class="a">A</div>
  <div class="b">B</div>
  </body>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---
