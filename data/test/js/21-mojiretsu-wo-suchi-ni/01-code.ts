import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  cases: [
    {
      prompts: ["0"],
      check(h) {
        h.assert(h.alerts.length===1&&new RegExp('(?:^|[^0-9])4(?:[^0-9]|$)').test(h.alerts[0]),'文字列の連結ではなく、年齢に4を加算してください。');
      }
    },
    {
      prompts: ["24"],
      check(h) {
        h.assert(h.alerts.length===1&&new RegExp('(?:^|[^0-9])28(?:[^0-9]|$)').test(h.alerts[0]),'文字列の連結ではなく、年齢に4を加算してください。');
      }
    },
    {
      prompts: ["99"],
      check(h) {
        h.assert(h.alerts.length===1&&new RegExp('(?:^|[^0-9])103(?:[^0-9]|$)').test(h.alerts[0]),'文字列の連結ではなく、年齢に4を加算してください。');
      }
    }
  ]
};

export default grader;
