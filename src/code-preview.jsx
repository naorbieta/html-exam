import React, { useEffect, useRef, useState } from 'react';
import { previewSource, previewDocument } from './preview.mjs';

export function CodePreview({ item, answer, answers, saving, autoPreview = true }) {
  const source = previewSource(item, answer, answers);
  const graphical = item.language === 'html' || item.language === 'css' || item.grading?.kind === 'render' || Boolean(item.grading?.config?.html);
  const frame = useRef(), timer = useRef();
  const [document, setDocument] = useState(null), [output, setOutput] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [pending, setPending] = useState(null), [input, setInput] = useState('');
  function show(execute, inputs = []) {
    clearTimeout(timer.current);
    const token = crypto.randomUUID();
    setOutput([]); setAlerts([]); setPending(null);
    setDocument({ token, inputs, html: previewDocument(source, { execute, token, inputs }) });
  }
  useEffect(() => {
    timer.current = setTimeout(() => { if (autoPreview) show(false); else { setDocument(null); setOutput([]); setAlerts([]); setPending(null); } }, 300);
    return () => clearTimeout(timer.current);
  }, [source, autoPreview]);
  useEffect(() => {
    const receive = event => {
      if (event.source !== frame.current?.contentWindow || event.data?.token !== document?.token) return;
      const data = event.data;
      if (data.type === 'output' && typeof data.text === 'string') setOutput(lines => lines.length < 100 ? [...lines, { level: data.level, text: data.text.slice(0, 2000) }] : lines);
      if (data.type === 'alert' && typeof data.text === 'string') setAlerts(messages => messages.length < 100 ? [...messages, data.text.slice(0, 2000)] : messages);
      if (data.type === 'input' && ['prompt', 'confirm'].includes(data.kind)) { setPending(data); setInput(String(data.defaultValue || '')); }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [document?.token]);
  const respond = value => show(true, [...document.inputs, value]);
  return <section className="code-preview" aria-label="プレビュー">
    <div className="panel-header border-b border-tk-elements-app-borderColor flex justify-between">
      <span className="panel-title text-sm">プレビュー</span>
      <button type="button" className="panel-button px-2" disabled={saving} onClick={() => show(true)}>実行</button>
    </div>
    <iframe key={document?.token} ref={frame} title="コードのプレビュー" sandbox="allow-scripts" referrerPolicy="no-referrer" srcDoc={document?.html || ''} hidden={!graphical} />
    <div role="log" aria-label="コンソール" className={`preview-console ${graphical ? '' : 'preview-console-full'}`}>
      {output.map((line, index) => <pre key={index} className={line.level === 'error' ? 'text-tk-text-negative' : ''}>{line.text}</pre>)}
    </div>
    {alerts.length > 0 ? <div role="dialog" aria-label="メッセージ" className="preview-input"><p className="whitespace-pre-wrap">{alerts[0]}</p><button type="button" autoFocus onClick={() => setAlerts(messages => messages.slice(1))}>OK</button></div> : pending && <div role="dialog" aria-label={pending.message || '入力'} className="preview-input">
      {pending.kind === 'confirm' ? <><p>{pending.message}</p><div><button type="button" onClick={() => respond(true)}>はい</button><button type="button" onClick={() => respond(false)}>いいえ</button></div></> :
        <><label>{pending.message || '入力'}<input autoFocus aria-label={pending.message || '入力'} className="answer-control" value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); respond(input); } }} /></label><button type="button" onClick={() => respond(input)}>送信</button><button type="button" onClick={() => respond(null)}>キャンセル</button></>}
    </div>}
  </section>;
}
