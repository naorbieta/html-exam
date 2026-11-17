import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Nav } from './vendor/tutorialkit/react/Nav.tsx';
import { Button } from './vendor/tutorialkit/react/Button.tsx';
import { gradeRenderedAnswer } from './render-grader.mjs';
import { AnswerWorkspace, CodeWorkspace } from './answer-workspace.jsx';
import { TerminalAnswer } from './terminal-workspace.jsx';
import { codeSource } from './editor-files.mjs';
import { lessonDescription, referenceSource } from './lesson-content.mjs';
import { TutorialLayout, topBarButton } from './tutorial-layout.jsx';
import { withInitialAnswers, itemResults, changeAnswer, recordGrade, examExplanation, nextUnansweredIndex } from './step-progress.mjs';
import { QuestionBody, Inline } from './question-body.jsx';
import './styles.css';

const preview = window.PRACTICE_PREVIEW;
const storageKey = 'javascript-practice-v2';
const i18n = { partTemplate: '${title}' };

function callServer(name, ...args) {
  return new Promise((resolve, reject) => {
    if (!window.google?.script?.run) return reject(new Error('GASとの接続を確認できません。ページを開き直してください。'));
    google.script.run.withSuccessHandler(resolve).withFailureHandler(error => reject(new Error(error.message || String(error))))[name](...args);
  });
}
function readPractice() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object' && saved.quizzes) {
      for (const draft of Object.values(saved.quizzes)) {
        if (Object.values(draft.itemResults || {}).some(result => result.unscored || result.reviewRequired) || draft.result?.items?.some(result => result.unscored || result.reviewRequired)) {
          draft.itemResults = itemResults(draft); draft.result = null;
        }
      }
      return saved;
    }
  } catch {}
  return { sessionId: crypto.randomUUID(), quizzes: {} };
}
function grade(item, answers) {
  if (item.grading.kind === 'render') return gradeRenderedAnswer(item, answers[item.id], answers);
  return new Promise(resolve => {
    const source = JSON.parse(document.getElementById('grader-source').textContent);
    const url = URL.createObjectURL(new Blob([source], { type: 'application/javascript' }));
    let worker, timeout;
    const finish = result => { clearTimeout(timeout); worker?.terminate(); URL.revokeObjectURL(url); resolve(result); };
    try {
      worker = new Worker(url);
      timeout = setTimeout(() => finish({ itemId: item.id, passed: false, feedback: '実行時間が2秒を超えました。繰り返しの終了条件を確認してください。', example: item.grading.example }), 2000);
      worker.onmessage = event => finish(event.data);
      worker.onerror = event => finish({ itemId: item.id, passed: false, feedback: `実行エラー: ${event.message}`, example: item.grading.example });
      worker.postMessage({ item, answer: answers[item.id] || '', answers });
    } catch (error) { finish({ itemId: item.id, passed: false, feedback: `採点処理を起動できません: ${error.message}` }); }
  });
}

