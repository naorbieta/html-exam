import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'render',
  documentAnswer: true,
  html: '<!doctype html><html><body><div class="cards"><div class="card">カード1</div><div class="card">カード2</div><div class="card">カード3</div></div></body></html>',
  async check(h) {
    const cards = h.el('.cards');
    h.assert(cards, '.cards の要素が見つかりません。HTML は元のままにしてください。');
    await h.frame();
    const display = h.css(cards).display;
    h.assert(display === 'grid' || display === 'inline-grid', '.cards が CSSグリッド（display: grid）になっていません。');
    const items = h.all('.cards > .card');
    h.assert(items.length === 3, 'カード（.card）が3枚見つかりません。HTML は元のままにしてください。');
    const rects = items.map(item => h.rect(item));
    h.assert(rects.every(rect => Math.abs(rect.top - rects[0].top) < 2), '3枚のカードが横一列（3列）に並んでいません。');
    h.assert(rects[0].left < rects[1].left && rects[1].left < rects[2].left, '3枚のカードが左から順に並んでいません。');
    h.assert(rects.every(rect => rect.width > 40), 'カードの幅が狭すぎます。');
  }
};

export default grader;
