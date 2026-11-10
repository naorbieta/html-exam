import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"box\"></div>\n            <div class=\"box\"></div>\n            <div class=\"box\"></div>\n            <div class=\"box\"></div>\n            <div class=\"box\"></div>\n            <div class=\"box\"></div>\n            <div class=\"box\"></div>\n            <div class=\"box\"></div>\n            <div class=\"box\"></div>\n        </div>\n        <style>\n            .wrapper {\n                width: 80vw;\n                margin: 0 auto;\n            }\n            .box {\n                width: 100%;\n                min-height: 100px;\n                background: #adadad;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    const children=h.all('.box'),r=children.map(e=>h.rect(e)),parent=h.rect('.wrapper');h.assert(h.css('.wrapper').display==='grid','gridで配置してください。');h.assert(r.every(b=>b.width>=199&&b.right<=parent.right+1),'要素の最小幅と領域への収まりを確認してください。');const row=r.filter(b=>Math.abs(b.top-r[0].top)<1);h.assert(row.length===Math.floor((parent.width+20)/220),'画面幅に応じて列数を変えてください。');h.near(row[1].left-row[0].right,20,'列の間隔を20pxにしてください。');h.near(r[row.length].top-r[0].bottom,20,'行の間隔を20pxにしてください。');
  },
  cases: [
    {
      width: 1200
    },
    {
      width: 900
    },
    {
      width: 600
    }
  ],
  documentAnswer: true
};

export default grader;
