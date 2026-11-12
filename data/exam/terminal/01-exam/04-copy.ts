import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'terminal',
  initial: {
    "cwd": "~/notes",
    "files": {
      "~/notes/backup/": ""
    }
  },
  check(h) {
    const memo = h.read('~/notes/memo.txt');
    h.assert(memo !== null, '~/notes に memo.txt がありません。');
    h.assert(memo.trim() === 'こんにちは', 'memo.txt の中身を「こんにちは」にしてください（cat memo.txt で確認できます）。');
    h.assert(h.read('~/notes/backup/memo.txt') === memo, 'backup フォルダに memo.txt をコピーしてください。');
  }
};

export default grader;
