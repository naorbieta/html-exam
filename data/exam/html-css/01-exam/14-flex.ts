import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'render',
  documentAnswer: true,
  html: '<!doctype html><html><body><ul class="menu"><li>ホーム</li><li>案内</li><li>連絡</li></ul></body></html>',
  async check(h) {
    const menu = h.el('.menu') || h.el('ul');
    h.assert(menu, 'メニュー（.menu）の要素が見つかりません。HTML は元のままにしてください。');
    await h.frame();
    const display = h.css(menu).display;
    h.assert(display === 'flex' || display === 'inline-flex', '.menu が flexbox になっていません。');
    const items = h.all('.menu > li');
    h.assert(items.length >= 3, 'メニューの項目（li）が3つ見つかりません。HTML は元のままにしてください。');
    await h.frame();
    const rects = items.map(item => h.rect(item));
    h.assert(rects.every(rect => Math.abs(rect.top - rects[0].top) < 2), '項目が横一列に並んでいません。');
    h.assert(rects.every((rect, index) => index === 0 || rect.left > rects[index - 1].left), '項目が左から順に並んでいません。');
  }
};

export default grader;
