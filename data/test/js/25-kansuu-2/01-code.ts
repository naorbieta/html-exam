import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  check(h) {
    h.assert(typeof maxNumber==='function','maxNumberを定義してください。'); for(const [a,b] of [[5,10],[3,4],[103,17],[-8,-2],[7,7]]) h.assert(maxNumber(a,b)===Math.max(a,b),'大きい方の数値をreturnしてください。');
  }
};

export default grader;
