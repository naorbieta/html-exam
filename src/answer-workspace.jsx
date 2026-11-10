import React, { useMemo, useRef, useState } from 'react';
import { ExerciseFrame, readExercise } from './exercise-frame.jsx';
import { splitEditorFiles } from './editor-files.mjs';
import { EditorPanel } from '../vendor/tutorialkit/react/Panels/EditorPanel.tsx';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import resizeStyles from '../vendor/tutorialkit/react/styles/resize-panel.module.css';
import { CodePreview } from './code-preview.jsx';
import { isUploadedFile } from './uploaded-file.mjs';

export function CodeWorkspace({ item, value, answers, theme, saving, onChange, reference = false }) {
  const workspace = splitEditorFiles(value);
  const cssFiles = workspace && Object.keys(workspace.files).filter(name => name.endsWith('.css'));
  const jsFiles = workspace && Object.keys(workspace.files).filter(name => name.endsWith('.js'));
  const defaultFile = workspace ? (reference && !item.referenceEditable || item.grading.kind === 'render') && cssFiles.length ? cssFiles.at(-1) : !reference && item.grading.kind === 'code' && item.grading.config?.documentAnswer && jsFiles.length ? jsFiles[0] : workspace.entry : null;
  const [selectedFile, setSelectedFile] = useState(defaultFile);
  const [view, setView] = useState('code');
  const readOnly = reference && !item.referenceEditable;
  const file = workspace && Object.hasOwn(workspace.files, selectedFile) ? selectedFile : defaultFile;
  const path = workspace ? `/${file}` : `/answer.${item.language || 'js'}`;
  const files = workspace ? Object.keys(workspace.files).map(name => ({ path: `/${name}`, type: 'file' })) : [{ path, type: 'file' }];
  const editor = <EditorPanel id={item.id} autoFocus={!reference} theme={theme} files={files} i18n={{ filesTitleText: reference ? 'コード' : '解答', resetButtonText: reference ? '元に戻す' : 'ひな形を入力' }} answerLabel={reference ? '参照コード' : 'コード'} showFileTree={!!workspace} selectedFile={path}
      onFileSelect={path => setSelectedFile(path?.replace(/^\//, ''))}
      editorDocument={{ filePath: path, value: workspace ? workspace.files[file] : typeof value === 'string' ? value : '', loading: saving, readOnly }}
      onEditorChange={({ content }) => { if (!saving && !readOnly) onChange(workspace ? { ...workspace, files: { ...workspace.files, [file]: content } } : content); }}
      helpAction={reference && item.referenceEditable || item.grading.starter && !String(value || '').trim() ? 'reset' : undefined}
      onHelpClick={saving ? undefined : () => onChange(item.grading.starter)} />;
  if (readOnly) return <div className="reference-source"><div className="reference-source-view">{editor}</div></div>;
  if (reference) return <div className="reference-source">
    <div className="panel-header border-b border-tk-elements-app-borderColor flex gap-4" role="tablist" aria-label="コードの表示">
      {['code', 'preview'].map((name, index) => <button key={name} type="button" role="tab" aria-selected={view === name} tabIndex={view === name ? 0 : -1} className="panel-button px-2" onClick={() => setView(name)} onKeyDown={event => {
        if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); setView(name === 'code' ? 'preview' : 'code'); event.currentTarget.parentElement.children[1 - index].focus(); }
      }}>{name === 'code' ? 'コード' : 'プレビュー'}</button>)}
    </div>
    <div className="reference-source-view" hidden={view !== 'code'}>{editor}</div>
    {view === 'preview' && <div className="reference-source-view"><CodePreview item={item} answer={value} answers={answers} saving={saving} /></div>}
  </div>;
  return <PanelGroup direction="vertical" className="h-full">
      <Panel defaultSize={60} minSize={25}>{editor}</Panel>
      <PanelResizeHandle className={`${resizeStyles.PanelResizeHandle} preview-divider`} />
      <Panel defaultSize={40} minSize={20}><CodePreview item={item} answer={value} answers={answers} saving={saving} autoPreview={!reference} /></Panel>
    </PanelGroup>;
}

export function AnswerWorkspace({ quiz, item, answers, theme, saving, onChange, onSubmit }) {
  const frameRef = useRef();
  const [fileError, setFileError] = useState('');
  const liveExercise = ['dom_task', 'inspection'].includes(item.type);
  const id = `answer-${item.id}`;
  const value = answers[item.id];
  const choices = ['multiple_choice', 'checkboxes'].includes(item.type);
  const options = useMemo(() => {
    const shuffled = [...(item.options || [])];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
  }, [item.id, item.options]);
  return <form id="answer-form" noValidate onSubmit={event => onSubmit(event, item.type === 'dom_task' ? readExercise(frameRef.current, item.grading.config.selector) : undefined)} className={item.type === 'code' ? 'h-full' : 'answer-fields'} aria-label="解答" aria-busy={saving}>
    {liveExercise && <ExerciseFrame item={item} answers={answers} frameRef={frameRef} onChange={onChange} saving={saving} />}
    {item.type === 'dom_task' ? null : item.type === 'code' ? <CodeWorkspace item={item} value={value} answers={answers} theme={theme} saving={saving} onChange={value => onChange(item, value)} /> :
      <fieldset disabled={saving} aria-labelledby="answer-prompt">
        {item.type === 'file' ? <>
          <input id={id} name={item.id} type="file" className="answer-control" aria-label="ファイル" accept={item.grading.config.extension} onChange={async event => {
            const file = event.target.files?.[0]; setFileError(''); onChange(item, undefined);
            if (!file) return;
            try {
              if (file.size > 80000) throw new Error('20,000文字以内のファイルを選んでください。');
              const content = await file.text();
              if (!isUploadedFile({name:file.name,content})) throw new Error('ファイルが大きすぎます。小さなファイルを選んでください。');
              onChange(item,{name:file.name,content});
            } catch (error) { setFileError(error.message); }
          }} />
          {value?.name && <p>{value.name}</p>}
          {fileError && <p role="alert">{fileError}</p>}
        </> : choices ? options.map((option, index) => <label key={option} className="answer-choice">
          <input id={index === 0 ? id : `${id}-${index}`} type={item.type === 'multiple_choice' ? 'radio' : 'checkbox'} name={item.id} value={option}
            required={item.required && item.type === 'multiple_choice'}
            checked={Array.isArray(value) ? value.includes(option) : value === option}
            onChange={event => onChange(item, item.type === 'multiple_choice' ? option : event.target.checked ? [...(value || []), option] : (value || []).filter(answer => answer !== option))} />
          <span>{option}</span>
        </label>) : ['paragraph', 'inspection'].includes(item.type) ?
          <textarea id={id} name={item.id} className="answer-control" aria-label={item.type === 'inspection' ? '調べたCSS' : '解答'} aria-required={item.required} rows={item.type === 'inspection' ? 2 : 3} maxLength={20000} value={value || ''} onChange={event => onChange(item, event.target.value)} /> :
          <input id={id} name={item.id} className="answer-control short-answer" aria-label="解答" aria-required={item.required} maxLength={20000} value={value || ''} onChange={event => onChange(item, event.target.value)} />}
      </fieldset>}
  </form>;
}
