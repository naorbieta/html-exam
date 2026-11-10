import { codeSource } from './editor-files.mjs';

export function previewSource(item, answer, answers = {}) {
  const source = codeSource(answer), config = item.grading?.config || {};
  const document = /^\s*<(?:!doctype\s+html|html\b)/i.test(source);
  if (document || config.htmlAnswer || item.language === 'html' && item.grading?.kind !== 'render' && !config.documentAnswer) return source;
  const previous = (config.completeProgram ? [] : config.previous || []).map(id => codeSource(answers[id]));
  if (item.language === 'css' || item.grading?.kind === 'render') {
    const base = [...previous].reverse().find(value => /^\s*<(?:!doctype\s+html|html\b)/i.test(value)) || config.html || '';
    const css = previous.filter(value => !/^\s*</.test(value)).concat(source).join('\n');
    return base + `<style>${css.includes('{') ? css : `${config.target || 'body'}{${css}}`}</style>`;
  }
  const context = (config.context || []).filter(entry => !new RegExp('\\b(?:let|const|var|function)\\s+' + entry.name + '\\b').test(source)).map(entry => entry.code).join('\n');
  const scaffold = config.scaffold && !new RegExp(config.scaffold.detect).test(source) ? config.scaffold : {};
  const script = [context, config.prefix, scaffold.prefix, ...previous, source, scaffold.after].filter(Boolean).join('\n');
  return (config.html || '') + `<script>${script.replace(/<\/script/gi, '<\\/script')}</script>`;
}

function previewBridge({ token, inputs }) {
  let count = 0, input = 0;
  const send = data => parent.postMessage({ token, ...data }, '*');
  const format = value => { if (typeof value === 'string') return value; try { return JSON.stringify(value) ?? String(value); } catch { return String(value); } };
  for (const level of ['log', 'info', 'warn', 'error']) console[level] = (...values) => {
    if (++count > 100) throw new Error('出力が100件を超えました。');
    send({ type: 'output', level, text: values.map(format).join(' ').slice(0, 2000) });
  };
  window.alert = value => {
    if (++count > 100) throw new Error('出力が100件を超えました。');
    send({ type: 'alert', text: String(value).slice(0, 2000) });
  };
  const request = (kind, message = '', defaultValue = '') => {
    if (input < inputs.length) return inputs[input++];
    send({ type: 'input', kind, message: String(message), defaultValue: String(defaultValue) });
    const error = new Error(); error.name = 'PreviewInput'; throw error;
  };
  window.prompt = (message, value) => request('prompt', message, value);
  window.confirm = message => request('confirm', message);
  window.addEventListener('error', event => {
    event.preventDefault();
    if (event.error?.name !== 'PreviewInput') send({ type: 'output', level: 'error', text: event.message.slice(0, 2000) });
  });
  window.addEventListener('unhandledrejection', event => {
    event.preventDefault();
    if (event.reason?.name !== 'PreviewInput') send({ type: 'output', level: 'error', text: format(event.reason).slice(0, 2000) });
  });
}

export function previewDocument(source, { execute = false, token, inputs = [] }) {
  const payload = JSON.stringify({ token, inputs }).replaceAll('<', '\\u003c');
  const scripts = execute ? "'unsafe-inline'" : `'nonce-${token}'`;
  return `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${scripts}; style-src 'unsafe-inline' https:; img-src https: data: blob:; font-src https: data:; frame-src https://www.youtube.com https://www.youtube-nocookie.com; base-uri 'none'; form-action 'none'"><script nonce="${token}">(${previewBridge.toString()})(${payload})<\/script>${source}`;
}
