import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonDescription, referenceSource } from '../src/lesson-content.mjs';

test('エディタへ移したHTMLとコード見出しを問題文に重ねて表示しない', () => {
  const code = '<!DOCTYPE html>\n<html><head><style>p{color:red}</style></head><body><p>本文</p></body></html>';
  const quiz = { description: `下記のHTMLを編集してください。\n\nコード\n${code}\n\n色を変更してください。` };
  const item = { type: 'code', grading: { starter: code.replace('</body>', '<script>\n\n</script></body>') } };
  assert.equal(lessonDescription(quiz, item), 'HTMLを編集してください。\n\n色を変更してください。');
  assert.equal(lessonDescription(quiz, { type: 'short_text' }), 'HTMLを編集してください。\n\n色を変更してください。');
  assert.equal(lessonDescription(quiz, { type: 'code', grading: {} }), quiz.description);
});

test('記述・選択問題でも参照HTMLをエディタへ移し、設問ごとのCSSを適用する', () => {
  const source = '<!doctype html><html><head></head><body><p>参照</p></body></html>';
  const quiz = { description: `文字の色を答えてください。\n\n${source}` };
  const item = { type: 'short_text', description: '.text { color: initial; }' };
  assert.equal(lessonDescription(quiz, item), '文字の色を答えてください。');
  assert.match(referenceSource(quiz, item), /<style>\n\.text \{ color: initial; \}/);
  assert.equal(referenceSource(quiz, { type: 'checkboxes' }), source);
  assert.equal(referenceSource(quiz, { type: 'code' }), '');
  const perQuestion={type:'multiple_choice',description:`${source}\n上に重なる順で答えてください。`};
  assert.equal(referenceSource({description:'導入文'},perQuestion),source);
});

test('書き換えるJavaScriptだけを移し、説明用の例やエラー内容は残す', () => {
  const starter = "let greet = 'こんにちは';\nalert(great);";
  const quiz = { description: `修正してください。\n\n${starter}\n\nUncaught ReferenceError: great is not defined` };
  const item = { type: 'code', grading: { starter } };
  assert.equal(lessonDescription(quiz, item), '修正してください。\n\nUncaught ReferenceError: great is not defined');
  assert.equal(lessonDescription({ description: 'for文の例です。\nfor (...) { ... }' }, item), 'for文の例です。\nfor (...) { ... }');
  const form = '<form method="post"><input type="number"></form>';
  assert.equal(lessonDescription({ description: `フォームを書き換えてください。\n${form}` }, { type: 'code', grading: { starter: form } }), 'フォームを書き換えてください。');
  assert.equal(lessonDescription({description:`修正してください。\n\n■プログラム\n${starter}\n\n■エラー\nReferenceError`},item),'修正してください。\n\n■エラー\nReferenceError');
});

test('初期コードの字下げや全角空白が違っていても、問題文に重ねて表示しない', () => {
  const code = '<form method="post">\n  <input type="text">\n</form>';
  const quiz = { description: 'フォームを書き換えてください。\n\n<form\u00a0\u00a0method="post">\n\u3000<input type="text">\n\n</form>\n\n送信先は変更しません。' };
  assert.equal(lessonDescription(quiz, { type: 'code', grading: { starter: code } }), 'フォームを書き換えてください。\n\n送信先は変更しません。');
  const fragment = '<style>\np { color: red; }\n</style>\n<p>本文</p>';
  assert.equal(lessonDescription({ description: `色を変更してください。\n\n${fragment}` }, { type: 'code', grading: { starter: `<!doctype html><html><head></head><body>${fragment}</body></html>` } }), '色を変更してください。');
});
