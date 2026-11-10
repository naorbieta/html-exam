import { gradeAnswer } from '../../src/grader.mjs';
import { gradeRenderedAnswer } from '../../src/render-grader.mjs';
import { splitEditorFiles } from '../../src/editor-files.mjs';

export async function checkCssWriting(catalog) {
  const quiz = catalog.find(quiz => quiz.id === 'web-11'), lines = [];
  const documentFor = (style, inline) => `<!doctype html><html><head>${inline ? '' : `<style>p {${style}}</style>`}</head><body><p${inline ? ` style="${style}"` : ''}>この文字は18pxの半透明の赤色で、太文字で表示されています。</p></body></html>`;
  for (const [index, item] of quiz.items.slice(0,2).entries()) {
    const inline = index === 0;
    const cases = [
      ['画像の解答',documentFor('color:rgba(255 0 0 /50%);font-weight:700;font-size:18px;',inline),true],
      ['カンマ区切り',documentFor('font-size:18px;color:rgba(255,0,0,.5);font-weight:bold',inline),true],
      ['小数の透明度',documentFor('font-weight:700;color:rgba(255 0 0 / .5);font-size:18px',inline),true],
      ['色成分のパーセント',documentFor('font-size:18px;color:rgba(100% 0% 0% / 50%);font-weight:700',inline),true],
      ['赤色の別指定',documentFor('font-size:18px;color:rgba(200 20 20 / 50%);font-weight:800',inline),true],
      ['サイズ違い',documentFor('font-size:19px;color:rgba(255 0 0 /50%);font-weight:700',inline),false],
      ['太字なし',documentFor('font-size:18px;color:rgba(255 0 0 /50%);font-weight:400',inline),false],
      ['青色',documentFor('font-size:18px;color:rgba(0 0 255 /50%);font-weight:700',inline),false],
      ['不透明',documentFor('font-size:18px;color:rgba(255 0 0 /100%);font-weight:700',inline),false],
      ['opacityで代用',documentFor('font-size:18px;color:red;opacity:.5;font-weight:700',inline),false],
      ['無効な色',documentFor('font-size:18px;color:rgba(255 0 0, .5);font-weight:700',inline),false],
      ['コメントだけ',documentFor('/* font-size:18px;color:rgba(255,0,0,.5);font-weight:bold */',inline),false],
      ['指定方法違い',documentFor('font-size:18px;color:rgba(255 0 0 /50%);font-weight:700',!inline),false]
    ];
    if (!inline) cases.push(['CSS別ファイル',splitEditorFiles(documentFor('font-size:18px;color:rgba(255 0 0 /50%);font-weight:700',inline)),true]);
    for (const [label,answer,expected] of cases) {
      const result = item.grading.kind === 'render' ? await gradeRenderedAnswer(item,answer) : gradeAnswer(item,answer);
      const ok = result.passed === expected;
      lines.push(`${item.id} ${label} ${ok ? 'PASS' : `FAIL ${result.feedback}`}`);
    }
  }
  return lines;
}
