import React, { useEffect, useRef, useState } from 'react';
import { Button } from './vendor/tutorialkit/react/Button.tsx';
import { createShell, MAX_TERMINAL_COMMANDS, terminalCommands, terminalValue } from './terminal-shell.mjs';

const MAX_COMMANDS_JSON = 15000;

const welcome = '試験用のターミナルです。help で使えるコマンドを確認できます。';

export function replayTerminal(initial, commands) {
  const shell = createShell(initial || {});
  let lines = [];
  for (const command of commands) {
    const prompt = shell.prompt();
    const result = shell.run(command);
    lines = result.clear ? [] : [...lines, { prompt, command, output: result.output }];
  }
  return { shell, lines };
}

function Prompt({ text }) {
  const match = text.match(/^([^:]+):(.*)\$ $/);
  if (!match) return <span className="terminal-prompt">{text}</span>;
  return <><span className="terminal-prompt-user">{match[1]}</span>:<span className="terminal-prompt-path">{match[2]}</span>$ </>;
}

export function TerminalWorkspace({ item, value, saving, onChange }) {
  const initial = item.grading?.config?.initial || {};
  const start = useRef(null);
  if (!start.current) {
    const commands = terminalCommands(value) || [];
    start.current = { ...replayTerminal(initial, commands), commands, resets: Number(value?.resets) || 0 };
  }
  const shellRef = useRef(start.current.shell);
  const [lines, setLines] = useState(start.current.lines);
  const [commands, setCommands] = useState(start.current.commands);
  const [resets, setResets] = useState(start.current.resets);
  const [input, setInput] = useState('');
  const [notice, setNotice] = useState('');
  const historyIndex = useRef(null);
  const draft = useRef('');
  const composing = useRef(false);
  const inputRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => { screenRef.current?.scrollTo(0, screenRef.current.scrollHeight); }, [lines, notice]);

  const report = (nextCommands, nextResets) => onChange?.(terminalValue(nextCommands, nextResets, shellRef.current.snapshot()));

  function execute() {
    const shell = shellRef.current, line = input, prompt = shell.prompt();
    historyIndex.current = null; draft.current = ''; setInput('');
    if (!line.trim()) { setLines(previous => [...previous, { prompt, command: line, output: '' }]); return; }
    if (commands.length >= MAX_TERMINAL_COMMANDS || JSON.stringify([...commands, line]).length > MAX_COMMANDS_JSON) {
      setNotice(`入力できるコマンドは${MAX_TERMINAL_COMMANDS}回までです。「やり直す」で初期状態に戻してください。`);
      return;
    }
    const result = shell.run(line);
    const nextCommands = [...commands, line];
    setLines(previous => result.clear ? [] : [...previous, { prompt, command: line, output: result.output }]);
    setCommands(nextCommands);
    report(nextCommands, resets);
  }
  function showHistory(step) {
    if (!commands.length) return;
    if (historyIndex.current === null) { if (step > 0) return; draft.current = input; historyIndex.current = commands.length; }
    const next = Math.min(commands.length, Math.max(0, historyIndex.current + step));
    historyIndex.current = next;
    setInput(next === commands.length ? draft.current : commands[next]);
    if (next === commands.length) historyIndex.current = null;
  }
  function complete() {
    const result = shellRef.current.complete(input);
    if (result.candidates.length) setLines(previous => [...previous, { prompt: shellRef.current.prompt(), command: input, output: result.candidates.join('  ') + '\n' }]);
    setInput(result.line);
  }
  function onKeyDown(event) {
    if (event.nativeEvent.isComposing || event.keyCode === 229 || composing.current) return;
    if (event.key === 'Enter') { event.preventDefault(); if (!saving) execute(); return; }
    if (event.key === 'Tab' && !event.shiftKey) { event.preventDefault(); complete(); return; }
    if (event.key === 'ArrowUp') { event.preventDefault(); showHistory(-1); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); showHistory(1); return; }
    if (event.ctrlKey && (event.key === 'l' || event.key === 'L')) { event.preventDefault(); setLines([]); return; }
    if (event.ctrlKey && (event.key === 'c' || event.key === 'C') && !window.getSelection()?.toString()) {
      event.preventDefault();
      setLines(previous => [...previous, { prompt: shellRef.current.prompt(), command: input + '^C', output: '' }]);
      setInput(''); historyIndex.current = null;
    }
  }
  function reset() {
    shellRef.current = createShell(initial);
    const nextResets = resets + 1;
    setLines([]); setCommands([]); setInput(''); setNotice(''); setResets(nextResets);
    historyIndex.current = null;
    report([], nextResets);
    inputRef.current?.focus();
  }

  return <div className="terminal-workspace">
    <div className="terminal-toolbar">
      <span className="text-tk-text-secondary">コマンドを入力して Enter で実行します（入力 {commands.length} 回）</span>
      <Button variant="secondary" type="button" disabled={saving} onClick={reset}>やり直す（初期状態に戻す）</Button>
    </div>
    <div ref={screenRef} className="terminal-screen" data-terminal-screen onClick={() => { if (!window.getSelection()?.toString()) inputRef.current?.focus(); }}>
      <p className="terminal-line terminal-welcome">{welcome}</p>
      {lines.map((line, index) => <div key={index}>
        <p className="terminal-line"><Prompt text={line.prompt} />{line.command}</p>
        {line.output && <pre className="terminal-line terminal-output">{line.output.replace(/\n$/, '')}</pre>}
      </div>)}
      {notice && <p className="terminal-line terminal-notice" role="alert">{notice}</p>}
      <div className="terminal-input-row">
        <label htmlFor={`answer-${item.id}`} className="terminal-line"><Prompt text={shellRef.current.prompt()} /></label>
        <input ref={inputRef} id={`answer-${item.id}`} className="terminal-input" data-terminal-input value={input} disabled={saving}
          autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label="ターミナルの入力"
          onChange={event => { setInput(event.target.value); }}
          onCompositionStart={() => { composing.current = true; }}
          onCompositionEnd={() => { composing.current = false; }}
          onKeyDown={onKeyDown} />
      </div>
    </div>
  </div>;
}

export function TerminalAnswer({ item, value, saving, onChange, onSubmit }) {
  return <form id="answer-form" noValidate className="terminal-form" aria-label="解答" aria-busy={saving} onSubmit={event => onSubmit(event)}>
    <TerminalWorkspace item={item} value={value} saving={saving} onChange={next => onChange(item, next)} />
  </form>;
}
