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
  if (item?.type === 'code' && answers[item.id] === undefined && item.grading?.starter) {
    answers[item.id] = item.grading.starter;
  }
  return { ...draft, answers };
}

export function itemResults(draft) {
  return draft.itemResults || Object.fromEntries((draft.result?.items || []).map(result => [result.itemId, result]));
}

// このアプリのコースは試験専用です。コース名は「試験 / …」で始まります。
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
  if (itemResults(draft)[item.id]) return draft;
  const results = itemResults(draft);
  // 確定後の回答は変えられません。未確定なら、変更した設問の採点だけを取り消します。
  const kept = quiz.items.filter(question => question !== item && results[question.id]);
  return {
    ...draft,
    answers: { ...draft.answers, [item.id]: value },
    itemResults: Object.fromEntries(kept.map(question => [question.id, results[question.id]])),
    result: null,
    savedAt: null
  };
}

export function recordGrade(quiz, draft, graded) {
  if (itemResults(draft)[graded.itemId]) return draft;
  const results = { ...itemResults(draft), [graded.itemId]: graded };
  const items = quiz.items.map(item => results[item.id]);
  return {
    ...draft,
    itemResults: results,
    result: items.every(Boolean) ? { correct: items.filter(item => item.passed).length, total: items.length, items } : null
  };
}
