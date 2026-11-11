import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHTML } from 'linkedom';

const { outputFiles } = await build({ entryPoints: [fileURLToPath(new URL('../../src/answer-workspace.jsx', import.meta.url))], bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic', loader: { '.module.css': 'empty', '.css': 'empty' } });
const module = { exports: {} };
const randomMath = Object.create(Math);
vm.runInNewContext(outputFiles[0].text, { module, exports: module.exports, require: createRequire(import.meta.url), console, Math: randomMath });
const { AnswerWorkspace, CodeWorkspace } = module.exports;
const fields = [
  { id: 'sum', type: 'short_text', title: '計算結果は？', description: '', required: true },
  { id: 'reason', type: 'paragraph', title: '理由は？', description: '', required: true },
  { id: 'kind', type: 'multiple_choice', title: 'データ型は？', description: '', required: true, options: ['数値', '文字列'] }
].map(field => ({ ...field, grading: {} }));
function render(items, answers = {}, saving = false, index = 0) {
  const markup = renderToStaticMarkup(React.createElement(AnswerWorkspace, { quiz: { id: 'fixture', number: 1, items }, item: items[index], answers, theme: 'light', saving, onChange() {}, onSubmit() {} }));
  return parseHTML(`<html><body>${markup}</body></html>`).document;
}

test('現在の1問だけを、設問形式に合う回答欄で表示する', () => {
  const answers = { sum: '10', reason: '計算の説明', kind: '数値' };
  const first = render(fields, answers);
  assert.equal(first.querySelector('input[name="sum"]').value, '10');
  assert.equal(first.querySelector('textarea'), null);
  assert.equal(first.querySelector('input[name="kind"]'), null);
  assert.equal(first.querySelector('[data-panel-group]'), null);
  const second = render(fields, answers, false, 1);
  assert.equal(second.querySelector('textarea[name="reason"]').textContent, '計算の説明');
  assert.equal(second.querySelector('input'), null);
  const third = render(fields, answers, false, 2);
  assert.equal(third.querySelectorAll('input').length, 2);
  assert.equal(third.querySelector('input[checked]').value, '数値');
  assert.equal(third.querySelector('form').id, 'answer-form');
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
  const doc = render([fields[0], code], { sum: '10', program: 'return 10;' }, false, 1);
  assert.equal(doc.querySelector('input[name="sum"]'), null);
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

test('予測用の参照コードにはプレビューを出さず、編集する調査では切り替えられる', () => {
  const source = '<html><head><style>p{font-size:16px}</style><style>p{color:initial}</style></head><body><p>参照</p></body></html>';
  const markup = renderToStaticMarkup(React.createElement(CodeWorkspace, { reference: true, item: { id: 'reference', grading: {} }, value: source, answers: {}, theme: 'light', onChange() {} }));
  const doc = parseHTML(markup).document;
  assert.equal(doc.querySelector('[aria-pressed="true"]')?.textContent, 'style-2.css');
  assert.equal(doc.querySelector('[role=tab]'), null);
  assert.equal(doc.querySelector('iframe'), null);
  assert.equal(doc.querySelector('[data-panel-group-direction=vertical]'), null);
  const editable = parseHTML(renderToStaticMarkup(React.createElement(CodeWorkspace, { reference: true, item: { id: 'observe', referenceEditable: true, grading: { starter: source } }, value: source, answers: {}, theme: 'light', onChange() {} }))).document;
  assert.equal(editable.querySelector('[aria-pressed="true"]')?.textContent, 'index.html');
  assert.ok([...editable.querySelectorAll('button')].some(button => button.textContent === '元に戻す'));
  assert.equal(editable.querySelector('[role=tab][aria-selected=true]').textContent,'コード');
  assert.ok([...editable.querySelectorAll('[role=tab]')].some(tab=>tab.textContent==='プレビュー'));
});

test('採点中はフォームへの入力を無効にする', () => {
  const doc = render(fields, {}, true);
  assert.ok(doc.querySelector('fieldset').hasAttribute('disabled'));
});

test('ファイルを選ぶ問題ではコードエディタを表示せず、選択用の入力欄を表示する', () => {
  const field={id:'file',type:'file',title:'JavaScriptファイル',grading:{kind:'file',config:{extension:'.js'}}};
  const doc=render([field],{file:{name:'empty.js',content:''}});
  assert.equal(doc.querySelector('input[type=file]').getAttribute('accept'),'.js');
  assert.equal(doc.querySelector('[data-panel-group]'),null);
  assert.match(doc.body.textContent,/empty\.js/);
});

test('CSSはエディタ、検証ツールの実習はスクリプトを実行しない実習ページで回答する', () => {
 const css={id:'layout',type:'code',language:'css',title:'中央に配置',grading:{}};
 assert.match(render([css]).body.textContent,/answer\.css/);
 const exercise={id:'post',type:'dom_task',title:'本文を変更',grading:{kind:'dom',config:{exerciseHtml:'<p id="post-text">投稿</p>'}}};
 const doc=render([exercise]);
 assert.equal(doc.querySelector('iframe').getAttribute('sandbox'),'allow-same-origin');
 assert.match(doc.querySelector('iframe').getAttribute('srcDoc'),/default-src 'none'/);
 assert.equal(doc.querySelector('input[type=file]'),null);assert.equal(doc.querySelector('textarea'),null);
 const inspect={...exercise,id:'hover',type:'inspection'};
 assert.equal(render([inspect]).querySelector('textarea').getAttribute('aria-label'),'調べたCSS');
});
