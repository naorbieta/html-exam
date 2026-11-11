import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { AnswerWorkspace } from '../../src/answer-workspace.jsx';
import { readExercise } from '../../src/exercise-frame.jsx';
import { gradeAnswer } from '../../src/grader.mjs';

export async function checkExercises(catalog) {
  const quiz = catalog.find(q => q.id === 'web-55'), lines = [];
  const host = document.createElement('div'); document.body.append(host);
  let root, answers = {}, result;
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const until = async predicate => {
    const limit = Date.now() + 4000;
    while (!predicate()) { if (Date.now() > limit) throw new Error('実習ページの更新が反映されません。'); await new Promise(resolve => setTimeout(resolve, 80)); }
  };
  const mount = async item => {
    root?.unmount(); root = createRoot(host);
    const render = () => flushSync(() => root.render(<AnswerWorkspace quiz={quiz} item={item} answers={answers} theme="light" saving={false}
      onChange={(question, value) => { answers = { ...answers, [question.id]: value }; render(); }}
      onSubmit={(event, snapshot) => { event.preventDefault(); answers = { ...answers, [item.id]: snapshot }; result = gradeAnswer(item, snapshot, answers); }} />));
    render(); await until(() => host.querySelector('iframe')?.contentDocument?.querySelector('#post-text'));
    return host.querySelector('iframe');
  };
  try {
    const first = quiz.items[0], second = quiz.items[1];
    let frame = await mount(first);
    host.querySelector('form').requestSubmit(); assert(!result.passed, '未編集の本文を正解にしました。');
    frame.contentDocument.querySelector('#post-text').textContent = 'ブラウザーで変更した投稿';
    await until(() => answers[first.id]?.text === 'ブラウザーで変更した投稿');
    host.querySelector('form').requestSubmit(); assert(result.passed, '本文の編集を採点できません。');
    const firstAnswer = answers[first.id]; lines.push('本文の実編集・自動保存・採点 PASS');
    frame = await mount(first); assert(readExercise(frame, '#post-text').text === firstAnswer.text, '本文が復元されません。');
    host.querySelector('button').click(); await until(() => answers[first.id]?.text === first.grading.config.initialText);
    host.querySelector('form').requestSubmit(); assert(!result.passed, 'リセット後も正解のままです。');
    answers = { [first.id]: firstAnswer }; frame = await mount(second);
    assert(readExercise(frame, '#post-text').text === firstAnswer.text, '前の設問の本文が引き継がれません。');
    host.querySelector('form').requestSubmit(); assert(!result.passed, '未編集の色を正解にしました。');
    const sheet = frame.contentDocument.styleSheets[0]; sheet.insertRule('#post-text {color:blue!important}', sheet.cssRules.length);
    await until(() => answers[second.id]?.color === 'rgb(0, 0, 255)');
    host.querySelector('form').requestSubmit(); assert(result.passed, 'CSSOMによる文字色の編集を採点できません。');
    const secondAnswer = answers[second.id]; frame = await mount(second);
    assert(readExercise(frame, '#post-text').color === secondAnswer.color, '文字色が復元されません。');
    lines.push('前問の引き継ぎ・CSSOM編集・文字色の復元と採点 PASS');
    host.querySelector('button').click(); await until(() => answers[second.id]?.color === firstAnswer.color);
    host.querySelector('form').requestSubmit(); assert(!result.passed, '文字色のリセット後も正解のままです。');
    lines.push('リセット後の再採点 PASS');
    return lines;
  } finally { root?.unmount(); host.remove(); }
}
