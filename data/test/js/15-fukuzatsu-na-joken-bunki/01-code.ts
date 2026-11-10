import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  cases: [
    {
      confirms: [false],
      check(h) {
        h.assert(h.alerts.length===1&&/財布.*(取り|取って)/.test(h.alerts[0]),'財布を持っていない場合の分岐を確認してください。');
      }
    },
    {
      confirms: [true],
      prompts: ["499"],
      check(h) {
        h.assert(h.alerts.length===1&&/注文しません/.test(h.alerts[0]),'499・500・1499・1500円の分岐を確認してください。');
      }
    },
    {
      confirms: [true],
      prompts: ["500"],
      check(h) {
        h.assert(h.alerts.length===1&&/ポテト/.test(h.alerts[0]),'499・500・1499・1500円の分岐を確認してください。');
      }
    },
    {
      confirms: [true],
      prompts: ["1499"],
      check(h) {
        h.assert(h.alerts.length===1&&/ポテト/.test(h.alerts[0]),'499・500・1499・1500円の分岐を確認してください。');
      }
    },
    {
      confirms: [true],
      prompts: ["1500"],
      check(h) {
        h.assert(h.alerts.length===1&&/ハンバーガー/.test(h.alerts[0]),'499・500・1499・1500円の分岐を確認してください。');
      }
    }
  ]
};

export default grader;
