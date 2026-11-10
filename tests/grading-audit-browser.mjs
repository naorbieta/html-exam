import { gradeAnswer } from '../src/grader.mjs';
import { gradeRenderedAnswer } from '../src/render-grader.mjs';

export async function auditGrading(catalog, variations, report) {
  const records = [];
  for (const quiz of catalog) {
    const answers = Object.fromEntries(quiz.items.map(item => [item.id, ['checkboxes','dom_task','file'].includes(item.type) ? JSON.parse(item.grading.example) : item.grading.example]));
    for (const item of quiz.items) {
      const cases = [['解答例',answers[item.id],true],['空欄','',false]];
      if (item.type === 'multiple_choice') {
        for (const option of item.options) cases.push(['選択肢',option,item.grading.config.accept.includes(option)]);
      } else if (item.type === 'checkboxes') {
        const correct = answers[item.id];
        cases.push(['選択順を逆にする',[...correct].reverse(),true],['正解を1つ外す',correct.slice(1),false]);
        const extra = item.options.find(option=>!correct.includes(option));
        if (extra) cases.push(['余分な選択肢を加える',[...correct,extra],false]);
      } else if (item.type === 'code' || item.type === 'inspection') {
        if (variations[item.id]) cases.push(['同じ意味の別表記',variations[item.id],true]);
        cases.push(['初期コードのまま',item.grading.starter || '',false]);
        if (item.grading.kind === 'code') cases.push(['コメントだけ','/* 未実装 */',false]);
      } else if (item.type === 'file') {
        cases.push(['違う拡張子',{name:'example.txt',content:''},false],['二重拡張子',{name:'example.js.txt',content:''},false],['空のJavaScriptファイル',{name:'example.js',content:''},true]);
      } else if (item.type === 'dom_task') {
        const rule = item.grading.config, prior = answers[rule.previous];
        cases.push(['変更しない',{text:prior?.text || rule.initialText,color:prior?.color || rule.initialColor,visible:true},false]);
      } else {
        cases.push(['前後の空白','\n  '+answers[item.id]+'  \n',true],['無関係な回答','?_誤答_?',false]);
      }
      for (const [label,answer,expected] of cases) {
        let result;
        try { result = item.grading.kind === 'render' ? await gradeRenderedAnswer(item,answer,answers) : gradeAnswer(item,answer,answers); }
        catch (error) { result = {passed:false,feedback:error.message}; }
        const entry = {id:item.id,lesson:quiz.title,label,expected,actual:result.passed,ok:result.passed===expected,feedback:result.feedback,answer};
        records.push(entry); report(entry,records.length);
      }
    }
  }
  return records;
}
