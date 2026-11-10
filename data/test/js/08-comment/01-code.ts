import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  cases: [
    {
      prompts: ["70", "1.7"],
      check(h) {
        h.assert(h.promptCount===2 && h.alerts.some(t=>/24\.22/.test(t)),'体重と身長からBMIを計算してください。'); const comments=(h.source.match(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g)||[]).join('\n'); h.assert(/体重|weight/i.test(comments)&&/身長|height/i.test(comments)&&/BMI|計算/i.test(comments),'体重・身長・BMIの処理をコメントで説明してください。');
      }
    }
  ]
};

export default grader;
