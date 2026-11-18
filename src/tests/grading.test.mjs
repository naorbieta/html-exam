import test from 'node:test';
import assert from 'node:assert/strict';
import { readAuthoringData } from '../scripts/data.mjs';
import { catalogFromTables } from '../catalog.mjs';
import { gradeAnswer } from '../grader.mjs';
const tables = await readAuthoringData();
const catalog = catalogFromTables(tables);
const items = catalog.flatMap(quiz => quiz.items);

test('自動採点対象の解答例がすべて採点条件を満たす', () => {
  let count = 0;
  for (const quiz of catalog) {
    const answers = Object.fromEntries(quiz.items.map(item => [item.id, item.type === 'checkboxes' ? JSON.parse(item.grading.example) : item.grading.example]));
    for (const item of quiz.items) {
      if (item.grading.kind === 'render') continue;
      const result = gradeAnswer(item, answers[item.id], answers);
      assert.equal(result.passed, true, `第${quiz.number}問 ${item.id}: ${result.feedback}`);
      count++;
    }
  }
  assert.ok(count > 0);
  assert.equal(count, items.filter(item => item.grading.kind !== 'render').length);
});

test('初期コードだけでは問題の解答にならない', () => {
  const fields = items.filter(item => item.type === 'code' && item.grading.starter && item.grading.kind !== 'render');
  assert.ok(fields.length > 0);
  for (const field of fields) assert.equal(gradeAnswer(field, field.grading.starter).passed, false, field.id);
});

test('構文エラーを解答欄単位のフィードバックとして返す', () => {
  const field = { id: 'broken', type: 'code', grading: { kind: 'code', config: { check: 'h.assert(true);' }, feedback: 'ちがいます', example: '1' } };
  const result = gradeAnswer(field, 'const = ;');
  assert.equal(result.passed, false);
  assert.match(result.feedback, /エラー/);
});

test('チェックボックスはクリックした順序によらず完全一致で採点する', () => {
  const field = items.find(item => item.type === 'checkboxes');
  const correct = JSON.parse(field.grading.example);
  const extra = field.options.find(option => !correct.includes(option));
  assert.ok(correct.length >= 2 && extra);
  assert.equal(gradeAnswer(field, [...correct].reverse()).passed, true);
  assert.equal(gradeAnswer(field, correct.slice(0, 1)).passed, false);
  assert.equal(gradeAnswer(field, [...correct, extra]).passed, false);
});

test('選択問題は選択肢の中だけで正誤を判定する', () => {
  for (const field of items) {
    if (field.type !== 'multiple_choice') continue;
    const passes = field.options.filter(value => gradeAnswer(field, value).passed);
    assert.equal(passes.length, 1, field.id);
    assert.equal(gradeAnswer(field, '選択肢にない回答').passed, false, field.id);
  }
});
