import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"box gradation1\">\n            </div>\n            <div class=\"box gradation2\">\n            </div>\n            <div class=\"box gradation3\">\n            </div>\n        </div>\n    </body>\n    <style>\n        .wrapper {\n            width: 900px;\n            margin: 0 auto;\n            display: flex;\n            gap: 5em;\n        }\n        .box {\n            width: 200px;\n            height: 200px;\n            background: #ccc;\n        }\n    </style>\n</html>",
  check(h) {
    const g=h.gradient('.gradation3'),a=g.colors[0],b=g.colors.at(-1);h.assert(g.type==='radial'&&a.g>a.r&&a.g>a.b&&b.r+b.g+b.b>a.r+a.g+a.b,'中心の緑色から外側の明るい色へ変わる放射状のグラデーションにしてください。');
  },
  target: ".gradation3",
  documentAnswer: true
};

export default grader;
