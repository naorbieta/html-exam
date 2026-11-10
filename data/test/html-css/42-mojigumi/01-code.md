---
id: web-42-answer-1
number: 1
type: コード
title: |-
  Photoshopで「クイズ」という文字が書いてあります。(画像参照)
  隣にあるのは、この文字の設定のパネルです。

  この情報をもとに
  画像の文字の見た目をCSSで再現してください。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
      </head>
      <body>
          <p>クイズ<br>クイズ<br>クイズ</p>
      </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
      </head>
      <body>
          <p>クイズ<br>クイズ<br>クイズ</p>
      </body>
  <style>
  p{font-family:"Noto Sans JP",sans-serif;font-size:72px;font-weight:500;letter-spacing:.05em;line-height:1.8;color:#000}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---
