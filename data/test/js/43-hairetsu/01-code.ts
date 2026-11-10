import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  context: [
    {
      name: "fruits",
      code: "let fruits=[\"りんご\",\"バナナ\",\"オレンジ\"];"
    }
  ],
  check(h) {
    h.assert(h.alerts.length===1 && h.alerts[0]==="りんご", 'ダイアログの内容を確認してください。');
  }
};

export default grader;
