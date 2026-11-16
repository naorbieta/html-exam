import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'code',
  requires: ['\\b(?:let|const|var)\\s+[A-Za-z_$][\\w$]*\\s*=\\s*([\'"`])太郎\\1'],
  requirementHint: '変数を宣言して、文字列「太郎」を入れてください。',
  check(h) {
    h.assert(h.logText().some(text => text.includes('太郎')), 'コンソールに「太郎」が表示されていません。');
    h.assert(/console\.log\(\s*[A-Za-z_$][\w$]*\s*\)/.test(h.source.replace(/\/\/[^\n]*/g, '')), '文字を直接ではなく、変数を console.log に渡して表示してください。');
  }
};

export default grader;
