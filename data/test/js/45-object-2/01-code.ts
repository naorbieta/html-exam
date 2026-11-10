import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  context: [
    {
      name: "person",
      code: "let person={name:'ヒカキン',hometown:'新潟県'};"
    }
  ],
  check(h) {
    h.assert(JSON.stringify(h.logText())==="[\"ヒカキン\"]", 'コンソールの出力を確認してください。');
  }
};

export default grader;
