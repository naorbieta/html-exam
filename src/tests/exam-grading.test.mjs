import test from 'node:test';
import assert from 'node:assert/strict';
import { readAuthoringData } from '../scripts/data.mjs';
import { catalogFromTables } from '../catalog.mjs';
import { gradeAnswer } from '../grader.mjs';

const catalog = catalogFromTables(await readAuthoringData());
const exam = catalog.filter(quiz => quiz.id.startsWith('exam-'));
const items = exam.flatMap(quiz => quiz.items);
const gradable = items.filter(item => item.grading.kind !== 'render');

function exampleOf(item) {
  return item.grading.example;
}

test('試験カタログは6カテゴリ・37問で練習データと分かれている', () => {
  assert.deepEqual(exam.map(quiz => quiz.id), ['exam-html', 'exam-js', 'exam-php', 'exam-git', 'exam-terminal', 'exam-design']);
  assert.equal(items.length, 37);
  assert.ok(catalog.some(quiz => quiz.id === 'quiz-01'), '練習用データは残す');
  assert.ok(catalog.some(quiz => quiz.course === 'HTML・CSS・Web基礎'), '練習用データは残す');
});

test('試験の模範解答はすべて正解になる', () => {
  for (const item of gradable) {
    const result = gradeAnswer(item, exampleOf(item));
    assert.equal(result.passed, true, `${item.id}: ${result.feedback}`);
  }
});

test('試験の誤答は不正解になる', () => {
  const wrong = {
    'exam-js-02': "const name = '花子';\nconsole.log(name);",
    'exam-js-03': "console.log('合格');",
    'exam-js-05': 'function maxNumber(a, b) { return a; }',
    'exam-js-08': "console.log('こんにちは、' + name + 'さん');",
    'exam-terminal-04': 'cd docs'
  };
  for (const item of gradable) {
    const answer = wrong[item.id] ?? item.options.find(option => option !== exampleOf(item));
    assert.ok(answer != null && answer !== '', `${item.id} に誤答を用意してください`);
    const result = gradeAnswer(item, answer);
    assert.equal(result.passed, false, `${item.id} が誤答を受理しました: ${JSON.stringify(answer)}`);
  }
});

test('書き方が違っても結果が同じなら試験のコード問題は正解になる', () => {
  const variants = {
    'exam-js-02': 'let user = "太郎";\nconsole.log(user);',
    'exam-js-03': "console.log(score >= 60 ? '合格' : '不合格');",
    'exam-js-05': 'function maxNumber(a, b) { return Math.max(a, b); }',
    'exam-js-08': 'const message = `こんにちは、${name}さん`;\nconsole.log(message);',
    'exam-terminal-04': 'mkdir -p ./docs/'
  };
  for (const [id, answer] of Object.entries(variants)) {
    const item = items.find(entry => entry.id === id);
    const result = gradeAnswer(item, answer);
    assert.equal(result.passed, true, `${id}: ${result.feedback}`);
  }
});
