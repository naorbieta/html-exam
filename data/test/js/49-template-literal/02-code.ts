import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  context: [
    {
      name: "number1",
      code: "let number1=5;"
    },
    {
      name: "number2",
      code: "let number2=7;"
    }
  ],
  requires: ["`", "\\$\\{"],
  check(h) {
    h.assert(JSON.stringify(h.logText())==="[\"5と7を足した値は、12です。\"]", 'コンソールの出力を確認してください。');
  }
};

export default grader;
