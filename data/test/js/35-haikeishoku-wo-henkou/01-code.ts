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
    const el = document.querySelector('.text');
    const specified = el?.style.backgroundColor || el?.style.getPropertyValue('background-color') || el?.style.background;
    let computed = '';
    try { computed = getComputedStyle(el).backgroundColor; } catch {}
    h.assert(specified || (computed && computed !== 'rgba(0, 0, 0, 0)' && computed !== 'transparent'), '背景色を変更してください。');
  },
  documentAnswer: true
};

export default grader;
