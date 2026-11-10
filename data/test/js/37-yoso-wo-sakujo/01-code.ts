import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<html><body><div class=\"wrapper\"><div id=\"afternoon\" class=\"text\">こんにちは</div><div id=\"evening\" class=\"text\">こんばんは</div></div></body></html>",
  requires: ["removeChild"],
  check(h) {
    h.assert(!document.getElementById('evening')&&document.getElementById('afternoon'),'こんばんはだけを削除してください。');
  },
  documentAnswer: true
};

export default grader;
