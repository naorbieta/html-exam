---
id: web-39-answer-1
number: 1
type: コード
title: ①の記述
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          *{
              margin: 0;
              padding: 0;
          }
          footer{
              ①
              height: 30px;
              background-color: gray;
          }
         </style>
  </head>
  <body>
      <main>
          <h1>タイトル</h1>
          <section> <!-- A -->
              <h2>タイトル2</h2>
              <div style="height:200px;background-color: red;">コンテンツ</div>
          </section>
          <section> <!-- B -->
              <h2>タイトル3</h2>
              <div style="height:2000px;background-color: red;">コンテンツ</div>
          </section>
      </main>
      <footer>フッター</footer>
  </div>
  </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          *{
              margin: 0;
              padding: 0;
          }
          footer{
              ①
              height: 30px;
              background-color: gray;
          }
         </style>
  </head>
  <body>
      <main>
          <h1>タイトル</h1>
          <section> <!-- A -->
              <h2>タイトル2</h2>
              <div style="height:200px;background-color: red;">コンテンツ</div>
          </section>
          <section> <!-- B -->
              <h2>タイトル3</h2>
              <div style="height:2000px;background-color: red;">コンテンツ</div>
          </section>
      </main>
      <footer>フッター</footer>
  </div>
  </body>
  <style>
  footer{position:fixed;bottom:0;width:100%;}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---
