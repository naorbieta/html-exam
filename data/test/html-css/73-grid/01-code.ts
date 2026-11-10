import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"box red\"></div>\n            <div class=\"box green\"></div>\n            <div class=\"box blue\"></div>\n            <div class=\"box yellow\"></div>\n        </div>\n        <style>\n            .wrapper {\n                width: 900px;\n                margin: 0 auto;\n            }\n            .box {\n                width: 100%;\n                min-height: 100px;\n            }\n            .red {background: #f00;}\n            .green {background: #0f0;}\n            .blue {background: #00f;}\n            .yellow {background: #ff0;}\n        </style>\n    </body>\n</html>",
  check(h) {
    h.assert(h.css('.wrapper').display==='grid','gridで配置してください。');const a=h.rect('.red'),b=h.rect('.green'),c=h.rect('.blue'),d=h.rect('.yellow');h.near(a.width,900,'赤の幅を確認してください。');h.near(a.height,150,'赤の高さを確認してください。');h.near(b.width,150,'左列の幅を確認してください。');h.near(b.height,300,'中央の行の高さを確認してください。');h.near(c.top,b.top,'青と緑を同じ行にしてください。');h.near(c.left,b.right,'青を緑の右に配置してください。');h.near(c.right,a.right,'青の右端をそろえてください。');h.near(d.top,b.bottom,'黄色を最下段に配置してください。');h.near(d.width,900,'黄色の幅を確認してください。');h.near(d.height,200,'黄色の高さを確認してください。');
  },
  documentAnswer: true
};

export default grader;
