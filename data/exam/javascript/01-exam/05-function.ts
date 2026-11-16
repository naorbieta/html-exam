import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'code',
  check(h) {
    h.assert(typeof maxNumber === 'function', '関数 maxNumber が見つかりません。');
    for (const [a, b] of [[5, 10], [8, 3], [103, 17], [-8, -2], [7, 7], [0, -1]]) {
      h.assert(maxNumber(a, b) === Math.max(a, b), `maxNumber(${a}, ${b}) の戻り値が ${Math.max(a, b)} になっていません。`);
    }
  }
};

export default grader;
