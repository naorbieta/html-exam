import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<!doctype html><html><body><div class=\"wrapper\"><div id=\"text\" class=\"text\">こんにちは</div></div></body></html>",
  check(h) {
    for(const key of ['c','Enter','ArrowUp']){h.key(key);h.assert(h.text('.text').includes(key),'押されたキーの名前を表示してください。');}
  },
  documentAnswer: true
};

export default grader;
