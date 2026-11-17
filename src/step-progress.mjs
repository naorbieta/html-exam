export function withInitialAnswers(quiz, draft = {}) {
  const ids = new Set(quiz.items.map(item => item.id));
  const savedResults = draft.itemResults || Object.fromEntries((draft.result?.items || []).map(result => [result.itemId, result]));
  if (Object.keys(savedResults).some(id => !ids.has(id))) {
    const results = Object.fromEntries(Object.entries(savedResults).filter(([id]) => ids.has(id)));
    draft = { ...draft, itemResults: results, result: null, savedAt: null, activeIndex: Math.max(0, quiz.items.findIndex(item => !results[item.id]?.passed)) };
  }
  const answers = { ...draft.answers };
  const index = Math.min(draft.activeIndex || 0, quiz.items.length - 1);
  const item = quiz.items[index];
  let completePrograms = draft.completePrograms;
  for (const field of quiz.items.slice(0, index + 1)) {
    if (!field.grading?.config?.completeProgram || completePrograms?.[field.id] || field !== item && answers[field.id] === undefined) continue;
    const prior = [...field.grading.config.previous].reverse().map(id => codeSource(answers[id])).find(Boolean) || '';
    const value = answers[field.id];
    answers[field.id] = value === undefined ? prior : value && !/\b(?:let|const|var)\s+/.test(value) ? [prior, value].filter(Boolean).join('\n') : value;
    completePrograms = { ...completePrograms, [field.id]: true };
  }
  if (item?.type === 'code' && answers[item.id] === undefined && item.grading?.starter) {
    const previous = [...(item.grading.config?.previous || [])].reverse().map(id => answers[id])
      .find(value => /^\s*<(?:!doctype\s+html|html\b)/i.test(codeSource(value)));
    const reference = quiz.items.slice(0, index).reverse().filter(field => field.referenceEditable).map(field => draft.references?.[field.id]).find(Boolean);
    answers[item.id] = (item.grading.config?.documentAnswer && (previous || reference)) || item.grading.starter;
  }
  return { ...draft, answers, ...(completePrograms ? { completePrograms } : {}) };
}

export function itemResults(draft) {
  const results = draft.itemResults || Object.fromEntries((draft.result?.items || []).map(result => [result.itemId, result]));
  return Object.fromEntries(Object.entries(results).filter(([, result]) => !result.unscored && !result.reviewRequired));
}

// 試験（コース名が「試験 / …」）は、設問を好きな順に解けるようにします。
export function isExam(quiz) {
  return String(quiz?.course || '').startsWith('試験');
}

// 試験では、回答前に解説を出さず、採点して確定したあと（次へ進む前）に出します。
// 選択問題は feedback（解説）を、ターミナル・コードはそれに加えて、満たせなかった条件の説明も出します。
export function examExplanation(item, graded) {
  if (!graded) return '';
  const parts = [];
  if (!graded.passed && ['terminal', 'code'].includes(item?.type)) {
    for (const check of graded.checks || []) {
      if (!check.passed && check.label) parts.push(check.label);
    }
  }
  const explanation = item?.grading?.feedback || '';
  if (explanation) parts.push(explanation);
  return [...new Set(parts)].join('\n\n');
}

// 現在の設問の次から探し、未回答（未採点）の設問があればその位置を返します。すべて確定していれば -1 です。
export function nextUnansweredIndex(quiz, draft, fromIndex = 0) {
  const results = itemResults(draft);
  const total = quiz.items.length;
  if (!total) return -1;
  for (let step = 1; step <= total; step++) {
    const index = (fromIndex + step) % total;
    if (!results[quiz.items[index].id]) return index;
  }
  return -1;
}

export function changeAnswer(quiz, draft, item, value) {
  if (isExam(quiz) && itemResults(draft)[item.id]) return draft;
  const index = quiz.items.indexOf(item);
  const results = itemResults(draft);
  // 練習: その設問と後続の採点を取り消す（後続は前の回答を引き継ぐことがあるため）。
  // 試験: 確定前なら、変更した設問の採点だけを取り消す。確定後の回答は変えられません。
  const kept = isExam(quiz)
    ? quiz.items.filter(question => question !== item && results[question.id])
    : quiz.items.slice(0, index).filter(question => results[question.id]);
  return {
    ...draft,
    answers: { ...draft.answers, [item.id]: value },
    itemResults: Object.fromEntries(kept.map(question => [question.id, results[question.id]])),
    result: null,
    savedAt: null
  };
}

export function recordGrade(quiz, draft, graded) {
  if (isExam(quiz) && itemResults(draft)[graded.itemId]) return draft;
  const results = { ...itemResults(draft), [graded.itemId]: graded };
  const items = quiz.items.map(item => results[item.id]);
  return {
    ...draft,
    itemResults: results,
    result: items.every(Boolean) ? { correct: items.filter(item => item.passed).length, total: items.filter(item => !item.reviewRequired).length, reviewRequired: items.filter(item => item.reviewRequired).length, items } : null
  };
}
import { codeSource } from './editor-files.mjs';

