import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogFromTables } from '../../src/catalog.mjs';
import { gradeAnswer } from '../../src/grader.mjs';

const fixture = () => ({
  lessons: [['分野','レッスン番号','レッスン名','導入文'], ['Web',1,'リスト','私が書いた前段の説明\nを残す。']],
  questions: [['分野','レッスン番号','設問','回答形式','選択肢','正解'], ['Web',1,'ulの用途は？','単一選択','順序あり\n順序なし\n用語と説明','順序なし']],
  rules: {}
});

test('人が1行を追加・編集・削除して問題と採点を更新できる', () => {
  const tables = fixture();
  let [lesson] = catalogFromTables(tables);
  assert.equal(lesson.description, '私が書いた前段の説明\nを残す。');
  assert.equal(gradeAnswer(lesson.items[0], '順序なし').passed, true);
  assert.equal(gradeAnswer(lesson.items[0], '順序あり').passed, false);
  tables.questions.push(['Web',1,'選んでください','複数選択','赤\n青\n黄','赤\n黄']);
  lesson = catalogFromTables(tables)[0];
  assert.equal(lesson.items.length, 2);
  assert.equal(gradeAnswer(lesson.items[1], ['黄','赤']).passed, true);
  assert.equal(gradeAnswer(lesson.items[1], ['赤']).passed, false);
  tables.questions[1][5] = '順序あり';
  assert.equal(gradeAnswer(catalogFromTables(tables)[0].items[0], '順序あり').passed, true);
  assert.equal(catalogFromTables(tables)[0].items[0].grading.example, '順序あり');
  tables.questions.splice(1,1);
  assert.equal(catalogFromTables(tables)[0].items.length, 1);
});

test('選択肢にない正解・未入力・重複IDはシート名と行番号で知らせる', () => {
  const tables = fixture();
  tables.questions[1][5] = 'ない選択肢';
  assert.throws(() => catalogFromTables(tables), /設問.*2行目.*正解/);
  tables.questions[1][5] = '';
  assert.throws(() => catalogFromTables(tables), /設問.*2行目.*正解/);
  tables.questions[1][5] = '順序なし';
  tables.questions[0].push('設問ID'); tables.questions[1].push('same');
  tables.questions.push([...tables.questions[1]]);
  assert.throws(() => catalogFromTables(tables), /設問.*3行目.*ID/);
});

test('列の並べ替え・空行・スプレッドシート由来の空の末尾列を扱う', () => {
  const tables = fixture();
  const expected = catalogFromTables(tables);
  tables.questions = tables.questions.map(row => [...row].reverse().concat(['','']));
  tables.questions.push(Array(8).fill(''));
  assert.deepEqual(catalogFromTables(tables), expected);
});

test('JSONを書かずにJavaScriptの出力問題を追加できる', () => {
  const tables = fixture();
  tables.questions[0].push('採点方法','初期コード');
  tables.questions.push(['Web',1,'合計を出力する','コード','','10','コンソール出力','console.log();']);
  const item = catalogFromTables(tables)[0].items[1];
  assert.equal(item.grading.starter, 'console.log();');
  assert.equal(gradeAnswer(item, 'console.log(8 + 2);').passed, true);
  assert.equal(gradeAnswer(item, 'console.log(9);').passed, false);
});
