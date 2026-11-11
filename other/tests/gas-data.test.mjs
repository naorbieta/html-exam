import test from 'node:test';
import assert from 'node:assert/strict';
import { jsonHtmlDocument, parseJsonHtml, packImageFiles, assembleImages } from '../../src/gas-data.mjs';

test('埋め込みHTMLからJSONを復元する', () => {
  const html = jsonHtmlDocument('Catalog', { hello: 'a<b', items: [1] });
  assert.match(html, /application\/json/);
  assert.doesNotMatch(html, /a<b/);
  assert.deepEqual(parseJsonHtml(html), { hello: 'a<b', items: [1] });
  assert.throws(() => parseJsonHtml('no script'), /形式/);
});

test('画像をファイルサイズ上限で分割し、結合すると元に戻る', () => {
  const imageData = {
    'images/small.png': 'data:image/png;base64,AAAA',
    'images/large.gif': 'data:image/gif;base64,' + 'B'.repeat(8000)
  };
  const packed = packImageFiles(imageData, 3000);
  assert.ok(packed.files.length >= 2, '大きい画像は複数ファイルに分ける');
  assert.ok(packed.index['images/large.gif'].length >= 2);
  assert.deepEqual(packed.index['images/small.png'].length, 1);
  for (const file of packed.files) {
    assert.ok(file.html.length <= 3000, `${file.name} ${file.html.length}`);
    parseJsonHtml(file.html);
  }
  const assembled = assembleImages(packed.files.map(file => parseJsonHtml(file.html)));
  assert.equal(assembled['images/small.png'], imageData['images/small.png']);
  assert.equal(assembled['images/large.gif'], imageData['images/large.gif']);
  const onlySmall = assembleImages(packed.files.map(file => parseJsonHtml(file.html)), ['images/small.png']);
  assert.deepEqual(Object.keys(onlySmall), ['images/small.png']);
});
