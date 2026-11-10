import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<!doctype html><html><body><div class=\"wrapper\"><div id=\"text\" class=\"text\">こんにちは</div></div></body></html>",
  requires: ["querySelector"],
  check(h) {
    const el = document.querySelector('.text');
    const specified = el?.style.color || el?.style.getPropertyValue('color');
    let computed = '';
    try { computed = getComputedStyle(el).color; } catch {}
    const initial = 'rgb(0, 0, 0)';
    h.assert(specified || (computed && computed !== initial && computed !== 'rgba(0, 0, 0, 0)'), '文字色を変更してください。');
  },
  documentAnswer: true
};

export default grader;
