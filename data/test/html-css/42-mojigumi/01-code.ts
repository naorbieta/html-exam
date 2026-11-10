import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head>\n        <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n        <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n        <link href=\"https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap\" rel=\"stylesheet\">\n    </head>\n    <body>\n        <p>クイズ<br>クイズ<br>クイズ</p>\n    </body>\n</html>",
  check(h) {
    const s=h.css('p');h.assert(s.fontFamily.toLowerCase().includes('noto sans jp'),'Noto Sans JPを指定してください。');h.near(parseFloat(s.fontSize),72,'文字サイズを画像の設定に合わせてください。');h.assert(s.fontWeight==='500','文字の太さを画像の設定に合わせてください。');h.near(parseFloat(s.letterSpacing),3.6,'トラッキングの値をCSSの字間に換算してください。',.15);h.near(parseFloat(s.lineHeight),129.6,'自動行送り180%を行高に換算してください。',.3);h.assert(s.color==='rgb(0, 0, 0)','文字色を確認してください。');
  },
  target: "p",
  documentAnswer: true
};

export default grader;
