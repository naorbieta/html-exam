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

export function changeAnswer(quiz, draft, item, value) {
  const index = quiz.items.indexOf(item);
  const results = itemResults(draft);
  return {
    ...draft,
    answers: { ...draft.answers, [item.id]: value },
    itemResults: Object.fromEntries(quiz.items.slice(0, index).filter(question => results[question.id]).map(question => [question.id, results[question.id]])),
    result: null,
    savedAt: null
  };
}

export function recordGrade(quiz, draft, graded) {
  const results = { ...itemResults(draft), [graded.itemId]: graded };
  const items = quiz.items.map(item => results[item.id]);
  return {
    ...draft,
    itemResults: results,
    result: items.every(Boolean) ? { correct: items.filter(item => item.passed).length, total: items.filter(item => !item.reviewRequired).length, reviewRequired: items.filter(item => item.reviewRequired).length, items } : null
  };
}
import { codeSource } from './editor-files.mjs';

