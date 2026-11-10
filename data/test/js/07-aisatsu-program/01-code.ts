import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  cases: [
    {
      prompts: ["太郎"],
      check(h) {
        h.assert(h.promptCount===1 && h.alerts.length===1 && h.alerts[0].includes('太郎') && /こんにちは|こんばんは|おはよう/.test(h.alerts[0]),'入力した名前を含むあいさつを表示してください。');
      }
    },
    {
      prompts: ["花子"],
      check(h) {
        h.assert(h.promptCount===1 && h.alerts.length===1 && h.alerts[0].includes('花子') && /こんにちは|こんばんは|おはよう/.test(h.alerts[0]),'入力した名前を含むあいさつを表示してください。');
      }
    }
  ]
};

export default grader;
