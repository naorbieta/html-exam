import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n<head>\n<style>\n.a, .b {\n    height: 100px;\n    width: 100px;\n    padding: 20px;\n    margin: 20px;\n}\n.a { background: cyan; }\n.b { background: #9146e6; }\n</style>\n</head>\n<body>\n<div class=\"a\">A</div>\n<div class=\"b\">B</div>\n</body>\n</html>",
  check(h) {
    const r=h.rect('.a');h.near(r.width,100,'Aの幅が100pxになっていません。');h.near(r.height,100,'Aの高さが100pxになっていません。');h.assert(h.css('.a').padding==='20px','paddingは変更しないでください。');
  },
  target: ".a",
  documentAnswer: true
};

export default grader;
