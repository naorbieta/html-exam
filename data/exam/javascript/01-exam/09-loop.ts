import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'code',
  requires: ['\\b(?:for|while)\\b'],
  requirementHint: 'for 文または while 文を使ってください。',
  check(h) {
    h.assert(typeof showAll === 'function', '関数 showAll が見つかりません。');
    for (const list of [['茶', 'コーヒー'], ['A', 'B', 'C', 'D'], ['ひとつだけ']]) {
      const before = h.logText().length;
      showAll(list);
      const shown = h.logText().slice(before);
      // 表示の順番は問いません。要素がすべて1回ずつ表示されていれば正解です。
      h.assert(JSON.stringify([...shown].sort()) === JSON.stringify([...list].sort()), `showAll([${list.map(v => `'${v}'`).join(', ')}]) で、要素が1つずつすべて表示されていません。`);
    }
  }
};

export default grader;
