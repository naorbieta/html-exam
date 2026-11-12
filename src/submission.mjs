export function validateSubmission(payload, catalog) {
  if (!payload || !/^[\w-]{16,80}$/.test(payload.sessionId || '') || !/^[\w-]{16,80}$/.test(payload.attemptId || '')) {
    throw new Error('回答の識別情報を確認できません。ページを開き直してください。');
  }
  const quiz = catalog.find(q => q.id === payload.quizId);
  if (!quiz || !payload.answers || typeof payload.answers !== 'object' || Array.isArray(payload.answers)) throw new Error('問題または回答の形式を確認してください。');
  if (Object.keys(payload.answers).some(id => !quiz.items.some(item => item.id === id))) throw new Error('この問題に含まれない解答欄があります。ページを読み直してください。');
  const answers = [];
  for (const item of quiz.items) {
    let value = payload.answers[item.id];
    if (value === undefined || value === null) value = item.type === 'checkboxes' ? [] : '';
    if (item.type === 'file') {
      if (!isUploadedFile(value)) throw new Error('20,000文字以内のファイルを選んでください。');
    } else if (item.type === 'dom_task') {
      if (!value || typeof value !== 'object' || Array.isArray(value) || typeof value.text !== 'string' || value.text.length > 20000 || typeof value.color !== 'string' || value.color.length > 200 || typeof value.visible !== 'boolean') throw new Error('実習ページを読み直して、もう一度採点してください。');
    } else if (item.type === 'code' && typeof value === 'object') {
      if (!isFileAnswer(value) || JSON.stringify(value).length > 20000) throw new Error('コードのファイル形式と20,000文字の上限を確認してください。');
    } else if (item.type === 'terminal') {
      if (value === '') value = { commands: [] };
      if (!isTerminalAnswer(value)) throw new Error('ターミナルの回答を読み取れません。「やり直す」を押して、もう一度入力してください。');
    } else if (item.type === 'checkboxes') {
      if (!Array.isArray(value) || new Set(value).size !== value.length || value.some(option => !item.options.includes(option))) throw new Error('チェックボックスの回答を選び直してください。');
    } else {
      if (typeof value !== 'string' || value.length > 20000) throw new Error('回答は20,000文字以内のテキストにしてください。');
      if (item.type === 'multiple_choice' && value !== '' && !item.options.includes(value)) throw new Error('選択肢の回答を選び直してください。');
    }
    const empty = Array.isArray(value) ? !value.length : item.type === 'file' ? !value.name : item.type === 'dom_task' ? !value?.text.trim() : item.type === 'terminal' ? !value.commands.some(command => command.trim()) : item.type === 'code' ? !codeSource(value).trim() : !value.trim();
    if (item.required && empty) throw new Error('必須の解答欄をすべて入力してください。');
    answers.push({ item, value });
  }
  const results = payload.grading?.items;
  if (!Array.isArray(results) || results.length !== quiz.items.length ||
      new Set(results.map(result => result?.itemId)).size !== quiz.items.length ||
      results.some(result => !quiz.items.some(item => item.id === result?.itemId) || typeof result.passed !== 'boolean' || (result.reviewRequired !== undefined && typeof result.reviewRequired !== 'boolean') || typeof result.feedback !== 'string' || result.feedback.length > 2000)) {
    throw new Error('採点結果を確認できません。もう一度採点してください。');
  }
  return { quiz, answers, results };
}

export function sheetText(value) {
  const text = String(value);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}
import { codeSource, isFileAnswer } from './editor-files.mjs';
import { isUploadedFile } from './uploaded-file.mjs';


function isTerminalAnswer(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && Array.isArray(value.commands) &&
    value.commands.length <= 200 && value.commands.every(command => typeof command === 'string' && command.length <= 1000) &&
    JSON.stringify(value).length <= 20000);
}
