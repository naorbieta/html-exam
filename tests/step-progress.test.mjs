import test from 'node:test';
import assert from 'node:assert/strict';
import { withInitialAnswers, recordGrade, changeAnswer, itemResults } from '../src/step-progress.mjs';
import { validateSubmission } from '../src/submission.mjs';
const quiz = { id: 'quiz', items: [{ id: 'first', type: 'short_text', required: true }, { id: 'second', type: 'code', required: true }] };
const first = { itemId: 'first', passed: true, feedback: '' };
const second = { itemId: 'second', passed: false, feedback: '再確認してください。' };

test('現在のコード問題にだけひな形を入れ、編集済み・消去済みの回答を保つ', () => {
  const lesson = { items: [
    { id: 'code', type: 'code', grading: { starter: 'let value = 1;', config: {} } },
    { id: 'text', type: 'short_text', grading: { starter: '表示しない' } }
  ] };
  assert.deepEqual(withInitialAnswers(lesson).answers, { code: 'let value = 1;' });
  assert.deepEqual(withInitialAnswers(lesson, { activeIndex: 1 }).answers, {});
  for (const value of ['let value = 2;', '']) {
    const draft = { answers: { code: value }, itemResults: { code: first } };
    assert.deepEqual(withInitialAnswers(lesson, draft), draft);
  }
  lesson.items[0].grading.starter = 'let value = 3;';
  assert.equal(withInitialAnswers(lesson).answers.code, 'let value = 3;');
});

test('次の設問は前の設問で編集したHTMLから始め、保存済みの続きは上書きしない', () => {
  const starter = '<html><body>元の文</body></html>';
  const edited = '<html><body>編集した文</body></html>';
  const lesson = { items: [
    { id: 'first', type: 'code', grading: { starter, config: { documentAnswer: true } } },
    { id: 'second', type: 'code', grading: { starter, config: { documentAnswer: true, previous: ['first'] } } }
  ] };
  const firstStep = withInitialAnswers(lesson);
  assert.equal(firstStep.answers.second, undefined);
  const next = withInitialAnswers(lesson, { activeIndex: 1, answers: { first: edited } });
  assert.equal(next.answers.second, edited);
  assert.equal(withInitialAnswers(lesson, { ...next, answers: { ...next.answers, second: '' } }).answers.second, '');
});

test('継ぎ足すJavaScriptは前のコードを表示し、旧断片回答は一度だけ全文へ移す', () => {
  const lesson = { items: [
    { id: 'declare', type: 'code', grading: { config: {} } },
    { id: 'assign', type: 'code', grading: { config: { completeProgram: true, previous: ['declare'] } } }
  ] };
  const next = withInitialAnswers(lesson, { activeIndex: 1, answers: { declare: 'let userName;' } });
  assert.equal(next.answers.assign, 'let userName;');
  const migrated = withInitialAnswers(lesson, { activeIndex: 1, answers: { declare: 'let userName;', assign: "userName='太郎';" } });
  assert.equal(migrated.answers.assign, "let userName;\nuserName='太郎';");
  assert.deepEqual(withInitialAnswers(lesson, migrated), migrated);
  const edited = changeAnswer(lesson, migrated, lesson.items[1], "console.log('変更');");
  assert.equal(withInitialAnswers(lesson, edited).answers.assign, "console.log('変更');");
});

test('調査で編集した参照HTMLを、次のCSS修正へ引き継ぐ', () => {
  const lesson = { items: [
    { id: 'observe', type: 'paragraph', referenceEditable: true, grading: {} },
    { id: 'fix', type: 'code', grading: { starter: '<html>元</html>', config: { documentAnswer: true } } }
  ] };
  const edited = '<html>長いタイトル</html>';
  assert.equal(withInitialAnswers(lesson, { activeIndex: 1, references: { observe: edited } }).answers.fix, edited);
});

