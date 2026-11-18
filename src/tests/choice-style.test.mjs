import test from 'node:test';
import assert from 'node:assert/strict';
import { readAuthoringData } from '../scripts/data.mjs';
import { catalogFromTables } from '../catalog.mjs';
import { looksLikeCode, choicesUseCodeStyle } from '../choice-style.mjs';

const catalog = catalogFromTables(await readAuthoringData());
const hasJapanese = text => /[\u3040-\u30ff\u4e00-\u9fff]/.test(text);

test('同じ設問の選択肢は、コード表記か通常表記かにそろえる', () => {
  for (const quiz of catalog) {
    for (const item of quiz.items) {
      if (!['multiple_choice', 'checkboxes'].includes(item.type)) continue;
      const flags = item.options.map(looksLikeCode);
      const useCode = choicesUseCodeStyle(item.options);
      assert.equal(useCode, flags.every(Boolean), `${item.id}: 画面の書式と判定が食い違う`);
      if (!item.options.some(hasJapanese)) {
        assert.ok(useCode, `${item.id}: コードや値の選択肢なのに通常表記になるものがある（${item.options.join(' / ')}）`);
      }
    }
  }
});

test('コードや値の例はコード表記になり、日本語の文は通常表記になる', () => {
  assert.equal(choicesUseCodeStyle(['repeat(3, 1fr)', '200px 200px 200px', '100%', 'repeat(auto-fit, minmax(200px, 1fr))']), true);
  assert.equal(choicesUseCodeStyle(['4.5 : 1', '3 : 1', '21 : 1', '1.5 : 1']), true);
  assert.equal(choicesUseCodeStyle(['div', 'p', 'h1', 'span']), true);
  assert.equal(choicesUseCodeStyle(['#000000', '#666666', '#eeeeee']), true);
  assert.equal(choicesUseCodeStyle(['images/logo.png', '/images/logo.png', '../images/logo.png']), true);
  assert.equal(choicesUseCodeStyle(['$_POST[\'username\']', '$username']), true);
  assert.equal(choicesUseCodeStyle(['りんご', 'みかん', 'ぶどう', 'undefined']), false);
  assert.equal(choicesUseCodeStyle(['82', '10', '8 + 2', 'エラーになる']), false);
  assert.equal(choicesUseCodeStyle(['写真と説明を近づけてグループにする', '動きが目立つアニメーションを足す']), false);
});
