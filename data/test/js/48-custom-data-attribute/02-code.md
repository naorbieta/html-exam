---
id: quiz-48-answer-3
number: 2
type: コード
title: |-
  ②
  .product2に対して、
  JSで新たにカスタムデータ属性をセットしてみましょう。
language: html
required: true
starter: |-
  <html><body><div class="product" data-stock="3">この商品はあと3つしかありません。</div><div class="product2">在庫がたくさんあります</div><script>

  </script>
  </body></html>
example: |-
  <html><body><div class="product" data-stock="3">この商品はあと3つしかありません。</div><div class="product2">在庫がたくさんあります</div><script>
  document.querySelector('.product2').dataset.stock='10';
  </script>
  </body></html>
feedback: product2のdataset、またはsetAttributeでカスタムデータ属性を設定してください。
---
