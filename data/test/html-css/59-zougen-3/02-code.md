---
id: web-59-answer-2
number: 2
type: コード
title: |-
  ②
  それは、どのようにCSSを記述すると
  解消できますか？
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <div class="wrapper">
              <ul>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトル</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトルテキスト</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトルテキストタイトルテキスト</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトルテキスト</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトル</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトル</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
              </ul>
          </div>
          <style>
              * {
                  box-sizing: border-box;
              }
              .wrapper {
                  width: 1200px;
                  margin: 0 auto;
              }
              ul {
                  list-style-type: none;
                  display: flex;
                  flex-wrap: wrap;
                  padding: 0;
                  justify-content: space-between;
              }
              li {
                  width: 30%;
                  padding: 1%;
                  border: 1px solid #eee;
                  border-radius: 5px;
              }
              li:nth-child(n+4) {
                  margin-top: 5%;
              }
              .card {
                  position: relative;
              }
              .title {
                  font-size: 1.2em;
                  font-weight: 700;
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
              <ul>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトル</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトルテキスト</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトルテキストタイトルテキスト</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトルテキスト</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトル</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトル</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                      </div>
                  </li>
              </ul>
          </div>
          <style>
              * {
                  box-sizing: border-box;
              }
              .wrapper {
                  width: 1200px;
                  margin: 0 auto;
              }
              ul {
                  list-style-type: none;
                  display: flex;
                  flex-wrap: wrap;
                  padding: 0;
                  justify-content: space-between;
              }
              li {
                  width: 30%;
                  padding: 1%;
                  border: 1px solid #eee;
                  border-radius: 5px;
              }
              li:nth-child(n+4) {
                  margin-top: 5%;
              }
              .card {
                  position: relative;
              }
              .title {
                  font-size: 1.2em;
                  font-weight: 700;
              }
          </style>
      </body>
  <style>
  ul{justify-content:flex-start;gap:5%}li:nth-child(n+4){margin-top:0}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※修正・追記するCSSを自由に記述してください。
