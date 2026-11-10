---
id: quiz-48
course: JavaScript / 初級
number: 48
title: カスタムデータ属性
images:
  - file: images/quiz-48-01.png
    path: images/quiz-48-01.png
    alt: 第48問 カスタムデータ属性の参考画像
---

HTMLには、カスタムデータ属性というものがあります。
「data-〇〇」という特別な単語を使って、
その要素に自分だけの特別な名前をつけることができます。

例えばこんな感じです。
<div class="product" data-stock="3">この商品はあと3つしかありません。</div>

この例では、在庫数がいくつかという情報を、カスタムデータ属性として書いています。

情報が一意のidや特定のclassとは関係ない場合や、
その情報がJavaScriptで操作するために特に必要な場合、
カスタムデータ属性が役に立ちます。

では、問題です。
このカスタムデータ属性を、JavaScriptで
読み取ったり、新たにセットしたりしてみましょう。
