import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  cases: [
    {
      prompts: ["9999"],
      check(h) {
        h.assert(h.alerts.length===1&&!h.alerts[0].includes('お金持ち'),'10000未満にも別のメッセージを表示してください。');
      }
    },
    {
      prompts: ["10000"],
      check(h) {
        h.assert(h.alerts.length===1&&h.alerts[0].includes('お金持ち'),'10000以上でメッセージを表示してください。');
      }
    },
    {
      prompts: ["12000"],
      check(h) {
        h.assert(h.alerts.length===1&&h.alerts[0].includes('お金持ち'),'10000以上でメッセージを表示してください。');
      }
    }
  ]
};

export default grader;
