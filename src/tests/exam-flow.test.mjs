import test from 'node:test';
import assert from 'node:assert/strict';
import { readAuthoringData } from '../scripts/data.mjs';
import { catalogFromTables } from '../catalog.mjs';
import { changeAnswer, recordGrade, isExam, examFeedback, itemResults } from '../step-progress.mjs';

const catalog = catalogFromTables(await readAuthoringData());
const exams = catalog.filter(quiz => quiz.id.startsWith('exam-'));

test('試験は6カテゴリで、どれも「試験」として好きな順に解ける', () => {
  assert.equal(exams.length, 6);
  assert.ok(exams.every(isExam));
  assert.ok(catalog.filter(quiz => !quiz.id.startsWith('exam-')).every(quiz => !isExam(quiz)));
});

test('試験では、あとの設問を先に解いても、前の設問の回答を変えても採点が消えない', () => {
  const quiz = exams[0];
  const [first, , third] = quiz.items;
  let draft = { answers: {} };
  draft = recordGrade(quiz, { ...draft, answers: { [third.id]: 'x' } }, { itemId: third.id, passed: true });
  draft = changeAnswer(quiz, draft, first, 'y');
  assert.ok(itemResults(draft)[third.id]?.passed, '後ろの設問の採点が残る');
  draft = changeAnswer(quiz, draft, third, 'z');
  assert.equal(itemResults(draft)[third.id], undefined, '変更した設問の採点だけ取り消す');
});

test('試験の不正解表示では、選択問題の解説（答え）を出さず、ターミナルは状態の説明だけを出す', () => {
  const choice = exams.flatMap(quiz => quiz.items).find(item => item.type === 'multiple_choice');
  assert.equal(examFeedback(choice, { passed: false, feedback: choice.grading.feedback }), '');
  const terminal = exams.flatMap(quiz => quiz.items).find(item => item.type === 'terminal');
  assert.equal(examFeedback(terminal, { passed: false, feedback: 'x', checks: [{ label: '隠しファイルがまだ残っています。', passed: false }] }), '隠しファイルがまだ残っています。');
});

const commandWords = /\b(?:ls|cd|mkdir|touch|cat|echo|cp|mv|rm|rmdir|pwd)\b|\bgit\s+\w+|\b(?:clone|pull|push|commit -m|switch|checkout)\b/;
test('ターミナル・Gitの問題文・不正解メッセージに、答えのコマンドを書かない', () => {
  for (const item of exams.flatMap(quiz => quiz.items).filter(item => item.type === 'terminal')) {
    assert.doesNotMatch(item.title, commandWords, `${item.id} の問題文`);
    assert.doesNotMatch(item.description, commandWords, `${item.id} の説明`);
    assert.doesNotMatch(item.grading.feedback, commandWords, `${item.id} のフィードバック`);
    for (const message of item.grading.config.check.matchAll(/h\.assert\([^,]+,\s*'([^']*)'/g)) {
      assert.doesNotMatch(message[1], commandWords, `${item.id} のメッセージ「${message[1]}」`);
    }
  }
});

test('試験の設問の説明に、閉じていないコードブロックが無い', () => {
  for (const item of exams.flatMap(quiz => quiz.items)) {
    assert.equal(((item.description || '').match(/^\s*```/gm) || []).length % 2, 0, item.id);
  }
});
