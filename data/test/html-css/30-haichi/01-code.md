---
id: web-30-answer-1
number: 1
type: コード
title: 解答コード
language: css
required: true
starter: |-
  <!DOCTYPE html>
  <html>
  <head></head>
  <body>
  <style>
  ul{
              width: 300px;
              height: 300px;
              list-style: none;
              border: 3px solid black;
          }
          li{
              width: 100px;
              height: 100px;
              background-color: red;
          }
          li.center{
              width: 200px;
              height: 200px;
              background-color: blue;
          }
          li.right{
          }
  </style>


  <ul>
          <li class="left">左</li>
          <li class="center">中</li>
          <li class="right">右</li>
      </ul>
  </body>
  </html>
example: |-
  <!DOCTYPE html>
  <html>
  <head></head>
  <body>
  <style>
  ul{
              width: 300px;
              height: 300px;
              list-style: none;
              border: 3px solid black;
          }
          li{
              width: 100px;
              height: 100px;
              background-color: red;
          }
          li.center{
              width: 200px;
              height: 200px;
              background-color: blue;
          }
          li.right{
          }
  </style>


  <ul>
          <li class="left">左</li>
          <li class="center">中</li>
          <li class="right">右</li>
      </ul>
  <style>
  ul{position:relative;padding:0}li.left{position:absolute;top:0;left:0}li.right{position:absolute;bottom:0;right:0}li.center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1}
  </style>
  </body>
  </html>
feedback: 表示や動作が指定された条件と一致しません。
---
