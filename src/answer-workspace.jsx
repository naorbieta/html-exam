import React, { useMemo, useState } from 'react';
import { splitEditorFiles } from './editor-files.mjs';
import { EditorPanel } from './vendor/tutorialkit/react/Panels/EditorPanel.tsx';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import resizeStyles from './vendor/tutorialkit/react/styles/resize-panel.module.css';
import { CodePreview } from './code-preview.jsx';
import { choicesUseCodeStyle } from './choice-style.mjs';

export function CodeWorkspace({ item, value, answers, theme, saving, onChange, locked = false }) {
  const workspace = splitEditorFiles(value);
  const cssFiles = workspace && Object.keys(workspace.files).filter(name => name.endsWith('.css'));
  const jsFiles = workspace && Object.keys(workspace.files).filter(name => name.endsWith('.js'));
  const defaultFile = workspace ? (item.grading.kind === 'render' && cssFiles.length ? cssFiles.at(-1) : item.grading.kind === 'code' && item.grading.config?.documentAnswer && jsFiles.length ? jsFiles[0] : workspace.entry) : null;
  const [selectedFile, setSelectedFile] = useState(defaultFile);
  const file = workspace && Object.hasOwn(workspace.files, selectedFile) ? selectedFile : defaultFile;
  const path = workspace ? `/${file}` : `/answer.${item.language || 'js'}`;
  const files = workspace ? Object.keys(workspace.files).map(name => ({ path: `/${name}`, type: 'file' })) : [{ path, type: 'file' }];
  const editor = <EditorPanel id={item.id} autoFocus={!locked} theme={theme} files={files} i18n={{ filesTitleText: '解答', resetButtonText: 'ひな形を入力' }} answerLabel="コード" showFileTree={!!workspace} selectedFile={path}
      onFileSelect={path => setSelectedFile(path?.replace(/^\//, ''))}
      editorDocument={{ filePath: path, value: workspace ? workspace.files[file] : typeof value === 'string' ? value : '', loading: saving, readOnly: locked }}
      onEditorChange={({ content }) => { if (!saving && !locked) onChange(workspace ? { ...workspace, files: { ...workspace.files, [file]: content } } : content); }}
      helpAction={locked ? undefined : (item.grading.starter && !String(value || '').trim() ? 'reset' : undefined)}
      onHelpClick={saving || locked ? undefined : () => onChange(item.grading.starter)} />;
  return <PanelGroup direction="vertical" className="h-full">
      <Panel defaultSize={60} minSize={25}>{editor}</Panel>
      <PanelResizeHandle className={`${resizeStyles.PanelResizeHandle} preview-divider`} />
      <Panel defaultSize={40} minSize={20}><CodePreview item={item} answer={value} answers={answers} saving={saving} autoPreview /></Panel>
    </PanelGroup>;
}

export function AnswerWorkspace({ item, answers, theme, saving, onChange, onSubmit, locked = false }) {
  const id = `answer-${item.id}`;
  const value = answers[item.id];
  const choices = ['multiple_choice', 'checkboxes'].includes(item.type);
  const codeStyle = choices && choicesUseCodeStyle(item.options);
  const options = useMemo(() => {
    const shuffled = [...(item.options || [])];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
  }, [item.id, item.options]);
  return <form id="answer-form" noValidate onSubmit={onSubmit} className={item.type === 'code' ? 'h-full' : 'answer-fields'} aria-label="解答" aria-busy={saving}>
    {item.type === 'code' ? <CodeWorkspace item={item} value={value} answers={answers} theme={theme} saving={saving} locked={locked} onChange={value => onChange(item, value)} /> :
      <fieldset disabled={saving || locked} aria-labelledby="answer-prompt">
        {choices && options.map((option, index) => <label key={option} className="answer-choice">
          <input id={index === 0 ? id : `${id}-${index}`} type={item.type === 'multiple_choice' ? 'radio' : 'checkbox'} name={item.id} value={option}
            required={item.required && item.type === 'multiple_choice'}
            checked={Array.isArray(value) ? value.includes(option) : value === option}
            onChange={event => onChange(item, item.type === 'multiple_choice' ? option : event.target.checked ? [...(value || []), option] : (value || []).filter(answer => answer !== option))} />
          <span className={codeStyle ? 'choice-code' : undefined}>{option}</span>
        </label>)}
      </fieldset>}
  </form>;
}
