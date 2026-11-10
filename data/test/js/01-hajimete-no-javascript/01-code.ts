import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  check(h) {
    h.assert(h.logText().includes('Hello World!'), 'Hello World! の大文字・空白・記号を確認してください。');
  }
};

export default grader;
