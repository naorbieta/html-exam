import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { splitEditorFiles } from '../src/editor-files.mjs';
import { previewSource, previewDocument } from '../src/preview.mjs';

test('編集したHTMLとCSSをプレビューに使い、採点用の条件や解答例を混ぜない', () => {
  const item = { language: 'html', grading: { kind: 'render', config: { documentAnswer: true, check: 'SECRET_CHECK' }, example: 'SECRET_ANSWER' } };
  const answer = splitEditorFiles('<html><head><style>p{color:red}</style></head><body><p>本文</p></body></html>');
  answer.files['style.css'] = 'p{color:blue}';
  answer.files['index.html'] = answer.files['index.html'].replace('本文', '編集中');
  const source = previewSource(item, answer);
  assert.match(source, /color:blue/); assert.match(source, /編集中/);
  assert.doesNotMatch(source, /color:red|SECRET_CHECK|SECRET_ANSWER/);
  assert.match(previewSource({ language: 'css', grading: { kind: 'render', config: { html: '<p>テキスト</p>', target: 'p' } } }, 'color:green'), /<style>p\{color:green\}<\/style>/);
});

test('JavaScriptの既存の変数とHTMLを使い、明示的な実行まで学生のスクリプトを許可しない', () => {
  const item = { language: 'js', grading: { config: { html: '<p id="text">元</p>', context: [{ name: 'n', code: 'let n=5;' }], check: 'SECRET_CHECK' } } };
  const source = previewSource(item, 'console.log(n);');
  assert.match(source, /let n=5;/); assert.match(source, /console.log\(n\)/); assert.match(source, /id="text"/);
  assert.doesNotMatch(source, /SECRET_CHECK/);
  assert.doesNotMatch(previewSource(item, 'const n=7;console.log(n);'), /let n=5/);
  const automatic = parseHTML(previewDocument(source, { token: 'test-nonce' })).document;
  assert.match(automatic.querySelector('meta[http-equiv]').content, /script-src 'nonce-test-nonce'/);
  assert.doesNotMatch(automatic.querySelector('meta[http-equiv]').content, /script-src 'unsafe-inline'/);
  const explicit = parseHTML(previewDocument(source, { execute: true, token: 'test-nonce' })).document;
  assert.match(explicit.querySelector('meta[http-equiv]').content, /script-src 'unsafe-inline'/);
  assert.match(explicit.querySelector('meta[http-equiv]').content, /default-src 'none'/);
});

test('HTMLの問題でもJSだけの回答は教材HTML内で実行し、コードを文字として表示しない', () => {
 const item={language:'html',grading:{kind:'code',config:{documentAnswer:true,html:'<p id="text">元</p>'}}};
 const source=previewSource(item,'document.getElementById("text").textContent="変更";');
 assert.match(source,/<p id="text">元<\/p>/);
 assert.match(source,/<script>document.getElementById/);
});
