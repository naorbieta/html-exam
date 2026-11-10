---
id: web-58-answer-2
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
                          <div class="tag">
                              <span>ブログ</span>
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
                          <div class="tag">
                              <span>ブログ</span>
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
                          <div class="tag">
                              <span>ブログ</span><span>新着情報</span>
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
                  gap: 3em 5%;
              }
              li {
                  width: 30%;
                  padding: 1%;
                  border: 1px solid #eee;
                  border-radius: 5px;
              }
              .card {
                  position: relative;
              }
              .title {
                  font-size: 1.2em;
                  font-weight: 700;
              }
              .tag span {
                  font-size: 0.8em;
                  padding: 0.5em 1em;
                  background: rgb(142, 169, 226);
                  border-radius: 9999px;
              }
              .tag span + span {
                  margin-left: 0.5em;
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
                          <div class="tag">
                              <span>ブログ</span>
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
                          <div class="tag">
                              <span>ブログ</span>
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
                          <div class="tag">
                              <span>ブログ</span><span>新着情報</span>
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
                  gap: 3em 5%;
              }
              li {
                  width: 30%;
                  padding: 1%;
                  border: 1px solid #eee;
                  border-radius: 5px;
              }
              .card {
                  position: relative;
              }
              .title {
                  font-size: 1.2em;
                  font-weight: 700;
              }
              .tag span {
                  font-size: 0.8em;
                  padding: 0.5em 1em;
                  background: rgb(142, 169, 226);
                  border-radius: 9999px;
              }
              .tag span + span {
                  margin-left: 0.5em;
              }
          </style>
      </body>
  <style>
  .tag{display:flex;flex-wrap:wrap;gap:.5em}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※追加するCSSを自由に記述してください。
