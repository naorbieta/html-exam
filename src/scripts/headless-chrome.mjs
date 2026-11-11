import { spawn } from 'node:child_process';
import { access, mkdir, rm, stat, writeFile } from 'node:fs/promises';
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
