---
id: exam-php-03
number: 3
type: 単一選択
title: フォームが method="post" で送られたとき、name 属性が username の入力値を PHP で受け取る書き方はどれですか？
required: true
choices:
  - "$_POST['username']"
  - "$_GET['username']"
  - "$username"
  - "$_COOKIE['username']"
answers:
  - "$_POST['username']"
feedback: POST で送られた値は $_POST から取り出します。GET は URL のパラメータ、COOKIE は Cookie です。
---
