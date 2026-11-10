import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  requires: ["\\bcontinue\\b"],
  cases: [
    {
      randoms: [0.6833333333333332],
      check(h) {
        h.assert(h.logs.length===3&&/^1/.test(h.logText()[0])&&/^3/.test(h.logText()[1])&&/^5/.test(h.logText()[2]),'5が出たら1回分のチャンスを失わせてください。');
      }
    },
    {
      randoms: [0.6833333333333332, 0.85],
      check(h) {
        h.assert(h.logs.length===2&&/^3/.test(h.logText()[1])&&h.alerts.some(t=>/当た|当たり/.test(t)),'5の次に6が出ると3回目で当たりです。');
      }
    },
    {
      randoms: [0],
      check(h) {
        h.assert(h.logs.length===5,'5以外の外れはチャンスを減らしません。');
      }
    }
  ]
};

export default grader;
