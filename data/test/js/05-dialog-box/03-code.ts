import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  check(h) {
    h.assert(h.promptCount===1,'promptを1回呼び出してください。');
  }
};

export default grader;
