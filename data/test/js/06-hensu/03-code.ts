import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  previous: ["quiz-06-answer-2", "quiz-06-answer-3"],
  check(h) {
    const name=h.source.match(/\b(?:let|var|const)\s+([$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*)/u)[1]; h.assert(h.logs.some(args=>args.some(v=>v===eval(name))),'変数の値をconsole.logで表示してください。');
  },
  completeProgram: true
};

export default grader;
