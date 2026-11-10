import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  context: [
    {
      name: "friendName",
      code: "let friendName='太郎';"
    }
  ],
  requires: ["`", "\\$\\{"],
  check(h) {
    h.assert(h.logText().length === 1 && h.logText()[0].replaceAll('！','!').replaceAll('？','?') === "こんにちは、太郎!\n今日は何をしましょうか?\n公園で遊ぶのはどうですか?", 'コンソールの出力を確認してください。');
  }
};

export default grader;
