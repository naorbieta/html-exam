import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<!doctype html><html><body><div class=\"wrapper\"><div id=\"text\" class=\"text\">こんにちは</div></div></body></html>",
  requires: ["getElementById"],
  check(h) {
    h.assert(h.text('#text')&&h.text('#text')!=='こんにちは','元の文字を別の文字に変更してください。');
  },
  documentAnswer: true
};

export default grader;
