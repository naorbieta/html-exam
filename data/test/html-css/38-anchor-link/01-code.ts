import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<h1>タイトル</h1><div style=\"height:1500px\">コンテンツ</div><h2>ここを表示</h2>",
  check(h) {
    h.assert(h.css('html').scrollBehavior==='smooth','ページにスムーススクロールを設定してください。');
  },
  documentAnswer: true
};

export default grader;
