import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonDescription } from '../lesson-content.mjs';

test('レッスンの導入文をそのまま問題文の冒頭に使う', () => {
  const quiz = { description: 'このセクションでは、基礎を確認します。' };
  assert.equal(lessonDescription(quiz), 'このセクションでは、基礎を確認します。');
  assert.equal(lessonDescription({ description: '  導入文  ' }), '導入文');
  assert.equal(lessonDescription({}), '');
});