test('設問を差し替えたら旧採点を再利用せず、回答を残して最初の未回答へ戻す', () => {
  const lesson = { items: [{ id: 'choice', type: 'multiple_choice' }, { id: 'next', type: 'short_text' }] };
  for (const legacy of [
    { itemResults: { old: { itemId: 'old', passed: true } } },
    { result: { items: [{ itemId: 'old', passed: true }] } }
  ]) {
    const draft = withInitialAnswers(lesson, { ...legacy, activeIndex: 1, answers: { old: '元の記述', next: '保存済み' } });
    assert.equal(draft.activeIndex, 0);
    assert.deepEqual(draft.itemResults, {});
    assert.equal(draft.result, null);
    assert.equal(draft.answers.old, '元の記述');
    const graded = recordGrade(lesson, draft, { itemId: 'choice', passed: true });
    assert.equal(withInitialAnswers(lesson, { ...graded, activeIndex: 1 }).activeIndex, 1);
  }
});

test('1問ずつ採点し、全問を解くまで一括保存用の結果を作らない', () => {
  let draft = recordGrade(quiz, { answers: { first: '10' } }, first);
  assert.equal(draft.result, null);
  assert.deepEqual(itemResults(draft), { first });
  draft = recordGrade(quiz, { ...draft, answers: { first: '10', second: 'console.log(10)' } }, second);
  assert.deepEqual(draft.result, { correct: 1, total: 2, reviewRequired: 0, items: [first, second] });
  const payload = { quizId: 'quiz', sessionId: 'a'.repeat(16), attemptId: 'b'.repeat(16), answers: draft.answers, grading: draft.result };
  assert.equal(validateSubmission(payload, [quiz]).answers.length, 2);
});

test('回答の変更はその設問と後続の採点を取り消し、前の採点と入力を保持する', () => {
  const draft = { answers: { first: '10', second: 'old' }, result: { items: [first, second] } };
  const later = changeAnswer(quiz, draft, quiz.items[1], 'new');
  assert.deepEqual(later.answers, { first: '10', second: 'new' });
  assert.deepEqual(itemResults(later), { first });
  assert.equal(later.result, null);
  const earlier = changeAnswer(quiz, draft, quiz.items[0], '20');
  assert.deepEqual(itemResults(earlier), {});
  assert.equal(earlier.answers.second, 'old');
});

test('確認待ちの設問は不正解数に含めず、回答を保存できる', () => {
  const draft = recordGrade(quiz, recordGrade(quiz, { answers: { first: '10', second: '考察' } }, first), { ...second, reviewRequired: true });
  assert.equal(draft.result.correct, 1);
  assert.equal(draft.result.total, 1);
  assert.equal(draft.result.reviewRequired, 1);
  assert.equal(draft.result.items.length, 2);
});

test('旧方式で採点対象外だった回答を再採点し、得点の分母に含める',()=>{
 const legacy={answers:{first:['親近感','カジュアル','力強い'],second:'説明'},itemResults:{first:{...first,passed:false,unscored:true},second},result:null};
 assert.deepEqual(itemResults(legacy),{second});
 assert.deepEqual(legacy.answers.first,['親近感','カジュアル','力強い']);
 const updated=recordGrade(quiz,legacy,first);
 assert.equal(updated.result.total,2);assert.equal(updated.result.correct,1);
 assert.equal(updated.result.items[0].unscored,undefined);
});

test('旧画像提出の確認待ちを再利用せず、回答を保持して実習を採点し直す',()=>{
 const draft={answers:{first:{name:'old.png',dataUrl:'data:image/png;base64,AAAA'}},itemResults:{first:{...first,passed:false,reviewRequired:true}}};
 assert.deepEqual(itemResults(draft),{});assert.equal(draft.answers.first.name,'old.png');
 const updated=recordGrade(quiz,recordGrade(quiz,draft,first),second);assert.equal(updated.result.total,2);
});
