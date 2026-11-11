import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';
import { readFile } from 'node:fs/promises';
import { parseCsv } from '../scripts/csv.mjs';
import { catalogFromTables } from '../../src/catalog.mjs';
import { parseJsonHtml, assembleImages, GAS_HTML_BYTE_LIMIT } from '../../src/gas-data.mjs';
import { build } from '../scripts/build.mjs';
import { lessonDescription } from '../../src/lesson-content.mjs';
import { withInitialAnswers } from '../../src/step-progress.mjs';

const fixture = () => ({
  quizzes: [['id','number','title','description'],['q1',1,'データ型','改行\nと "引用符", を保つ']],
  items: [['id','quiz_id','position','type','title','description','required','max_files','max_file_mb'],['a1','q1',1,'short_text','結果は？','','true','','']],
  options: [['item_id','position','value']],
  images: [['quiz_id','position','path','alt'],['q1',1,'images/example.png','コード例']]
});

test('CSVの改行・引用符・カンマ・空セルを保持する', () => {
  assert.deepEqual(parseCsv('\uFEFFid,text,last\r\na,"line 1\n""line 2"", code",\r\n'), [['id','text','last'],['a','line 1\n"line 2", code','']]);
  assert.throws(() => parseCsv('a,"unterminated'), /引用符/);
  assert.throws(() => parseCsv('a,"closed"junk'), /余分/);
});

test('CSV上の編集・追加・削除をIDで反映する', () => {
  const tables = fixture();
  assert.equal(catalogFromTables(tables)[0].items[0].title, '結果は？');
  tables.items[1][4] = '変更後の問い';
  tables.quizzes.push(['q2',2,'選択問題','']);
  tables.items.push(['a2','q2',1,'multiple_choice','型は？','','true','','']);
  tables.options.push(['a2',2,'数値'],['a2',1,'文字列']);
  let result = catalogFromTables(tables);
  assert.equal(result[0].items[0].title, '変更後の問い');
  assert.deepEqual(result[1].items[0].options, ['文字列','数値']);
  tables.quizzes.splice(1,1); tables.items.splice(1,1); tables.images.splice(1,1);
  result = catalogFromTables(tables);
  assert.deepEqual(result.map(q => q.id), ['q2']);
});

test('関連先のない行・重複ID・列ずれを検出する', () => {
  let tables = fixture(); tables.items[1][1] = 'missing';
  assert.throws(() => catalogFromTables(tables), /確認/);
  tables = fixture(); tables.items.push([...tables.items[1]]);
  assert.throws(() => catalogFromTables(tables), /確認/);
  tables = fixture(); tables.items[1].pop();
  assert.throws(() => catalogFromTables(tables), /列数/);
});

