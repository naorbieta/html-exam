import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  requires: ["function\\s+greet\\s*\\([^)]*="],
  check(h) {
    h.assert(typeof greet==='function'); greet(); greet('太郎'); greet('花子'); h.assert(h.alerts.slice(-3).every((s,i)=>s.includes(['名無し','太郎','花子'][i])),'省略時は名無し、指定時はその名前にあいさつしてください。');
  }
};

export default grader;
