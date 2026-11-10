---
id: web-53-answer-1
number: 1
type: コード
title: |-
  CSSを記述して、
  タイトルの左となりに、番号を、
  自動で上から1、2、3と振ってください。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <article>
              <section>
                  <h2>タイトルタイトル</h2>
                  <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
              </section>
              <section>
                  <h2>タイトルタイトル</h2>
                  <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
              </section>
              <section>
                  <h2>タイトルタイトル</h2>
                  <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
              </section>
          </article>
      </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <article>
              <section>
                  <h2>タイトルタイトル</h2>
                  <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
              </section>
              <section>
                  <h2>タイトルタイトル</h2>
                  <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
              </section>
              <section>
                  <h2>タイトルタイトル</h2>
                  <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
              </section>
          </article>
      </body>
  <style>
  body{counter-reset:section}h2::before{counter-increment:section;content:counter(section)}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---
