import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  requires: ["\\\\n"],
  check(h) {
    h.assert(h.alerts.length===1 && h.alerts[0]==="こんにちは、\n太郎さん。", 'ダイアログの内容を確認してください。');
  }
};

export default grader;
