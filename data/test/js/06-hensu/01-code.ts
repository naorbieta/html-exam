import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  requires: [
    "\\b(?:let|var|const)\\s+[$_\\p{ID_Start}][$_\\u200C\\u200D\\p{ID_Continue}]*"
  ]
};

export default grader;
