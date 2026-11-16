import test from 'node:test';
import assert from 'node:assert/strict';
import { parseQuestionMarkdown, parseInline, previewFigureDocument, svgDataUrl } from '../question-markdown.mjs';

test('設問の説明のコードブロックは、``` を文字のまま出さずコードとして分ける', () => {
  const blocks = parseQuestionMarkdown('次のコードです。\n\n```js label="script.js"\nconsole.log(1);\n```\n\n- 箇条書き1\n- 箇条書き2');
  assert.deepEqual(blocks.map(block => block.type), ['paragraph', 'code', 'list']);
  assert.equal(blocks[1].lang, 'js');
  assert.equal(blocks[1].label, 'script.js');
  assert.equal(blocks[1].source, 'console.log(1);');
  assert.deepEqual(blocks[2].items, ['箇条書き1', '箇条書き2']);
  assert.ok(!JSON.stringify(blocks).includes('```'));
});

test('表示例（preview）と図（svg）を分け、表示例はスクリプトを動かさない', () => {
  const [preview, figure] = parseQuestionMarkdown('```preview height=90 label="見本"\n<p>見本</p>\n```\n```svg\n<svg viewBox="0 0 1 1"></svg>\n```');
  assert.equal(preview.type, 'preview');
  assert.equal(preview.height, 90);
  assert.equal(preview.label, '見本');
  assert.match(previewFigureDocument(preview.source), /default-src 'none'/);
  assert.doesNotMatch(previewFigureDocument(preview.source), /script-src/);
  assert.equal(figure.type, 'figure');
  assert.match(decodeURIComponent(svgDataUrl(figure.source)), /xmlns="http:\/\/www.w3.org\/2000\/svg"/);
});

test('インラインの `コード` と **強調** を分ける', () => {
  assert.deepEqual(parseInline('`.menu` を **横** に'), [
    { type: 'code', text: '.menu' }, { type: 'text', text: ' を ' }, { type: 'strong', text: '横' }, { type: 'text', text: ' に' }
  ]);
});
