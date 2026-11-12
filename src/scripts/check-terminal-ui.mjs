// 試験のターミナル問題を、ヘッドレスChromeで実際にキー入力して確認します。
// Enter・Tab補完・↑履歴・日本語入力（IME変換中の Enter）・やり直す・画面の復元・フォームが送信されないこと、を検証します。
import http from 'node:http';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readAuthoringData } from './data.mjs';
import { catalogFromTables } from '../catalog.mjs';
import { gradeAnswer } from '../grader.mjs';
import { launchCdpChrome } from './cdp-chrome.mjs';

const catalog = catalogFromTables(await readAuthoringData());
const items = catalog.flatMap(quiz => quiz.items).filter(item => item.type === 'terminal');
const bundle = await build({
  entryPoints: [new URL('../tests/terminal-ui-browser.jsx', import.meta.url).pathname], bundle: true, write: false, format: 'iife',
  minify: true, target: 'es2022', jsx: 'automatic', loader: { '.module.css': 'empty', '.css': 'empty' }, define: { 'process.env.NODE_ENV': '"production"' }
});
const page = `<!doctype html><meta charset="utf-8"><title>ターミナル入力の検証</title><div id="root"></div>
<script>window.TERMINAL_ITEMS=${JSON.stringify(items).replaceAll('<', '\\u003c')};</script>
<script>${bundle.outputFiles[0].text.replaceAll('</script', '<\\/script')}</script>`;
const server = http.createServer((req, res) => { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(page); });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;

const chrome = await launchCdpChrome();
const lines = [];
let failures = 0;
const check = async (label, fn) => {
  try { await fn(); lines.push(`PASS ${label}`); }
  catch (error) { failures++; lines.push(`FAIL ${label}: ${error.message}`); }
};
const input = 'document.querySelector("[data-terminal-input]")';
const screen = 'document.querySelector("[data-terminal-screen]").innerText';
const open = async id => {
  await chrome.navigate(`${base}?item=${id}`);
  await chrome.waitFor(`${input} && document.readyState === "complete"`, { label: `${id} の入力欄` });
  await chrome.evaluate(`${input}.focus()`);
};
const commandCount = () => chrome.evaluate('window.__answer?.commands.length ?? 0');
const type = async command => {
  const before = await commandCount();
  await chrome.insertText(command);
  await chrome.press('Enter');
  if (command.trim()) await chrome.waitFor(`(window.__answer?.commands.length ?? 0) === ${before + 1}`, { label: `「${command}」の実行` });
};
const gradeCurrent = async id => gradeAnswer(items.find(item => item.id === id), await chrome.evaluate('window.__answer'));

