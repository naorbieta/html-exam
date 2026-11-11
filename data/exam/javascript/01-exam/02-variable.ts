import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'code',
  check(h) {
    h.assert(h.logText().some(text => text.includes('太郎')), '変数に「太郎」を入れて console.log で出力してください。');
  }
};

export default grader;
