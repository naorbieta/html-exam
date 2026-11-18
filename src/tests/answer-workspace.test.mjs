import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHTML } from 'linkedom';

const { outputFiles } = await build({ entryPoints: [fileURLToPath(new URL('../answer-workspace.jsx', import.meta.url))], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic', loader: { '.module.css': 'empty', '.css': 'empty' } });
const module = { exports: {} };
const randomMath = Object.create(Math);
vm.runInNewContext(outputFiles[0].text, { module, exports: module.exports, require: createRequire(import.meta.url), console, Math: randomMath });
const { AnswerWorkspace, CodeWorkspace } = module.exports;
const choice = { id: 'kind', type: 'multiple_choice', title: 'データ型は？', description: '', required: true, options: ['数値', '文字列'], grading: {} };
const fields = [choice];
function render(items, answers = {}, saving = false, index = 0, locked = false) {
  const markup = renderToStaticMarkup(React.createElement(AnswerWorkspace, { quiz: { id: 'fixture', number: 1, items }, item: items[index], answers, theme: 'light', saving, locked, onChange() {}, onSubmit() {} }));
  return parseHTML(`<html><body>${markup}</body></html>`).document;
}

test('現在の1問だけを、設問形式に合う回答欄で表示する', () => {
  const answers = { kind: '数値' };
  const first = render(fields, answers);
  assert.equal(first.querySelectorAll('input').length, 2);
  assert.equal(first.querySelector('input[checked]').value, '数値');
  assert.equal(first.querySelector('textarea'), null);
  assert.equal(first.querySelector('[data-panel-group]'), null);
  assert.equal(first.querySelector('form').id, 'answer-form');
});

test('単一選択も複数選択も表示順をランダムにし、選択値と元の選択肢を保持する', () => {
  const options = Object.freeze(['A', 'B', 'C', 'D']);
  try {
    for (const type of ['multiple_choice', 'checkboxes']) {
      const field = { id: 'choice', type, title: '選択', options, grading: {} };
      const answer = type === 'multiple_choice' ? 'A' : ['A', 'C'];
      randomMath.random = () => 0;
      const first = render([field], { choice: answer });
      const order = [...first.querySelectorAll('input')].map(input => input.value);
      assert.deepEqual(order, ['B', 'C', 'D', 'A']);
      assert.deepEqual([...first.querySelectorAll('input[checked]')].map(input => input.value).sort(), type === 'multiple_choice' ? ['A'] : ['A', 'C']);
      randomMath.random = () => 0.999;
      const reopened = render([field], { choice: answer });
      assert.deepEqual([...reopened.querySelectorAll('input')].map(input => input.value), ['A', 'B', 'C', 'D']);
      assert.deepEqual([...options], ['A', 'B', 'C', 'D']);
    }
  } finally { delete randomMath.random; }
});

test('コード問題への切り替えで記述回答欄を残さない', () => {
  const code = { id: 'program', type: 'code', title: '計算する関数', grading: {} };
  const doc = render([choice, code], { kind: '数値', program: 'return 10;' }, false, 1);
  assert.equal(doc.querySelector('input[name="kind"]'), null);
  assert.match(doc.body.textContent, /answer\.js/);
  assert.doesNotMatch(doc.body.textContent, /\.txt/);
  assert.ok([...doc.querySelectorAll('button')].every(button => button.getAttribute('type') === 'button'));
  assert.equal(doc.querySelector('iframe[title="コードのプレビュー"]').getAttribute('sandbox'), 'allow-scripts');
  assert.match(doc.body.textContent, /プレビュー/);
});

test('HTML内のスタイルを別のCSSファイルとして表示する', () => {
  const field = { id: 'layout', type: 'code', language: 'html', grading: { kind: 'render' } };
  const doc = render([field], { layout: '<html><head><style>p{color:red}</style></head><body><p>本文</p></body></html>' });
  assert.match(doc.body.textContent, /index\.html/);
  assert.match(doc.body.textContent, /style\.css/);
  assert.equal(doc.querySelector('[aria-pressed="true"]')?.textContent, 'style.css');
});

test('DOM操作を書く問題ではJavaScriptファイルから開き、HTMLとCSSも残す', () => {
 const field={id:'dom',type:'code',language:'html',grading:{kind:'code',config:{documentAnswer:true}}};
 const doc=render([field],{dom:'<html><style>p{color:red}</style><p>本文</p><script>console.log(1);</script></html>'});
 assert.equal(doc.querySelector('[aria-pressed="true"]')?.textContent,'script.js');
 assert.match(doc.body.textContent,/index\.html/);
 assert.match(doc.body.textContent,/style\.css/);
});


test('採点中はフォームへの入力を無効にする', () => {
  const doc = render(fields, {}, true);
  assert.ok(doc.querySelector('fieldset').hasAttribute('disabled'));
});

test('確定した設問は入力を無効にし、コードはプレビュー付きの閲覧だけにする', () => {
  const lockedChoice = render(fields, { kind: '数値' }, false, 0, true);
  assert.ok(lockedChoice.querySelector('fieldset').hasAttribute('disabled'));
  assert.equal(lockedChoice.querySelector('input[checked]').value, '数値');
  const code = { id: 'program', type: 'code', title: '計算する関数', grading: {} };
  const lockedCode = render([code], { program: 'return 10;' }, false, 0, true);
  assert.match(lockedCode.body.textContent, /プレビュー/);
  assert.equal(lockedCode.querySelector('iframe[title="コードのプレビュー"]').getAttribute('sandbox'), 'allow-scripts');
  assert.ok([...lockedCode.querySelectorAll('button')].every(button => button.textContent !== 'ひな形を入力'));
});



test('CSSのコード問題はCSSファイルとして表示する', () => {
  const css = { id: 'layout', type: 'code', language: 'css', title: '中央に配置', grading: {} };
  assert.match(render([css]).body.textContent, /answer\.css/);
});
