import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  context: [
    {
      name: "calculateCircleArea",
      code: "function calculateCircleArea(radius){return radius*radius*3.14;}"
    }
  ],
  check(h) {
    h.assert(h.alerts.length===1&&Math.abs(parseFloat(h.alerts[0])-78.5)<0.00001,'半径5の円の面積を表示してください。');
  }
};

export default grader;
