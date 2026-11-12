// 実際のキー入力（CDP の Input ドメイン）が必要なブラウザー検証のための小さなヘルパーです。
import { spawn } from 'node:child_process';
import { access, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

async function resolveChrome() {
  for (const candidate of ['/usr/bin/google-chrome-stable', '/usr/bin/google-chrome']) {
    try { await access(candidate); return candidate; } catch {}
  }
  return 'google-chrome';
}

export async function launchCdpChrome({ timeoutMs = 30000 } = {}) {
  const profile = path.join(tmpdir(), `html-test-cdp-${process.pid}-${Math.random().toString(16).slice(2)}`);
  await mkdir(profile, { recursive: true });
  const logs = [];
  const child = spawn(await resolveChrome(), [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--disable-software-rasterizer',
    '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
    `--user-data-dir=${profile}`, 'about:blank'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  const take = chunk => { logs.push(chunk.toString()); if (logs.length > 50) logs.shift(); };
  child.stdout.on('data', take); child.stderr.on('data', take);
  const exited = new Promise(resolve => child.on('exit', resolve));
  const deadline = Date.now() + timeoutMs;
  let port;
  while (!port) {
    if (child.exitCode != null) throw new Error(`chrome exited (${child.exitCode})\n${logs.join('')}`);
    if (Date.now() > deadline) { child.kill('SIGKILL'); throw new Error(`chrome did not open a debugging port\n${logs.join('')}`); }
    try { port = Number((await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); } catch {}
    if (!port) await delay(100);
  }
  let target;
  while (!target) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(entry => entry.type === 'page'); } catch {}
    if (!target) { if (Date.now() > deadline) throw new Error('page target not found'); await delay(100); }
  }
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = () => reject(new Error('CDP WebSocket error')); });
  let nextId = 0;
  const pending = new Map();
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
    }
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async (expression, { timeout = 10000, label = expression } = {}) => {
    const end = Date.now() + timeout;
    for (;;) {
      try { const value = await evaluate(expression); if (value) return value; } catch {}
      if (Date.now() > end) throw new Error(`timed out waiting for ${label}`);
      await delay(50);
    }
  };
  const keyCodes = { Enter: 13, Tab: 9, ArrowUp: 38, ArrowDown: 40, Escape: 27, Backspace: 8 };
  const press = async (key, { keyCode = keyCodes[key] ?? key.toUpperCase().charCodeAt(0), modifiers = 0, text } = {}) => {
    const base = { key, code: key.length === 1 ? `Key${key.toUpperCase()}` : key, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode, modifiers };
    await send('Input.dispatchKeyEvent', { type: text || key.length === 1 ? 'keyDown' : 'rawKeyDown', ...base, ...(text ? { text, unmodifiedText: text } : {}) });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
  };
  const close = async () => {
    try { socket.close(); } catch {}
    child.kill('SIGTERM');
    const killer = setTimeout(() => child.kill('SIGKILL'), 3000);
    await exited; clearTimeout(killer);
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  };
  await send('Page.enable'); await send('Runtime.enable');
  const navigate = async url => { await send('Page.navigate', { url }); };
  return { send, evaluate, waitFor, press, navigate, close, insertText: text => send('Input.insertText', { text }) };
}
