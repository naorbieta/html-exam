import test from 'node:test';
import assert from 'node:assert/strict';
import { splitEditorFiles, codeSource, isFileAnswer } from '../editor-files.mjs';
import { gradeAnswer } from '../grader.mjs';
import { withInitialAnswers } from '../step-progress.mjs';

const source = '<html><head><style>p{color:red}</style><style media="print">p{font-size:12px}</style></head><body><p>本文</p></body></html>';

test('CSSを含まないHTMLもHTMLファイルとして開き、スクリプトを保持する', () => {
  const html = '<!doctype html><html><body><p>本文</p><script>console.log(1);</script></body></html>';
  const answer = splitEditorFiles(html);
  assert.equal(answer.files['script.js'], 'console.log(1);');
  assert.match(answer.files['index.html'], /<script src="script.js"><\/script>/);
  assert.match(codeSource(answer), /<script>\s*console.log\(1\);\s*<\/script>/);
  answer.files['script.js']='console.log(2);';
  assert.match(codeSource(splitEditorFiles(JSON.parse(JSON.stringify(answer)))), /console.log\(2\)/);
});

test('HTMLとCSSを別ファイルとして編集し、両方の変更を採点用HTMLに反映する', () => {
  const answer = splitEditorFiles(source);
  assert.deepEqual(Object.keys(answer.files), ['index.html', 'style.css', 'style-2.css']);
  assert.match(answer.files['index.html'], /href="style.css"/);
  assert.doesNotMatch(answer.files['index.html'], /<style/);
  assert.equal(answer.files['style.css'], 'p{color:red}');
  answer.files['style.css'] = 'p{color:blue}';
  answer.files['index.html'] = answer.files['index.html'].replace('本文', '変更した本文');
  const restored = splitEditorFiles(JSON.parse(JSON.stringify(answer)));
  const html = codeSource(restored);
  assert.match(html, /p\{color:blue\}/);
  assert.match(html, /変更した本文/);
  assert.match(html, /<style media="print">/);
  assert.doesNotMatch(html, /color:red/);
  delete restored.files['style-2.css'];
  assert.match(codeSource(restored), /href="style-2.css"/);
});

test('CSSへのリンクを消してもファイルの内容は保存され、適用だけが外れる', () => {
  const answer = splitEditorFiles(source);
  answer.files['index.html'] = answer.files['index.html'].replace('<link rel="stylesheet" href="style.css">', '');
  assert.equal(splitEditorFiles(JSON.parse(JSON.stringify(answer))).files['style.css'], 'p{color:red}');
  assert.doesNotMatch(codeSource(answer), /color:red/);
});

test('保存済みHTMLのスクリプトも分け、外部スクリプトとJSONデータは書き換えない', () => {
 const html='<html><script type="application/json">{"n":1}</script><script src="https://example.com/a.js"></script><script type="module">console.log(1);</script></html>';
 const saved={entry:'index.html',files:{'index.html':html,'script.js':'保持するコード'}};
 const answer=splitEditorFiles(saved);
 assert.equal(answer.files['script.js'],'保持するコード');
 assert.equal(answer.files['script-2.js'],'console.log(1);');
 assert.match(codeSource(answer),/<script type="module">\s*console.log\(1\)/);
 assert.match(codeSource(answer),/<script type="application\/json">\{"n":1\}/);
 assert.match(codeSource(answer),/src="https:\/\/example.com\/a.js"/);
 assert.deepEqual(saved.files,{'index.html':html,'script.js':'保持するコード'});
});

test('従来のコード回答を読み込み、ファイル回答でもJavaScriptを採点して次問へ引き継ぐ', () => {
  assert.equal(splitEditorFiles('console.log(1);'), null);
  assert.equal(codeSource('console.log(1);'), 'console.log(1);');
  const answer = splitEditorFiles('<html><head><style>p{color:red}</style></head><body><p id="text">元</p><script>document.getElementById("text").textContent="変更";</script></body></html>');
  const field = { id: 'first', type: 'code', grading: { kind: 'code', config: { documentAnswer: true, check: 'h.assert(h.text("#text")==="変更")' } } };
  assert.equal(gradeAnswer(field, answer).passed, true);
  answer.files['script.js'] = answer.files['script.js'].replace('textContent="変更"', 'textContent="違う文"');
  assert.equal(gradeAnswer(field, answer).passed, false);
  const next = { id: 'next', type: 'code', grading: { starter: source, config: { documentAnswer: true, previous: ['first'] } } };
  assert.deepEqual(withInitialAnswers({ items: [field, next] }, { activeIndex: 1, answers: { first: answer } }).answers.next, answer);
  assert.equal(isFileAnswer({ entry: 'index.html', files: { 'index.html': '', '../escape.css': '' } }), false);
  assert.equal(isFileAnswer({ entry: 'index.html', files: { 'index.html': '', 'style.css': 1 } }), false);
});
