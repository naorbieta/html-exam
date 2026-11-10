import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<!doctype html><html><body><div class=\"wrapper\"><div id=\"text\" class=\"text\">こんにちは</div></div></body></html>",
  requires: ["querySelector"],
  check(h) {
    h.assert(document.querySelector('.text').style.color,'style.colorで文字色を指定してください。');
  },
  documentAnswer: true
};

export default grader;