function App() {
  const [catalog, setCatalog] = useState([]), [loadError, setLoadError] = useState('');
  const [practice, setPractice] = useState(readPractice), practiceRef = useRef(practice);
  const [storageError, setStorageError] = useState(false);
  const [mobileView, setMobileView] = useState('content');
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('tk_theme') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; } });
  const [saving, setSaving] = useState(false), [error, setError] = useState(''), [saveStatus, setSaveStatus] = useState('');
  const busy = useRef(false), zoom = useRef();
  const [zoomImage, setZoomImage] = useState(null);
  const current = catalog.find(quiz => quiz.id === practice.currentId) || catalog[0];
  const draft = current ? withInitialAnswers(current, practice.quizzes[current.id] || { answers: {}, attemptId: crypto.randomUUID() }) : null;
  const activeIndex = Math.min(draft?.activeIndex || 0, (current?.items.length || 1) - 1);
  const item = current?.items[activeIndex];
  const graded = draft && itemResults(draft)[item.id];
  const quizIndex = catalog.indexOf(current);

  function commit(next) {
    practiceRef.current = next; setPractice(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
  }
  function edit(editedItem, value) {
    const state = practiceRef.current, data = withInitialAnswers(current, state.quizzes[current.id]);
    if (itemResults(data)[editedItem.id]) return;
    if (data.answers[editedItem.id] === value) return;
    commit({ ...state, quizzes: { ...state.quizzes, [current.id]: { ...changeAnswer(current, data, editedItem, value), attemptId: crypto.randomUUID() } } });
    setSaveStatus(''); setError('');
  }
  function editReference(value) {
    const state = practiceRef.current, data = state.quizzes[current.id] || { answers: {}, attemptId: crypto.randomUUID() };
    commit({ ...state, quizzes: { ...state.quizzes, [current.id]: { ...data, references: { ...data.references, [item.id]: value } } } });
  }
  function openQuiz(quiz) {
    if (busy.current) return;
    const state = practiceRef.current;
    commit({ ...state, currentId: quiz.id, quizzes: { ...state.quizzes, [quiz.id]: withInitialAnswers(quiz, state.quizzes[quiz.id] || { answers: {}, attemptId: crypto.randomUUID() }) } });
    setError(''); setSaveStatus(''); setMobileView('content');
  }
  async function load() {
    setLoadError('');
    try {
      const data = preview ? preview.catalog : await callServer('getCatalog');
      if (!data.length) throw new Error('問題がありません。問題データを確認してください。');
      setCatalog(data);
    } catch (error) { setLoadError(error.message); }
  }
  useEffect(() => { load(); }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('tk_theme', theme); } catch {}
  }, [theme]);
  useEffect(() => { if (zoomImage) zoom.current?.showModal(); }, [zoomImage]);

  function openStep(index) {
    if (busy.current) return;
    const state = practiceRef.current, data = state.quizzes[current.id] || { answers: {}, attemptId: crypto.randomUUID() };
    commit({ ...state, quizzes: { ...state.quizzes, [current.id]: withInitialAnswers(current, { ...data, activeIndex: index }) } });
    setError(''); setSaveStatus('');
    requestAnimationFrame(() => { document.getElementById('answer-prompt')?.focus(); document.querySelector('main')?.scrollTo(0, 0); });
  }
  function next() {
    const index = nextUnansweredIndex(current, draft, activeIndex);
    if (index >= 0 && index !== activeIndex) openStep(index);
    else if (index < 0 && catalog[quizIndex + 1]) openQuiz(catalog[quizIndex + 1]);
  }
  async function submit(event, collectedAnswer) {
    event.preventDefault(); if (busy.current) return;
    if (itemResults(withInitialAnswers(current, practiceRef.current.quizzes[current.id] || { answers: {} }))[item.id]) return;
    if (collectedAnswer && JSON.stringify(collectedAnswer) !== JSON.stringify(practiceRef.current.quizzes[current.id]?.answers[item.id])) edit(item, collectedAnswer);
    const state = practiceRef.current, data = withInitialAnswers(current, state.quizzes[current.id] || { answers: {}, attemptId: crypto.randomUUID() });
    const value = data.answers[item.id];
    if (item.required && (Array.isArray(value) ? !value.length : item.type === 'file' ? !value?.name : item.type === 'dom_task' ? !value?.text : item.type === 'terminal' ? !value?.commands?.some(command => command.trim()) : item.type === 'code' ? !codeSource(value).trim() : !String(value || '').trim())) {
      setError(item.type === 'file' ? 'ファイルを選んでください。' : item.type === 'terminal' ? 'ターミナルにコマンドを入力してください。' : ['multiple_choice', 'checkboxes'].includes(item.type) ? '回答を選んでください。' : '回答を入力してください。');
      document.getElementById(`answer-${item.id}`)?.focus();
      return;
    }
    busy.current = true; setSaving(true); setError(''); setSaveStatus('');
    try {
      const updated = recordGrade(current, data, await grade(item, data.answers));
      commit({ ...state, quizzes: { ...state.quizzes, [current.id]: updated } });
      if (updated.result && !preview) {
        await callServer('submitQuiz', { quizId: current.id, sessionId: state.sessionId, attemptId: data.attemptId, answers: Object.fromEntries(current.items.map(question => [question.id, data.answers[question.id] ?? ''])), grading: updated.result });
        setSaveStatus('保存済み');
      }
    } catch (error) { setError(error.message); }
    finally { busy.current = false; setSaving(false); }
  }
  function exportAnswers() {
    const state = practiceRef.current;
    const data = { exportedAt: new Date().toISOString(), sessionId: state.sessionId, quizzes: catalog.filter(quiz => state.quizzes[quiz.id]).map(quiz => ({ id: quiz.id, number: quiz.number, title: quiz.title, ...state.quizzes[quiz.id] })) };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'javascript-answers.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function navigate(event) {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    event.preventDefault();
    const quiz = catalog.find(quiz => quiz.id === link.getAttribute('href').slice(1));
    if (quiz) openQuiz(quiz);
  }

  if (!current) return <div className="p-8 bg-tk-elements-app-backgroundColor text-tk-elements-app-textColor h-full" aria-busy={!loadError}>
    {loadError ? <><p role="alert">{loadError}</p><Button onClick={load} className="mt-4">もう一度読み込む</Button></> : '問題を読み込んでいます。'}
  </div>;
  const lessonLink = quiz => quiz && ({ id: quiz.id, title: quiz.title, href: `#${quiz.id}` });
  const lesson = { id: current.id, data: { title: current.title, i18n }, part: { id: current.course, title: current.course }, prev: lessonLink(catalog[quizIndex - 1]), next: lessonLink(catalog[quizIndex + 1]) };
  const navList = [...new Set(catalog.map(quiz => quiz.course))].map(course => ({ id: course, title: course, type: 'part', sections: catalog.filter(quiz => quiz.course === course).map(quiz => ({ ...lessonLink(quiz), type: 'lesson' })) }));
  const prompt = !item || item.title === 'JavaScriptのコードをここに入力してください。' ? '' : item.title.replace(/[（(]画像参照[）)]/g, '').trim();
  const reference = referenceSource(current, item);
  const itemDescription = (reference ? /^[.#][\w-]+\s*\{[\s\S]*\}$/.test(item.description?.trim()) ? '' : (item.description || '').replace(/(?:<!doctype\s+html>\s*)?<html\b[\s\S]*?<\/html>/gi, '') : item?.description || '').replace(/^コードを記述してください。\s*$/gm, '').trim();
  const description = lessonDescription(current, item).replace(/^解答欄にJavaScriptのコードを入力してください。\s*$/gm, '').trim().replace(/\n{3,}/g, '\n\n');
  const pageExercise = ['code', 'dom_task', 'inspection'].includes(item.type);
  const results = draft ? itemResults(draft) : {};
  const intro = description;
  // 左ペイン = 問題文（設問・説明・コード・図）、右ペイン = 解答欄、の配置をすべての形式でそろえます。
  const content = <article className="markdown-content text-tk-elements-content-textColor">
    <h1>{current.title}</h1>
    {intro && activeIndex === 0 && <p className="source-prose section-intro">{intro}</p>}
    {prompt && <>
      <p className="question-heading">第{activeIndex + 1}問（全{current.items.length}問）</p>
      <h2 id="answer-prompt" tabIndex={-1} className="question-title"><Inline text={prompt} /></h2>
    </>}
    {item.context && <p className="source-prose mb-4">{item.context}</p>}
    {itemDescription && <QuestionBody text={itemDescription} />}
    <ReferenceImages quiz={current} onZoom={setZoomImage} />
  </article>;
  const choiceHint = item.type === 'multiple_choice' ? 'あてはまるものを1つ選んでください。' : item.type === 'checkboxes' ? 'あてはまるものをすべて選んでください（順番は関係ありません）。' : '';
  const answer = <>
    {!pageExercise && choiceHint && <p className="text-sm text-tk-text-secondary mb-3">{choiceHint}</p>}
    {item.type === 'terminal'
      ? <TerminalAnswer item={item} value={draft.answers[item.id]} saving={saving} locked={!!graded}
        onChange={(question, value) => { if (!busy.current) edit(question, value); }} onSubmit={submit} />
      : <AnswerWorkspace quiz={current} item={item} answers={draft.answers} theme={theme} saving={saving} locked={!!graded}
        onChange={(question, value) => { if (!busy.current) edit(question, value); }} onSubmit={submit} />}
  </>;
  const stepState = (question, index) => results[question.id] ? (results[question.id].passed ? 'passed' : 'failed') : draft.answers[question.id] !== undefined && index !== activeIndex ? 'answered' : 'open';
  const progressBar = <div className="exercise-progress"><nav className="exam-steps" aria-label="設問の一覧（未回答は好きな順、回答済みは確認のみ）">
      {current.items.map((question, index) => <button key={question.id} type="button" className="exam-step" data-state={stepState(question, index)}
        aria-current={index === activeIndex ? 'step' : undefined} aria-label={`第${index + 1}問`} disabled={saving} onClick={() => openStep(index)}>{index + 1}</button>)}
    </nav></div>;
  const nextOpen = nextUnansweredIndex(current, draft, activeIndex);
  const hasNext = graded ? nextOpen >= 0 || Boolean(draft.result && catalog[quizIndex + 1]) : nextOpen >= 0 && nextOpen !== activeIndex;
  // 採点して確定したあと（次へ進む前）に正誤と解説を出します。回答前には出しません。
  const feedbackText = graded ? examExplanation(item, graded) : '';
  return <div className="h-full" onClick={navigate}>
    <TutorialLayout title="Web試験" mobileView={mobileView} setMobileView={setMobileView}
      actions={<>
        <button type="button" title="回答を書き出す" aria-label="回答を書き出す" className={topBarButton} onClick={exportAnswers}><span className="i-ph-download-simple" /></button>
        <button type="button" title="テーマを切り替える" aria-label="テーマを切り替える" className={topBarButton} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}><span className={theme === 'dark' ? 'i-ph-sun-dim-duotone' : 'i-ph-moon-stars-duotone'} /></button>
      </>}
      navigation={<Nav key={current.id} lesson={lesson} navList={navList} />}
      progress={progressBar}
      content={content}
      editor={<div key={item.id} className={item.type === 'terminal' ? 'terminal-question' : item.type === 'code' || reference ? 'h-full' : 'single-question'}>
        {reference ? <div className="reference-workspace">
          <div className="reference-code"><CodeWorkspace reference item={{ id: `${item.id}-reference`, language: 'html', referenceEditable: item.referenceEditable, grading: { starter: reference } }} value={item.referenceEditable ? draft.references?.[item.id] ?? reference : reference} answers={{}} theme={theme} saving={saving} onChange={editReference} /></div>
          <div className="single-question reference-answer">{answer}</div>
        </div> : answer}
      </div>}
      results={<footer className="exercise-footer">
        <div className="exercise-footer-inner">
          <div className="exercise-feedback" aria-live="polite">
            {storageError && <p className="text-tk-text-negative" role="alert">保存できません。「回答を書き出す」で保存してください。</p>}
            {error && <p className="text-tk-text-negative" role="alert">{error}</p>}
            {graded && <>
              <p className={`flex items-center gap-2 font-medium ${graded.reviewRequired ? 'text-tk-text-secondary' : graded.passed ? 'text-tk-text-positive' : 'text-tk-text-negative'}`}><span className={graded.reviewRequired ? 'i-ph-clock' : graded.passed ? 'i-ph-check-circle' : 'i-ph-x-circle'} />{graded.reviewRequired ? '確認待ち' : graded.passed ? '正解' : '不正解'}</p>
              {feedbackText && <p className="source-prose mt-2 leading-6 whitespace-pre-wrap">{feedbackText}</p>}
              {draft.result && draft.result.total > 0 && <p className="text-sm mt-2">{draft.result.correct} / {draft.result.total} 正解</p>}
            </>}
            <span className="text-xs text-tk-text-secondary" role="status">{saveStatus}</span>
          </div>
          <div className="exercise-footer-actions">
            {activeIndex > 0 && <Button variant="secondary" type="button" disabled={saving} onClick={() => openStep(activeIndex - 1)}>戻る</Button>}
            {!graded && <Button key="grade" type="submit" form="answer-form" disabled={saving}>{saving ? '処理中…' : '採点する'}</Button>}
            {hasNext && <Button key="continue" variant={graded ? undefined : 'secondary'} type="button" disabled={saving} onClick={event => { event.preventDefault(); next(); }}>{graded ? '次へ' : 'あとで解く（次へ）'}</Button>}
          </div>
        </div>
      </footer>}
    />
    <dialog ref={zoom} className="image-zoom" onClick={event => { if (event.target === zoom.current) zoom.current.close(); }}>
      <div className="image-zoom-toolbar"><Button variant="secondary" onClick={() => zoom.current.close()}>閉じる</Button></div>
      {zoomImage && <img src={zoomImage.src} alt={zoomImage.alt} />}
    </dialog>
  </div>;
}