test('採用した問題・画像・採点条件をGAS向けに生成する', async () => {
  const { catalog, tables, imageData, app, previewHtml, browserModules } = await build();
  const original = JSON.parse(await readFile(new URL('../archive/forms.json', import.meta.url), 'utf8')).forms;
  const removed = new Set(['web-01']);
  const expandedCounts = { 'quiz-04': 9, 'web-13': 6, 'web-15': 7, 'web-20': 6 };
  const quizId = form => `${form.collection === 'web' ? 'web' : 'quiz'}-${String(form.number).padStart(2,'0')}`;
  const retained = original.filter(form => !removed.has(quizId(form)));
  assert.deepEqual(catalog.map(quiz => quiz.id).sort(), retained.map(quizId).sort());
  assert.ok(!JSON.stringify(tables).match(/owlet/i), '配信データには製品固有の記載を含めない');
  assert.doesNotMatch(JSON.stringify(tables), /ガーディアン|guardian/i);
  const inventory=JSON.parse(await readFile(new URL('../archive/forms.json',import.meta.url),'utf8')).source.inventory;
  assert.deepEqual([...original.map(f=>f.formId)].sort(),inventory.map(f=>f.formId).sort());
  assert.deepEqual([...new Set(catalog.map(q=>q.course))],['JavaScript / 初級','HTML・CSS・Web基礎']);
  for (const form of retained) {
    const quiz = catalog.find(q => q.id === quizId(form));
    assert.ok(quiz.items.every(item => item.grading));
    for (const item of quiz.items) assert.doesNotMatch(lessonDescription(quiz, item), /<!doctype\s+html>|<html\b/i, `${item.id}: 参照HTMLが問題文に残っている`);
    for (const item of quiz.items.filter(item => item.type === 'code')) {
      assert.doesNotMatch(lessonDescription(quiz, item), /^\s*<(?:!doctype|html|form|div|style|ul|p)\b[^\n]*>\s*$/mi, `${item.id}: 編集用のHTMLが問題文に残っている`);
      assert.doesNotMatch(lessonDescription(quiz, item), /^\s*(?:let|const|var)\s+[\w$]+\s*(?:=[^\n]*|;)\s*$/m, `${item.id}: 編集用のJavaScriptが問題文に残っている`);
      if (item.grading.starter) assert.equal(withInitialAnswers({ items: [item] }).answers[item.id], item.grading.starter);
    }
    assert.equal(quiz.items.length, expandedCounts[quiz.id] || form.items.filter(item => item.type !== 'image').length);
    const sourceImages = ['web-27', 'web-32'].includes(quiz.id) ? [] : form.items.flatMap(i => i.images || []).map(i => i.path);
    assert.deepEqual(quiz.images.map(i => i.path), sourceImages);
    for (const image of quiz.images) assert.match(imageData[image.path], /^data:image\/(png|gif|jpeg|webp);base64,/);
  }
  assert.equal(catalog.flatMap(quiz=>quiz.items).length, retained.reduce((sum, form) => sum + (expandedCounts[quizId(form)] || form.items.filter(item => item.type !== 'image').length),0));
  assert.equal(Object.keys(imageData).length, new Set(catalog.flatMap(quiz => quiz.images.map(image => image.path))).size);
  const { readdir } = await import('node:fs/promises');
  const appFiles = (await readdir(app)).sort();
  assert.ok(appFiles.includes('Catalog.html'));
  const imageFileNames = appFiles.filter(name => /^Images\d+\.html$/.test(name));
  assert.ok(imageFileNames.length > 0);
  assert.deepEqual(appFiles.filter(name => name !== 'Catalog.html' && !/^Images\d+\.html$/.test(name)), ['Client.html', 'Code.gs', 'Grader.html', 'Index.html', 'Styles.html', 'appsscript.json']);
  const bundled = parseJsonHtml(await readFile(`${app}/Catalog.html`, 'utf8'));
  assert.deepEqual(bundled.catalog.map(quiz => quiz.id), catalog.map(quiz => quiz.id));
  assert.equal(bundled.catalog.flatMap(quiz => quiz.items).length, catalog.flatMap(quiz => quiz.items).length);
  const payloads = [];
  for (const name of imageFileNames) {
    const html = await readFile(`${app}/${name}`, 'utf8');
    assert.ok(html.length <= GAS_HTML_BYTE_LIMIT + 2_000, `${name} が大きすぎます: ${html.length}`);
    payloads.push(parseJsonHtml(html));
  }
  const assembled = assembleImages(payloads);
  assert.equal(Object.keys(assembled).length, Object.keys(imageData).length);
  for (const [path, url] of Object.entries(imageData)) assert.equal(assembled[path], url);
  const html = previewHtml;
  const workerTag = await readFile(`${app}/Grader.html`, 'utf8');
  assert.ok(html.includes(workerTag), '採点エンジン内の$などを置換せず、そのまま埋め込む');
  new vm.Script(JSON.parse(workerTag.slice(workerTag.indexOf('>') + 1, workerTag.lastIndexOf('</script>'))));
  assert.ok(html.includes('id="grader-source"'));
  assert.ok(!html.includes('<?!='));
  assert.ok(html.includes('<style>') && html.includes('<script>'));
  assert.ok(browserModules.some(name => name.includes('vendor/tutorialkit/react/Nav.tsx')));
  assert.ok(!browserModules.some(name => /node_modules\/(?:@webcontainer\/|@tutorialkit\/runtime\/)/.test(name)), 'GASから配信する画面はWebContainersの実行環境を必要としない');
  assert.equal(parseHTML(html).document.querySelector('script[src]'), null, 'GAS用の画面にはJavaScriptを同梱する');
});

test('同じ問題番号でも分野ごとの問題を保持して読み込む', () => {
  const tables=fixture();tables.quizzes[0].push('course');tables.quizzes[1].push('JavaScript');
  tables.quizzes.push(['web1',1,'HTMLの構造','','HTML・CSS']);
  tables.items.push(['html1','web1',1,'paragraph','HTMLを記述','','true','','']);
  const catalog=catalogFromTables(tables);
  assert.deepEqual(catalog.map(q=>[q.id,q.course,q.number]),[['q1','JavaScript',1],['web1','HTML・CSS',1]]);
});
