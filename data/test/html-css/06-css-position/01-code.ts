import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'render',
  htmlAnswer: true,
  documentAnswer: true,
  async check(h) {
    const outer = h.document.querySelector('div');
    const inner = outer?.querySelector('div');
    h.assert(outer && inner, '外側と内側のdivを残してください。');
    h.assert(/テキスト/.test(inner.textContent), '「テキスト」を残してください。');
    await h.frame();
    const box = h.rect(outer);
    const text = h.rect(inner);
    h.near(box.width, 200, '横幅を200pxにしてください。');
    h.near(box.height, 200, '高さを200pxにしてください。');
    h.assert(h.css(outer).backgroundColor === 'rgb(128, 128, 128)', '背景色をgrayにしてください。');
    const positioned = value => ['relative', 'absolute', 'fixed', 'sticky'].includes(value);
    h.assert(positioned(h.css(outer).position) && positioned(h.css(inner).position), 'positionを使って配置してください。');
    h.near(text.right, box.right, 'テキストを右下に配置してください。');
    h.near(text.bottom, box.bottom, 'テキストを右下に配置してください。');
    h.assert(outer.getAttribute('style') && inner.getAttribute('style') && outer.style.position && inner.style.position, 'タグに直接styleを記述してください。');
  },
};

export default grader;
