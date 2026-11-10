---
id: web-31-answer-2
number: 2
type: コード
title: |-
  ②空のpタグが記述されています。
  「:empty」を使って、
  CSSだけで、ここに何か文字を表示してみましょう。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <section>
              <h1>クイズ第３１問！</h1>
              <p>【１】この文字は赤色？</p>
              <p>【２】この文字は赤色？</p>
              <p>【３】この文字は赤色？</p>
              <p>【４】この文字は赤色？</p>
              <p>【５】この文字は赤色？</p>
              <!-- ② -->
              <p></p>
          </section>
          <style>
              /* ① */
              section p:not(:first-of-type) {
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
              <h1>クイズ第３１問！</h1>
              <p>【１】この文字は赤色？</p>
              <p>【２】この文字は赤色？</p>
              <p>【３】この文字は赤色？</p>
              <p>【４】この文字は赤色？</p>
              <p>【５】この文字は赤色？</p>
              <!-- ② -->
              <p></p>
          </section>
          <style>
              /* ① */
              section p:not(:first-of-type) {
                  color: red;
              }
          </style>
      </body>
  <style>
  p:empty::before{content:"文字"}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

CSSを記述してください。
