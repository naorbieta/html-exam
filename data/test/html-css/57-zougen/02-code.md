---
id: web-57-answer-2
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
                              <p>タイトルテキスト</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                          <div class="button">
                              <span class="dot"></span>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトルテキストタイトルテキスト</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                          <div class="button">
                              <span class="dot"></span>
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
                          <div class="button">
                              <span class="dot"></span>
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
                  gap: 5%;
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
              .button {
                  width: 30px;
                  height: 30px;
                  position: absolute;
                  top: 0;
                  right: 0;
                  cursor: pointer;
              }
              .dot {
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0;
                  margin: auto;
              }
              .dot, .dot::before, .dot::after {
                  display: block;
                  position: absolute;
                  border-radius: 50%;
                  width: 3px;
                  height: 3px;
                  background-color: #333;
              }
              .dot::before {
                  content: '';
                  top: -6px;
              }

              .dot::after {
                  content: '';
                  top: 6px;
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
                              <p>タイトルテキスト</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                          <div class="button">
                              <span class="dot"></span>
                          </div>
                      </div>
                  </li>
                  <li>
                      <div class="card">
                          <div class="title">
                              <p>タイトルテキストタイトルテキスト</p>
                          </div>
                          <div class="text">
                              <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>
                          </div>
                          <div class="button">
                              <span class="dot"></span>
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
                          <div class="button">
                              <span class="dot"></span>
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
                  gap: 5%;
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
              .button {
                  width: 30px;
                  height: 30px;
                  position: absolute;
                  top: 0;
                  right: 0;
                  cursor: pointer;
              }
              .dot {
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0;
                  margin: auto;
              }
              .dot, .dot::before, .dot::after {
                  display: block;
                  position: absolute;
                  border-radius: 50%;
                  width: 3px;
                  height: 3px;
                  background-color: #333;
              }
              .dot::before {
                  content: '';
                  top: -6px;
              }

              .dot::after {
                  content: '';
                  top: 6px;
              }
          </style>
      </body>
  <style>
  .title{padding-right:30px}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※追加するCSSを記述してください。
