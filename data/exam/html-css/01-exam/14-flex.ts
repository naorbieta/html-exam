import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'render',
  documentAnswer: true,
  html: '<!doctype html><html><body><ul class="menu"><li>ホーム</li><li>案内</li><li>連絡</li></ul></body></html>',
  async check(h) {
    const menu = h.el('.menu') || h.el('ul');
    h.assert(menu, 'メニューの要素を残してください。');
    await h.frame();
    const display = h.css(menu).display;
    h.assert(display === 'flex' || display === 'inline-flex', 'flexbox（display: flex または inline-flex）を使ってください。');
    const items = h.all('.menu li, .menu > *');
    h.assert(items.length >= 2, 'メニューの項目を残してください。');
    await h.frame();
    const tops = items.map(item => h.rect(item).top);
    h.assert(tops.every(top => Math.abs(top - tops[0]) < 2), '項目が横一列に並ぶようにしてください。');
  }
};

export default grader;
