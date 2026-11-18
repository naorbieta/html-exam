import { parseHTML } from 'linkedom/worker';
import { codeSource } from './editor-files.mjs';
import { gradeTerminalAnswer } from './terminal-shell.mjs';
let domCoercionApplied = false;

function normalized(value) {
  return String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, '').toLowerCase();
}

export function executeCode(source, rule, scenario = {}) {
  const parsed = parseHTML(scenario.html || rule.html || '<!doctype html><html><body></body></html>');
  if (!domCoercionApplied) {
    // Browsers stringify DOM text assignments; LinkeDOM expects strings for innerHTML.
    const descriptor = Object.getOwnPropertyDescriptor(parsed.Element.prototype, 'innerHTML');
    Object.defineProperty(parsed.Element.prototype, 'innerHTML', { ...descriptor, set(value) { descriptor.set.call(this, String(value)); } });
    domCoercionApplied = true;
  }
  const document = parsed.document;
  const windowEvents = document.createElement('window-events');
  const logs = [], alerts = [], prompts = [...(scenario.prompts || [])], confirms = [...(scenario.confirms || [])];
  const randoms = [...(scenario.randoms || [])];
  let clock = 0, timerId = 0, promptCount = 0, confirmCalls = 0, randomCount = 0;
  const timers = new Map();
  const assert = (condition, message = '実行結果が採点条件と一致しません。') => { if (!condition) throw new Error(message); };
  const output = args => {
    if (logs.length >= 1000) throw new Error('出力が多すぎます。繰り返しの条件を確認してください。');
    logs.push(args);
  };
  const log = (...args) => output(args);
  const alert = message => { if (alerts.length >= 1000) throw new Error('ダイアログの表示回数が多すぎます。'); alerts.push(String(message)); };
  const prompt = () => { promptCount++; return prompts.length ? prompts.shift() : '太郎'; };
  const confirm = () => { confirmCalls++; return confirms.length ? confirms.shift() : true; };
  const schedule = (fn, delay, interval) => {
    if (typeof fn !== 'function') throw new Error('タイマーには関数を渡してください。');
    const id = ++timerId; timers.set(id, { fn, at: clock + Math.max(1, Number(delay) || 0), interval }); return id;
  };
  const setTimeout = (fn, delay) => schedule(fn, delay, 0);
  const setInterval = (fn, delay) => schedule(fn, delay, Math.max(1, Number(delay) || 0));
  const clearTimeout = id => timers.delete(id);
  const clearInterval = clearTimeout;
  const math = Object.create(Math);
  math.random = () => { const value = randoms[randomCount % Math.max(1, randoms.length)] ?? 0.4; randomCount++; return value; };
  const window = { document, console: { log, info: log, warn: log, error: log }, alert, prompt, confirm, setTimeout, setInterval, clearTimeout, clearInterval,
    addEventListener: windowEvents.addEventListener.bind(windowEvents), removeEventListener: windowEvents.removeEventListener.bind(windowEvents), dispatchEvent: windowEvents.dispatchEvent.bind(windowEvents) };
  window.window = window;
  const fire = (target, type, properties = {}) => {
    const event = new parsed.Event(type, { bubbles: true, cancelable: true });
    for (const [key, value] of Object.entries(properties)) Object.defineProperty(event, key, { value });
    target.dispatchEvent(event);
    if (typeof target['on' + type] === 'function') target['on' + type].call(target, event);
  };
  const h = { logs, alerts, document, window, assert, source, doctype: document.doctype,
    get promptCount() { return promptCount; }, get randomCount() { return randomCount; },
    get confirmCalls() { return confirmCalls; },
    text: selector => document.querySelector(selector)?.textContent.trim() || '',
    logText: () => logs.map(args => args.map(value => Array.isArray(value) ? value.join(',') : String(value)).join(' ')),
    fire,
    click: selector => { const element = document.querySelector(selector); assert(element, `${selector}がありません。`); fire(element, 'click'); },
    key: key => { for (const type of ['keydown', 'keyup']) { fire(document, type, { key, code: key, keyCode: key === 'Enter' ? 13 : key.charCodeAt(0) }); fire(windowEvents, type, { key, code: key }); } },
    advance: duration => {
      const until = clock + duration; let steps = 0;
      while (true) {
        const next = [...timers.entries()].filter(([, timer]) => timer.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        if (++steps > 10000) throw new Error('タイマーの実行回数が多すぎます。');
        const [id, timer] = next; clock = timer.at;
        if (!timer.interval) timers.delete(id);
        else timer.at += timer.interval;
        timer.fn();
      }
      clock = until;
    }
  };
  let code = source;
  try { h.doctype = parseHTML(source).document.doctype; } catch {}
  if (rule.documentAnswer && /^\s*<(?:!doctype\s+html|html\b|form\b)/i.test(source)) {
    const student = parseHTML(/<html[\s>]/i.test(source) ? source : '<!doctype html><html><head></head><body>' + source + '</body></html>');
    document.documentElement.innerHTML = student.document.documentElement.innerHTML;
    code = [...document.querySelectorAll('script')].map(script => script.textContent).join('\n');
  }
  const cleanSource = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/[^\n]*/g, '$1');
  for (const pattern of rule.requires || []) assert(new RegExp(pattern, 'mu').test(cleanSource), rule.requirementHint || '問題で指定された構文やAPIを使ってください。');
  const ready = () => { fire(document, 'DOMContentLoaded'); fire(windowEvents, 'load'); if (typeof window.onload === 'function') window.onload(); };
  const context = (rule.context || []).filter(entry => !new RegExp('\\b(?:let|const|var|function)\\s+' + entry.name + '\\b').test(cleanSource)).map(entry => entry.code).join('\n');
  const scaffold = rule.scaffold && !new RegExp(rule.scaffold.detect).test(cleanSource) ? rule.scaffold : { prefix: '', after: '' };
  const program = context + '\n' + (scenario.prefix ?? rule.prefix ?? '') + '\n' + scaffold.prefix + '\n' + code + '\n' + scaffold.after + '\n;__ready();\n{\n' + (scenario.check ?? rule.check ?? '') + '\n}';
  const execute = new Function('h', 'document', 'window', 'console', 'alert', 'prompt', 'confirm', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Math', '__ready', program);
  execute.call(window, h, document, window, window.console, alert, prompt, confirm, setTimeout, setInterval, clearTimeout, clearInterval, math, ready);
  return { logs: h.logText(), alerts, randomCount, promptCount };
}

export function gradeAnswer(item, answer, allAnswers = {}) {
  const rule = item.grading;
  if (!rule) return { passed: false, feedback: '採点条件が登録されていません。管理者にお知らせください。' };
  if (rule.kind === 'render') throw new Error('表示の採点にはブラウザーを使用してください。');
  if (rule.kind === 'terminal') return gradeTerminalAnswer(item, answer);
  const value = item.type === 'code' ? codeSource(answer) : String(answer ?? '');
  const result = { itemId: item.id, passed: false, feedback: rule.feedback, example: rule.example, checks: [] };
  if (!value.trim()) { result.feedback = '回答を入力してください。'; return result; }
  try {
    if (rule.kind === 'text') {
      result.passed = rule.config.accept?.some(expected => normalized(expected) === normalized(value)) || false;
      if (rule.config.acceptSets) result.passed = Array.isArray(answer) && rule.config.acceptSets.some(expected => JSON.stringify(expected.map(normalized).sort()) === JSON.stringify(answer.map(normalized).sort()));
    } else if (rule.kind === 'code') {
      const source = value;
      for (const [index, scenario] of (rule.config.cases || [{}]).entries()) {
        executeCode(source, rule.config, scenario);
        result.checks.push({ label: scenario.label || `テスト ${index + 1}`, passed: true });
      }
      result.passed = true;
    }
    if (result.passed) result.feedback = '正解です。採点条件を満たしています。';
  } catch (error) {
    result.checks.push({ label: error.message, passed: false });
    result.feedback = `${rule.feedback}\n${error.name === 'SyntaxError' ? '構文エラー: ' : ''}${error.message}`;
  }
  return result;
}
