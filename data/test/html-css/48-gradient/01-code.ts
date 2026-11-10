import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"box gradation1\">\n            </div>\n            <div class=\"box gradation2\">\n            </div>\n            <div class=\"box gradation3\">\n            </div>\n        </div>\n    </body>\n    <style>\n        .wrapper {\n            width: 900px;\n            margin: 0 auto;\n            display: flex;\n            gap: 5em;\n        }\n        .box {\n            width: 200px;\n            height: 200px;\n            background: #ccc;\n        }\n    </style>\n</html>",
  check(h) {
    const g=h.gradient('.gradation1');h.assert(g.type==='linear','直線のグラデーションにしてください。');const red=c=>c.r>c.g&&c.r>c.b&&c.a>.95,yellow=c=>c.r>150&&c.g>150&&c.b<c.r*.65&&c.b<c.g*.65&&c.a>.95;const a=g.colors[0],b=g.colors.at(-1);h.assert(g.direction===180&&red(a)&&yellow(b)||g.direction===0&&yellow(a)&&red(b),'上を赤系、下を黄色系にした縦のグラデーションにしてください。');
  },
  target: ".gradation1",
  documentAnswer: true
};

export default grader;
