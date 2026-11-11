import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'render',
  documentAnswer: true,
  html: '<!doctype html><html><body style="margin:0;min-height:2000px"><header>ヘッダー</header><main>本文</main><footer id="footer">フッター</footer></body></html>',
  async check(h) {
    const footer = h.el('#footer') || h.el('footer');
    h.assert(footer, 'footer要素を残してください。');
    await h.frame();
    const css = h.css(footer);
    const box = h.rect(footer);
    const viewport = h.document.documentElement.getBoundingClientRect();
    h.assert(css.position === 'fixed', 'スクロールしてもフッターが画面下に残るようにしてください。');
    h.assert(css.bottom === '0px' || Math.abs(box.bottom - viewport.bottom) < 2, 'フッターを画面の下端に置いてください。');
    h.assert(box.width >= viewport.width - 2, 'フッターの横幅をいっぱいにしてください。');
  }
};

export default grader;
