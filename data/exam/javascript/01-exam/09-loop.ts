import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'code',
  requires: ['\\b(?:for|while)\\b'],
  requirementHint: 'for または while を使ってください。',
  cases: [
    {
      prefix: "var fruits = ['りんご', 'みかん', 'ぶどう'];",
      check(h) {
        const text = h.logText().join('\n');
        h.assert(text.includes('りんご') && text.includes('みかん') && text.includes('ぶどう'), '配列の要素をすべて console.log してください。');
      }
    },
    {
      prefix: "var fruits = ['茶', 'コーヒー'];",
      check(h) {
        const text = h.logText().join('\n');
        h.assert(text.includes('茶') && text.includes('コーヒー'), '配列の中身が変わっても、すべて出力されるようにしてください。');
      }
    }
  ]
};

export default grader;
