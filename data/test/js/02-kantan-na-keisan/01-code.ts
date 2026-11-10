import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  requires: ["\\+", "-", "\\*", "/"],
  check(h) {
    h.assert(h.logs.length>=4 && h.logs.flat().filter(x=>typeof x==='number'&&Number.isFinite(x)).length>=4,'数値の計算結果を4つ表示してください。');
  }
};

export default grader;
