import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<!doctype html><html><body><div class=\"wrapper\"><div id=\"text\" class=\"text\">こんにちは</div></div></body></html>",
  context: [
    {
      name: "text",
      code: "const text=document.querySelector('.text');"
    }
  ],
  check(h) {
    h.assert(document.querySelector('.text').style.backgroundColor,'backgroundColorで背景色を指定してください。');
  },
  documentAnswer: true
};

export default grader;
