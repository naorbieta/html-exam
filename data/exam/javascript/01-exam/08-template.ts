import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'code',
  requires: ['`', '\\$\\{'],
  requirementHint: 'テンプレートリテラル（バッククォートと ${}）を使ってください。',
  cases: [
    {
      prefix: 'var name = "太郎";',
      check(h) {
        h.assert(h.logText().includes('こんにちは、太郎さん'), '「こんにちは、太郎さん」と出力してください。');
      }
    },
    {
      prefix: 'var name = "花子";',
      check(h) {
        h.assert(h.logText().includes('こんにちは、花子さん'), 'name の値を埋め込んでください。固定の文字列だけだと、値が変わったときに合いません。');
      }
    }
  ]
};

export default grader;
