---
id: quiz-48-answer-2
number: 1
type: コード
title: |-
  ①
  .productの在庫数を読み取って、
  consoleに表示してみましょう。
language: html
required: true
starter: |-
  <html><body><div class="product" data-stock="3">この商品はあと3つしかありません。</div><div class="product2">在庫がたくさんあります</div><script>

  </script>
  </body></html>
example: |-
  <html><body><div class="product" data-stock="3">この商品はあと3つしかありません。</div><div class="product2">在庫がたくさんあります</div><script>
  console.log(document.querySelector('.product').dataset.stock);
  </script>
  </body></html>
feedback: data-stockを読み取って表示してください。
---
