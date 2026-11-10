import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  previous: ["quiz-06-answer-2"],
  check(h) {
    const name=h.source.match(/\b(?:let|var|const)\s+([$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*)/u)[1]; h.assert(eval(name)!==undefined,'宣言した変数に値を代入してください。');
  },
  completeProgram: true
};

export default grader;
