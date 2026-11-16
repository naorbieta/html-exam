import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'code',
  requires: ['`[^`]*\\$\\{[^`]*`'],
  requirementHint: 'テンプレートリテラルを使ってください。',
  check(h) {
    h.assert(typeof greet === 'function', '関数 greet が見つかりません。');
    for (const name of ['太郎', '花子', 'Alex']) {
      h.assert(greet(name) === `こんにちは、${name}さん`, `greet('${name}') の戻り値が「こんにちは、${name}さん」になっていません。`);
    }
  }
};

export default grader;
