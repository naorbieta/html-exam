import test from 'node:test';
import assert from 'node:assert/strict';
import { readAuthoringData } from '../scripts/data.mjs';
import { catalogFromTables } from '../catalog.mjs';
import { changeAnswer, recordGrade, isExam, examExplanation, itemResults, nextUnansweredIndex } from '../step-progress.mjs';
import { examLabel } from '../exam-label.mjs';

const catalog = catalogFromTables(await readAuthoringData());
const exams = catalog.filter(quiz => quiz.id.startsWith('exam-'));

test('カタログは試験6カテゴリだけで、どれも好きな順に解ける', () => {
  assert.equal(catalog.length, 6);
  assert.equal(exams.length, 6);
  assert.ok(catalog.every(isExam));
  assert.equal(catalog.filter(quiz => !quiz.id.startsWith('exam-')).length, 0);
});

test('試験名は「試験 / 」を付けず、6つを1段で並べる', () => {
  assert.deepEqual(catalog.map(examLabel), ['HTML・CSS', 'JavaScript', 'PHP', 'Git', 'ターミナル操作', 'デザイン理論']);
  assert.ok(catalog.every(quiz => !examLabel(quiz).includes('試験 / ')));
});

test('試験では、あとの設問を先に解いても、前の未確定の設問を変えても採点が消えない', () => {
  const quiz = exams[0];
  const [first, , third] = quiz.items;
  let draft = { answers: {} };
  draft = recordGrade(quiz, { ...draft, answers: { [third.id]: 'x' } }, { itemId: third.id, passed: true });
  draft = changeAnswer(quiz, draft, first, 'y');
  assert.ok(itemResults(draft)[third.id]?.passed, '後ろの設問の採点が残る');
  draft = changeAnswer(quiz, draft, third, 'z');
  assert.equal(itemResults(draft)[third.id]?.passed, true, '確定した設問の採点は残る');
  assert.equal(draft.answers[third.id], 'x', '確定した回答は変わらない');
});

test('試験では、採点するまで解説を出さず、確定したあとに解説を出す', () => {
  const choice = exams.flatMap(quiz => quiz.items).find(item => item.type === 'multiple_choice');
  assert.ok(choice.grading.feedback);
  assert.equal(examExplanation(choice, null), '');
  assert.equal(examExplanation(choice, { passed: false, feedback: choice.grading.feedback }), choice.grading.feedback);
  assert.equal(examExplanation(choice, { passed: true }), choice.grading.feedback);
  const terminal = exams.flatMap(quiz => quiz.items).find(item => item.type === 'terminal');
  const text = examExplanation(terminal, { passed: false, feedback: 'x', checks: [{ label: '隠しファイルがまだ残っています。', passed: false }] });
  assert.match(text, /隠しファイルがまだ残っています。/);
  assert.ok(text.includes(terminal.grading.feedback), '確定後は解説も出す');
  assert.equal(examExplanation(terminal, null), '');
});

test('試験では、確定した設問を再採点せず、次へは未回答の設問へ進む', () => {
  const quiz = { course: '試験 / 確認', items: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] };
  const [first, second, third] = quiz.items;
  let draft = recordGrade(quiz, { answers: { a: '1' } }, { itemId: 'a', passed: false });
  const relocked = recordGrade(quiz, { ...draft, answers: { a: '2' } }, { itemId: 'a', passed: true });
  assert.equal(itemResults(relocked)[first.id].passed, false, '最初の採点が残る');
  assert.equal(nextUnansweredIndex(quiz, draft, 0), 1);
  draft = recordGrade(quiz, { ...draft, answers: { ...draft.answers, c: '3' } }, { itemId: 'c', passed: true });
  assert.equal(nextUnansweredIndex(quiz, draft, 0), 1, '次の未回答へ進む');
  assert.equal(nextUnansweredIndex(quiz, draft, 2), 1, '末尾の次は先頭側の未回答へ戻る');
  draft = recordGrade(quiz, { ...draft, answers: { ...draft.answers, b: '4' } }, { itemId: 'b', passed: true });
  assert.equal(nextUnansweredIndex(quiz, draft, 1), -1, 'すべて確定したら次の未回答はない');
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
