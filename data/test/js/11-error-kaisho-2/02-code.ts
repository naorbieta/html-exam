import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  check(h) {
    h.assert(h.alerts.length===1 && h.alerts[0]==="3600", 'ダイアログの内容を確認してください。');
  }
};

export default grader;
