import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  requires: ["\\bswitch\\s*\\("],
  cases: [
    {
      prompts: ["日", "2"],
      check(h) {
        h.assert(h.alerts.some(s=>s.includes('172800')),'日→時間→分→秒の変換倍率を確認してください。');
      }
    },
    {
      prompts: ["時間", "3"],
      check(h) {
        h.assert(h.alerts.some(s=>s.includes('10800')),'日→時間→分→秒の変換倍率を確認してください。');
      }
    },
    {
      prompts: ["分", "4"],
      check(h) {
        h.assert(h.alerts.some(s=>s.includes('240')),'日→時間→分→秒の変換倍率を確認してください。');
      }
    }
  ]
};

export default grader;
