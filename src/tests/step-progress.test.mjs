import test from 'node:test';
import assert from 'node:assert/strict';
import { withInitialAnswers, recordGrade, changeAnswer, itemResults } from '../step-progress.mjs';
import { validateSubmission } from '../submission.mjs';
const quiz = { id: 'quiz', items: [{ id: 'first', type: 'multiple_choice', required: true, options: ['10', '20'] }, { id: 'second', type: 'code', required: true }] };
const first = { itemId: 'first', passed: true, feedback: '' };
const second = { itemId: 'second', passed: false, feedback: '再確認してください。' };

test('現在のコード問題にだけひな形を入れ、編集済み・消去済みの回答を保つ', () => {
  const lesson = { items: [
    { id: 'code', type: 'code', grading: { starter: 'let value = 1;', config: {} } },
    { id: 'choice', type: 'multiple_choice', options: ['A', 'B'], grading: { starter: '表示しない' } }
  ] };
  assert.deepEqual(withInitialAnswers(lesson).answers, { code: 'let value = 1;' });
  assert.deepEqual(withInitialAnswers(lesson, { activeIndex: 1 }).answers, {});
  for (const value of ['let value = 2;', '']) {
    const draft = { answers: { code: value }, itemResults: { code: first } };
    assert.deepEqual(withInitialAnswers(lesson, draft), draft);
  }
  lesson.items[0].grading.starter = 'let value = 3;';
  assert.equal(withInitialAnswers(lesson).answers.code, 'let value = 3;');
});

test('設問を差し替えたら旧採点を再利用せず、回答を残して最初の未回答へ戻す', () => {
  const lesson = { items: [{ id: 'choice', type: 'multiple_choice' }, { id: 'next', type: 'multiple_choice' }] };
  for (const legacy of [
    { itemResults: { old: { itemId: 'old', passed: true } } },
    { result: { items: [{ itemId: 'old', passed: true }] } }
  ]) {
    const draft = withInitialAnswers(lesson, { ...legacy, activeIndex: 1, answers: { old: '元の記述', next: '保存済み' } });
    assert.equal(draft.activeIndex, 0);
    assert.deepEqual(draft.itemResults, {});
    assert.equal(draft.result, null);
    assert.equal(draft.answers.old, '元の記述');
    const graded = recordGrade(lesson, draft, { itemId: 'choice', passed: true });
    assert.equal(withInitialAnswers(lesson, { ...graded, activeIndex: 1 }).activeIndex, 1);
  }
});

test('1問ずつ採点し、全問を解くまで一括保存用の結果を作らない', () => {
  let draft = recordGrade(quiz, { answers: { first: '10' } }, first);
  assert.equal(draft.result, null);
  assert.deepEqual(itemResults(draft), { first });
  draft = recordGrade(quiz, { ...draft, answers: { first: '10', second: 'console.log(10)' } }, second);
  assert.deepEqual(draft.result, { correct: 1, total: 2, items: [first, second] });
  const payload = { quizId: 'quiz', sessionId: 'a'.repeat(16), attemptId: 'b'.repeat(16), answers: draft.answers, grading: draft.result };
  assert.equal(validateSubmission(payload, [quiz]).answers.length, 2);
});

test('確定した回答は変えられず、未確定の回答だけ変えられる', () => {
  const graded = { answers: { first: '10', second: 'old' }, result: { items: [first, second] } };
  const locked = changeAnswer(quiz, graded, quiz.items[1], 'new');
  assert.equal(locked, graded);
  assert.equal(locked.answers.second, 'old');
  const open = { answers: { first: '10' }, itemResults: { first } };
  const edited = changeAnswer(quiz, open, quiz.items[1], 'new');
  assert.deepEqual(edited.answers, { first: '10', second: 'new' });
  assert.deepEqual(itemResults(edited), { first });
  assert.equal(edited.result, null);
  const blocked = changeAnswer(quiz, open, quiz.items[0], '20');
  assert.equal(blocked, open);
  assert.equal(blocked.answers.first, '10');
});