try {
  for (const item of items) {
    await check(`${item.id} 模範解答をキー入力すると正解になる`, async () => {
      await open(item.id);
      for (const command of JSON.parse(item.grading.example).commands) await type(command);
      const result = await gradeCurrent(item.id);
      assert.equal(result.passed, true, result.feedback);
      assert.equal(await chrome.evaluate('window.__submits'), 0, 'Enter でフォームが送信された');
      const state = await chrome.evaluate('window.__answer.state');
      assert.ok(state && state.cwd && state.files, '回答に最終状態が入っていない');
    });
  }

  await check('exam-terminal-01 Tab補完・↑↓履歴・Ctrl+L・Ctrl+C', async () => {
    await open('exam-terminal-01');
    await type('ls -a');
    assert.match(await chrome.evaluate(screen), /\.cache/);
    await chrome.insertText('rm .ca');
    await chrome.press('Tab');
    await chrome.waitFor(`${input}.value === "rm .cache "`, { label: 'Tab補完' });
    assert.equal(await chrome.evaluate('document.activeElement === ' + input), true, 'Tab でフォーカスが外れた');
    await chrome.press('c', { modifiers: 2 });
    await chrome.waitFor(`${input}.value === ""`, { label: 'Ctrl+C で入力を取り消す' });
    await chrome.press('ArrowUp');
    await chrome.waitFor(`${input}.value === "ls -a"`, { label: '↑で直前のコマンド' });
    await chrome.press('l', { modifiers: 2 });
    await chrome.waitFor(`!${screen}.includes("index.html")`, { label: 'Ctrl+L で画面を消す' });
    assert.equal(await chrome.evaluate(`${input}.value`), 'ls -a', 'Ctrl+L で入力中の行が消えた');
    await chrome.press('ArrowDown');
    await chrome.waitFor(`${input}.value === ""`, { label: '↓で入力中の行に戻る' });
    await chrome.press('ArrowUp');
    await chrome.evaluate(`${input}.select()`);
    await chrome.insertText('rm .cache');
    await chrome.press('Enter');
    await chrome.waitFor('window.__answer.commands.length === 2', { label: '削除の実行' });
    assert.equal((await gradeCurrent('exam-terminal-01')).passed, true);
  });

  await check('exam-terminal-04 日本語入力の変換中に Enter を押しても実行されない', async () => {
    await open('exam-terminal-04');
    await chrome.insertText('echo ');
    await chrome.send('Input.imeSetComposition', { text: 'こんにちは', selectionStart: 5, selectionEnd: 5 });
    await chrome.press('Enter', { keyCode: 229 });
    await new Promise(resolve => setTimeout(resolve, 200));
    assert.equal(await commandCount(), 0, '変換確定の Enter でコマンドが実行された');
    assert.equal(await chrome.evaluate('window.__submits'), 0, '変換確定の Enter でフォームが送信された');
    await chrome.insertText('こんにちは');
    await chrome.waitFor(`${input}.value === "echo こんにちは"`, { label: '変換の確定' });
    await chrome.insertText(' > memo.txt');
    await chrome.press('Enter');
    await chrome.waitFor('window.__answer?.commands.length === 1', { label: '確定後の Enter で実行' });
    assert.equal(await chrome.evaluate('window.__answer.commands[0]'), 'echo こんにちは > memo.txt');
    await type('cat memo.txt');
    assert.match(await chrome.evaluate(screen), /こんにちは\n/);
    await type('cp memo.txt backup/');
    assert.equal((await gradeCurrent('exam-terminal-04')).passed, true);
  });

  await check('exam-terminal-03 間違えたら「やり直す」で初期状態に戻せる', async () => {
    await open('exam-terminal-03');
    await type('mv * images');
    assert.equal((await gradeCurrent('exam-terminal-03')).passed, false, '誤操作が正解になった');
    await chrome.evaluate('[...document.querySelectorAll("button")].find(button => button.textContent.includes("やり直す")).click()');
    await chrome.waitFor('window.__answer.commands.length === 0 && window.__answer.resets === 1', { label: 'やり直す' });
    await chrome.evaluate(`${input}.focus()`);
    await type('ls');
    assert.match(await chrome.evaluate(screen), /logo\.png/);
    await type('mv *.jpg *.png images');
    const result = await gradeCurrent('exam-terminal-03');
    assert.equal(result.passed, true, result.feedback);
    assert.equal(await chrome.evaluate('window.__answer.resets'), 1);
  });

  await check('exam-git-04 画面を開き直すと入力したコマンドから状態を復元する', async () => {
    await open('exam-git-04');
    await type('git pull');
    await type('git switch -c feature');
    await chrome.evaluate('window.__remount()');
    await chrome.waitFor(`document.querySelector("[data-terminal-screen]")?.innerText.includes("Switched to a new branch 'feature'")`, { label: '画面の復元' });
    await chrome.evaluate(`${input}.focus()`);
    await type('git branch');
    assert.match(await chrome.evaluate(screen), /\* feature\n\s+main/);
    assert.equal((await gradeCurrent('exam-git-04')).passed, true);
  });

  await check('採点ボタンを押したときだけフォームが送信される', async () => {
    await open('exam-git-01');
    await type('git init');
    await chrome.evaluate('document.querySelector("#grade").click()');
    await chrome.waitFor('window.__submits === 1', { label: '採点ボタン' });
  });
} finally {
  await chrome.close();
  server.close();
}
console.log(lines.join('\n'));
console.log(`ターミナル入力の検証 完了 ${lines.length}件、失敗 ${failures}件`);
process.exit(failures ? 1 : 0);
