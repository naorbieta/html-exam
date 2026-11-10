import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<html><body><div class=\"product\" data-stock=\"3\">この商品はあと3つしかありません。</div><div class=\"product2\">在庫がたくさんあります</div></body></html>",
  check(h) {
    h.assert(JSON.stringify(h.logText())==="[\"3\"]", 'コンソールの出力を確認してください。');
  },
  documentAnswer: true
};

export default grader;
