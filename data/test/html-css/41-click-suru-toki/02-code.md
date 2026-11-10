---
id: web-41-answer-2
number: 2
type: コード
title: |-
  ②今度は、
  「クリックで開く」のところをクリックしても
  何も起こらないようにしてみましょう。
language: html
required: true
starter: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <input id="acd-lock" class="acd-lock" type="checkbox">
          <input id="acd-check" class="acd-check" type="checkbox">
          <label class="acd-label" for="acd-check">クリックで開く</label>
          <div class="acd-content">
              <p>クイズ第４１問</p>
          </div>
          <style>
              .acd-check{
                  display: none;
              }
              .acd-label{
                  background: #333;
                  color: #fff;
                  display: block;
                  margin-bottom: 1px;
                  padding: 10px;
              }
              .acd-content{
                  border: 1px solid #333;
                  height: 0;
                  opacity: 0;
                  padding: 0 10px;
                  visibility: hidden;
              }
              .acd-check:checked + .acd-label + .acd-content{
                  height: 40px;
                  opacity: 1;
                  padding: 10px;
                  visibility: visible;
              }
          </style>
      </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
      <head></head>
      <body>
          <input id="acd-lock" class="acd-lock" type="checkbox">
          <input id="acd-check" class="acd-check" type="checkbox">
          <label class="acd-label" for="acd-check">クリックで開く</label>
          <div class="acd-content">
              <p>クイズ第４１問</p>
          </div>
          <style>
              .acd-check{
                  display: none;
              }
              .acd-label{
                  background: #333;
                  color: #fff;
                  display: block;
                  margin-bottom: 1px;
                  padding: 10px;
              }
              .acd-content{
                  border: 1px solid #333;
                  height: 0;
                  opacity: 0;
                  padding: 0 10px;
                  visibility: hidden;
              }
              .acd-check:checked + .acd-label + .acd-content{
                  height: 40px;
                  opacity: 1;
                  padding: 10px;
                  visibility: visible;
              }
          </style>
      </body>
  <style>
  .acd-label{pointer-events:none}
  </style>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---

※CSSを記述してください。