const imageCache = new Map();
function ReferenceImages({ quiz, onZoom }) {
  const [images, setImages] = useState(null), [error, setError] = useState(''), [retry, setRetry] = useState(0);
  useEffect(() => {
    let cancelled = false; setImages(null); setError('');
    if (!quiz.images.length) return;
    if (!imageCache.has(quiz.id)) imageCache.set(quiz.id, preview ? Promise.resolve(preview.imageData) : callServer('getQuizImages', quiz.id));
    imageCache.get(quiz.id).then(data => {
      if (quiz.images.some(image => !data[image.path])) throw new Error('参考画像が見つかりません。管理者にお知らせください。');
      if (!cancelled) setImages(data);
    }).catch(error => { imageCache.delete(quiz.id); if (!cancelled) setError(error.message); });
    return () => { cancelled = true; };
  }, [quiz.id, retry]);
  if (!quiz.images.length) return null;
  if (error) return <div className="mt-6"><p role="alert">{error}</p><Button variant="secondary" onClick={() => setRetry(retry + 1)}>読み直す</Button></div>;
  if (!images) return <p className="mt-6 text-tk-text-secondary">画像を読み込んでいます…</p>;
  return <div className="flex flex-col gap-6 mt-6">{quiz.images.map((image, index) => <button type="button" key={image.path} aria-label={`参考画像${index + 1}を拡大`} className="text-left cursor-zoom-in" onClick={() => onZoom({ src: images[image.path], alt: image.alt })}><img className="reference-image" src={images[image.path]} alt={image.alt} /></button>)}</div>;
}

createRoot(document.getElementById('app')).render(<App />);
