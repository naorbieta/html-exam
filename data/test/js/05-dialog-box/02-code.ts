import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  check(h) {
    h.assert(h.confirmCalls===1,'confirmを1回呼び出してください。');
  }
};

export default grader;
