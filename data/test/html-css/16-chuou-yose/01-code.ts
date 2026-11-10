import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "",
  check(h) {
    const e=h.all('body *').find(e=>e.children.length===0&&/wel+come!?/i.test(e.textContent.trim()));h.assert(e,'Welcomeの文字がありません。');const b=e.getBoundingClientRect();h.near(b.width,800,'ブロックの幅を800pxにしてください。');h.near(b.height,300,'ブロックの高さを300pxにしてください。');h.near((b.left+b.right)/2,innerWidth/2,'ブロックをページの左右中央に配置してください。');h.near(b.top,100,'ページ上端から100pxあけてください。');const range=document.createRange();range.selectNodeContents(e);const t=range.getBoundingClientRect();h.near((t.left+t.right)/2,(b.left+b.right)/2,'文字を左右中央に配置してください。',4);h.near((t.top+t.bottom)/2,(b.top+b.bottom)/2,'文字を上下中央に配置してください。',5);
  },
  htmlAnswer: true
};

export default grader;
