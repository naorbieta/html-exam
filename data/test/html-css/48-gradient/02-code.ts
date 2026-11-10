import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"box gradation1\">\n            </div>\n            <div class=\"box gradation2\">\n            </div>\n            <div class=\"box gradation3\">\n            </div>\n        </div>\n    </body>\n    <style>\n        .wrapper {\n            width: 900px;\n            margin: 0 auto;\n            display: flex;\n            gap: 5em;\n        }\n        .box {\n            width: 200px;\n            height: 200px;\n            background: #ccc;\n        }\n    </style>\n</html>",
  check(h) {
    const g=h.gradient('.gradation2'),a=g.colors[0],b=g.colors.at(-1),blue=c=>c.b>c.r&&c.b>c.g&&c.a>.5;h.assert(g.type==='linear'&&(Math.abs(g.direction-135)<.1&&blue(a)&&b.a<.05||Math.abs(g.direction-315)<.1&&a.a<.05&&blue(b)),'左上の青色から右下の透明へ変わるグラデーションにしてください。');
  },
  target: ".gradation2",
  documentAnswer: true
};

export default grader;
