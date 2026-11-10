import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  cases: [
    {
      prompts: ["499"],
      confirms: [false],
      check(h) {
        h.assert(h.alerts.length===1&&/節約/.test(h.alerts[0]),'金額と空腹の両方の条件を確認してください。');
      }
    },
    {
      prompts: ["499"],
      confirms: [true],
      check(h) {
        h.assert(h.alerts.length===1&&/節約/.test(h.alerts[0]),'金額と空腹の両方の条件を確認してください。');
      }
    },
    {
      prompts: ["500"],
      confirms: [false],
      check(h) {
        h.assert(h.alerts.length===1&&/コーヒー/.test(h.alerts[0])&&!/ケーキ/.test(h.alerts[0]),'金額と空腹の両方の条件を確認してください。');
      }
    },
    {
      prompts: ["500"],
      confirms: [true],
      check(h) {
        h.assert(h.alerts.length===1&&/コーヒー/.test(h.alerts[0])&&!/ケーキ/.test(h.alerts[0]),'金額と空腹の両方の条件を確認してください。');
      }
    },
    {
      prompts: ["1499"],
      confirms: [false],
      check(h) {
        h.assert(h.alerts.length===1&&/コーヒー/.test(h.alerts[0])&&!/ケーキ/.test(h.alerts[0]),'金額と空腹の両方の条件を確認してください。');
      }
    },
    {
      prompts: ["1499"],
      confirms: [true],
      check(h) {
        h.assert(h.alerts.length===1&&/コーヒー/.test(h.alerts[0])&&!/ケーキ/.test(h.alerts[0]),'金額と空腹の両方の条件を確認してください。');
      }
    },
    {
      prompts: ["1500"],
      confirms: [false],
      check(h) {
        h.assert(h.alerts.length===1&&/コーヒー/.test(h.alerts[0])&&!/ケーキ/.test(h.alerts[0]),'金額と空腹の両方の条件を確認してください。');
      }
    },
    {
      prompts: ["1500"],
      confirms: [true],
      check(h) {
        h.assert(h.alerts.length===1&&/コーヒー/.test(h.alerts[0])&&/ケーキ/.test(h.alerts[0]),'金額と空腹の両方の条件を確認してください。');
      }
    }
  ]
};

export default grader;
