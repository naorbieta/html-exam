import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'code',
  cases: [
    {
      prefix: 'var score = 80;',
      check(h) {
        h.assert(h.logText().some(text => text === '合格') && !h.logText().some(text => text === '不合格'), '60点以上のときは「合格」と出力してください。');
      }
    },
    {
      prefix: 'var score = 60;',
      check(h) {
        h.assert(h.logText().some(text => text === '合格') && !h.logText().some(text => text === '不合格'), 'ちょうど60点も合格です。');
      }
    },
    {
      prefix: 'var score = 59;',
      check(h) {
        h.assert(h.logText().some(text => text === '不合格') && !h.logText().some(text => text === '合格'), '60点未満のときは「不合格」と出力してください。');
      }
    }
  ]
};

export default grader;
