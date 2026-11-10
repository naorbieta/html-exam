import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <section>\n            <h1>クイズ第３１問！</h1>\n            <p>【１】この文字は赤色？</p>\n            <p>【２】この文字は赤色？</p>\n            <p>【３】この文字は赤色？</p>\n            <p>【４】この文字は赤色？</p>\n            <p>【５】この文字は赤色？</p>\n            <!-- ② -->\n            <p></p>\n        </section>\n        <style>\n            /*  */\n            section p:not(:first-of-type) {\n                color: red;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    const e=h.all('p').find(e=>!e.textContent.trim());h.assert(e,'空のp要素がありません。');const content=['::before','::after'].map(p=>getComputedStyle(e,p).content);h.assert(content.some(c=>c!=='none'&&c!=='normal'&&c!=='""'),'空のp要素に文字を表示してください。');h.assert(!h.all('p').filter(e=>e.textContent.trim()).some(e=>['::before','::after'].some(p=>!['none','normal','""'].includes(getComputedStyle(e,p).content))),'空のpだけに文字を追加してください。');
  },
  documentAnswer: true
};

export default grader;
