import { spawn } from 'node:child_process';
import { access, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { createServer as createNetServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

async function resolveChrome() {
  for (const candidate of ['/usr/bin/google-chrome-stable', '/usr/bin/google-chrome']) {
    try { await access(candidate); return candidate; } catch {}
  }
  return 'google-chrome';
}

async function waitForFile(file, timeoutMs, started, child, logs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const info = await stat(file);
      if (info.mtimeMs >= started && info.size > 0) return;
    } catch {}
    if (child.exitCode != null) {
      throw new Error(`chrome exited (${child.exitCode}) before writing ${file}\n${logs.join('')}`);
    }
    await delay(200);
  }
  throw new Error(`headless check timed out waiting for ${file}\n${logs.join('')}`);
}

export async function openHeadless(url, resultFile, { timeoutMs = 180000 } = {}) {
  await rm(resultFile, { force: true });
  const started = Date.now();
  const profile = path.join(tmpdir(), `html-test-chrome-${process.pid}-${Math.random().toString(16).slice(2)}`);
  await mkdir(profile, { recursive: true });
  const chrome = await resolveChrome();
  const logs = [];
  const child = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-software-rasterizer',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profile}`,
    url,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  const take = chunk => { logs.push(chunk.toString()); if (logs.join('').length > 20000) logs.splice(0, logs.length - 8); };
  child.stdout.on('data', take);
  child.stderr.on('data', take);
  let exited = false;
  const exit = new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      exited = true;
      resolve({ code, signal });
    });
  });
  try {
    await waitForFile(resultFile, timeoutMs, started, child, logs);
  } finally {
    if (!exited) child.kill('SIGTERM');
    const killer = setTimeout(() => { if (!exited) child.kill('SIGKILL'); }, 3000);
    try { await exit; } catch {}
    clearTimeout(killer);
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  }
}

export function wantsHeadless() {
  return process.argv.includes('--headless') || process.env.HEADLESS === '1';
}


async function freePort() {
  return await new Promise((resolve, reject) => {
    const server = createNetServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close(error => error ? reject(error) : resolve(port));
    });
    server.on('error', reject);
  });
}

async function waitForJson(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
      lastError = new Error(`${url} → ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }
  throw lastError || new Error(`timed out waiting for ${url}`);
}

export async function connectHeadlessCdp(url, { timeoutMs = 60000 } = {}) {
  const profile = path.join(tmpdir(), `html-test-chrome-cdp-${process.pid}-${Math.random().toString(16).slice(2)}`);
  await mkdir(profile, { recursive: true });
  const port = await freePort();
  const chrome = await resolveChrome();
  const logs = [];
  const child = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-software-rasterizer',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profile}`,
    '--remote-debugging-address=127.0.0.1',
    `--remote-debugging-port=${port}`,
    url,
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  const take = chunk => { logs.push(chunk.toString()); if (logs.join('').length > 20000) logs.splice(0, logs.length - 8); };
  child.stdout.on('data', take);
  child.stderr.on('data', take);
  let exited = false;
  const exit = new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', (code, signal) => { exited = true; resolve({ code, signal }); });
  });
  let socket;
  const closeProcess = async () => {
    try { socket?.close(); } catch {}
    if (!exited) child.kill('SIGTERM');
    const killer = setTimeout(() => { if (!exited) child.kill('SIGKILL'); }, 3000);
    try { await exit; } catch {}
    clearTimeout(killer);
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  };
  try {
    const version = await waitForJson(`http://127.0.0.1:${port}/json/version`, 15000);
    const targets = await waitForJson(`http://127.0.0.1:${port}/json/list`, 15000);
    const page = targets.find(target => target.type === 'page' && target.webSocketDebuggerUrl) || targets.find(target => target.webSocketDebuggerUrl);
    const debuggerUrl = page?.webSocketDebuggerUrl || version.webSocketDebuggerUrl;
    if (!debuggerUrl) throw new Error(`Chrome DevTools URL not found\n${logs.join('')}`);
    socket = new WebSocket(debuggerUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true });
      socket.addEventListener('error', () => reject(new Error('Chrome DevTools への接続に失敗しました。')), { once: true });
    });
    let nextId = 0;
    const pending = new Map();
    const eventWaiters = new Map();
    socket.addEventListener('message', event => {
      const message = JSON.parse(String(event.data));
      if (message.id != null) {
        const request = pending.get(message.id);
        if (!request) return;
        pending.delete(message.id);
        if (message.error) request.reject(new Error(`${request.method}: ${message.error.message || JSON.stringify(message.error)}`));
        else request.resolve(message.result);
        return;
      }
      if (!message.method) return;
      const waiters = eventWaiters.get(message.method);
      if (waiters?.length) waiters.shift()(message.params);
    });
    const send = (method, params = {}, commandTimeoutMs = 10000) => new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, commandTimeoutMs);
      pending.set(id, { method, resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } });
      socket.send(JSON.stringify({ id, method, params }));
    });
    const waitForEvent = (method, eventTimeoutMs = 10000) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`${method} timed out`)), eventTimeoutMs);
      const list = eventWaiters.get(method) || [];
      list.push(params => { clearTimeout(timer); resolve(params); });
      eventWaiters.set(method, list);
    });
    const evaluate = async (expression, { awaitPromise = false } = {}) => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise, userGesture: true });
      if (result.exceptionDetails) {
        const details = result.exceptionDetails;
        throw new Error(details.exception?.description || details.text || 'Runtime.evaluate failed');
      }
      return result.result?.value;
    };
    await send('Page.enable');
    await send('Runtime.enable');
    const ready = await evaluate('document.readyState');
    if (ready !== 'complete') {
      await Promise.race([waitForEvent('Page.loadEventFired', timeoutMs), delay(5000)]);
    }
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const state = await evaluate('document.readyState');
      if (state === 'complete') break;
      await delay(50);
    }
    await evaluate('new Promise(resolve => requestAnimationFrame(() => resolve()))', { awaitPromise: true });
    return { send, evaluate, close: closeProcess, logs, waitForEvent };
  } catch (error) {
    await closeProcess();
    error.message += `\n${logs.join('')}`;
    throw error;
  }
}
