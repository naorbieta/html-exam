import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<html><body><div class=\"product\" data-stock=\"3\">この商品はあと3つしかありません。</div><div class=\"product2\">在庫がたくさんあります</div></body></html>",
  check(h) {
    h.assert([...document.querySelector('.product2').attributes].some(a=>a.name.startsWith('data-')&&a.value),'product2にdata-で始まる属性と値を設定してください。');
  },
  documentAnswer: true
};

export default grader;
