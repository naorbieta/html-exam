import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSubmission } from '../submission.mjs';
import { terminalValue } from '../terminal-shell.mjs';

const item = { id: 'exam-terminal-01', type: 'terminal', required: true, options: [] };
const catalog = [{ id: 'exam-terminal', items: [item] }];
const payload = answer => ({
  sessionId: 'session-0123456789abcdef', attemptId: 'attempt-0123456789abcdef', quizId: 'exam-terminal',
  answers: { [item.id]: answer }, grading: { items: [{ itemId: item.id, passed: true, feedback: '正解です。' }] }
});

test('ターミナルの回答（コマンド履歴と最終状態）は送信できる', () => {
  const answer = { commands: ['ls -a', 'rm .cache'], resets: 1, state: { cwd: '~/work', files: { '~/work/index.html': 'x' }, repos: {}, remotes: {} } };
  assert.deepEqual(validateSubmission(payload(answer), catalog).answers[0].value, answer);
});

test('ターミナルの回答が空・壊れている・大きすぎるときは送信できない', () => {
  for (const answer of ['', 'ls', { commands: [] }, { commands: ['   '] }, { commands: 'ls' }, { commands: [1] }, { commands: Array(201).fill('ls') }, { commands: ['x'.repeat(1001)] }, { commands: ['ls'], state: { big: 'x'.repeat(20000) } }]) {
    assert.throws(() => validateSubmission(payload(answer), catalog), undefined, JSON.stringify(answer).slice(0, 50));
  }
});

test('記録用の最終状態は大きすぎると要約して、送信できる大きさに収める', () => {
  const files = Object.fromEntries(Array.from({ length: 200 }, (_, i) => [`~/f${i}.txt`, 'x'.repeat(200)]));
  const value = terminalValue(['ls'], 0, { cwd: '~', files, repos: {}, remotes: {} });
  assert.ok(JSON.stringify(value).length <= 19000);
  assert.equal(value.state.truncated, true);
  assert.doesNotThrow(() => validateSubmission(payload(value), catalog));
});
