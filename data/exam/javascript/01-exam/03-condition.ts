import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'code',
  check(h) {
    h.assert(typeof judge === 'function', '関数 judge が見つかりません。');
    for (const [score, expected] of [[80, '合格'], [60, '合格'], [100, '合格'], [59, '不合格'], [0, '不合格'], [61, '合格']]) {
      h.assert(judge(score) === expected, `judge(${score}) の戻り値が「${expected}」になっていません。`);
    }
  }
};

export default grader;
