import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<!doctype html><html><body><div class=\"wrapper\"><div id=\"text\" class=\"text\">こんにちは</div></div></body></html>",
  check(h) {
    const el=document.getElementById('add_element');h.assert(el&&el.tagName==='DIV'&&el.nextElementSibling===document.querySelector('.text'),'id=add_elementのdivを.textの直前に追加してください。');
  },
  documentAnswer: true
};

export default grader;
