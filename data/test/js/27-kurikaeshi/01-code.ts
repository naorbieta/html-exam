import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  requires: ["\\bfor\\s*\\("],
  check(h) {
    h.assert(h.logs.length===20,'20回表示してください。'); h.logText().forEach((s,i)=>h.assert(s.replace(/\s/g,'').normalize('NFKC')===`${i+1}回目!こんにちは!`,'1回目から20回目まで順に表示してください。'));
  }
};

export default grader;
