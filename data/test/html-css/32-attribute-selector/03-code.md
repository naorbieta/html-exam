---
id: web-32-answer-3
number: 3
type: コード
title: |-
  ③テキスト入力欄があります。
  属性セレクタを使って、これらの横幅を長くしてみましょう。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <section>
              <h1>クイズ第３２問！</h1>
              <a href="https://example.com/" target="_blank">【１】この文字は赤色？</a>
              <a href="#example">【２】この文字は赤色？</a>
              <a href="/question/">【３】この文字は赤色？</a>
              <a href="hogehoge.jpg">【４】この文字は赤色？</a>
              <a href="fugaguga.pdf">【５】この文字は赤色？</a>
          </section>
          <section id="example">
              <h1>Example</h1>
              <form action="#" method="post">
                  <!-- ③ ここから -->
                  <input type="text" name="text1">
                  <input type="text" name="text2">
                  <!-- ③ ここまで -->
                  <input type="submit" name="button">
              </form>
          </section>
          <style>
              /* ① */
              a[href^="#"] {
                  color: red;
              }
              /* ② */
              a[href$=".pdf"] {
                  color: red;
              }
          </style>
      </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <section>
              <h1>クイズ第３２問！</h1>
              <a href="https://example.com/" target="_blank">【１】この文字は赤色？</a>
              <a href="#example">【２】この文字は赤色？</a>
              <a href="/question/">【３】この文字は赤色？</a>
              <a href="hogehoge.jpg">【４】この文字は赤色？</a>
              <a href="fugaguga.pdf">【５】この文字は赤色？</a>
          </section>
          <section id="example">
              <h1>Example</h1>
              <form action="#" method="post">
                  <!-- ③ ここから -->
                  <input type="text" name="text1">
                  <input type="text" name="text2">
                  <!-- ③ ここまで -->
                  <input type="submit" name="button">
              </form>
          </section>
          <style>
              /* ① */
              a[href^="#"] {
                  color: red;
              }
              /* ② */
              a[href$=".pdf"] {
                  color: red;
              }
          </style>
      </body>
  <style>
  input[type="text"]{width:300px}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

CSSを記述してください。
