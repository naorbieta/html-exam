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
    h.assert(memo.trim() === 'こんにちは', 'memo.txt の中身が「こんにちは」になっていません。');
    h.assert(h.read('~/notes/backup/memo.txt') === memo, 'backup フォルダの中に、同じ中身の memo.txt がありません。');
  }
};

export default grader;
