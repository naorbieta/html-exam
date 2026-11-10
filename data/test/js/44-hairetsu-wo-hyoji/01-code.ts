import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  context: [
    {
      name: "fruits",
      code: "let fruits=[\"りんご\",\"バナナ\",\"オレンジ\"];"
    }
  ],
  check(h) {
    h.assert(JSON.stringify(h.logs.flat(2))===JSON.stringify(['りんご','バナナ','オレンジ']),'配列の全要素を順番に表示してください。');
  }
};

export default grader;
