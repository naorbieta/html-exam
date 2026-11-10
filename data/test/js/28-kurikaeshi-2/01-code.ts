import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  context: [
    {
      name: "n",
      code: "let n=2000;"
    }
  ],
  requires: ["\\bwhile\\s*\\("],
  check(h) {
    h.assert(JSON.stringify(h.logText())==="[\"2000\",\"1000\",\"500\",\"250\",\"125\"]", 'コンソールの出力を確認してください。');
  }
};

export default grader;
