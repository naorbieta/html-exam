import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { build } from 'esbuild';
import { connectHeadlessCdp } from '../scripts/headless-chrome.mjs';

async function until(evaluate, expression, predicate, message, timeoutMs = 4000) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    last = await evaluate(expression);
    if (predicate(last)) return last;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error(`${message}（最後の値: ${JSON.stringify(last)}）`);
}

async function focusEditor(session) {
  await until(session.evaluate, 'Boolean(document.querySelector(".cm-content"))', value => value, 'エディタが表示されません。');
  await session.evaluate(`(() => {
    const editor = document.querySelector('.cm-content');
    editor.focus();
    return document.activeElement === editor;
  })()`);
  await until(session.evaluate, 'document.activeElement === document.querySelector(".cm-content")', value => value, 'エディタにフォーカスできません。');
}

async function key(session, name, { shift = false, ctrl = false } = {}) {
  const codes = { Tab: { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }, Escape: { key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 } };
  const binding = codes[name];
  const modifiers = (shift ? 8 : 0) + (ctrl ? 2 : 0);
  const base = { ...binding, modifiers, shiftKey: shift, ctrlKey: ctrl };
  await session.send('Input.dispatchKeyEvent', { type: 'keyDown', ...base });
  await session.send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
}

async function startServer() {
  const bundle = await build({
    entryPoints: [new URL('./editor-input-browser.jsx', import.meta.url).pathname],
    bundle: true,
    write: false,
    format: 'iife',
    minify: false,
    target: 'es2022',
    jsx: 'automatic',
    loader: { '.module.css': 'empty', '.css': 'empty' },
    define: { 'process.env.NODE_ENV': '"development"' },
  });
  const page = `<!doctype html><meta charset="utf-8"><title>エディタ入力の検証</title><div id="root"></div><script>${bundle.outputFiles[0].text.replaceAll('</script', '<\\/script')}</script>`;
  const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(page);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  return { url, close: () => new Promise(resolve => server.close(resolve)) };
}

test('IMEの変換中は確定されず、Tabでインデントできる', { timeout: 60000 }, async () => {
  const server = await startServer();
  const session = await connectHeadlessCdp(server.url);
  try {
    await focusEditor(session);

    await session.send('Input.imeSetComposition', { text: 'にほんご', selectionStart: 4, selectionEnd: 4 });
    await until(
      session.evaluate,
      `({
        text: document.querySelector('#value')?.textContent ?? '',
        visible: document.querySelector('.cm-content')?.innerText ?? '',
      })`,
      value => (value.visible || value.text).includes('にほんご'),
      '変換中の「にほんご」がエディタに出ません。',
    );

    await session.send('Input.imeSetComposition', { text: '日本語', selectionStart: 3, selectionEnd: 3 });
    const converted = await until(
      session.evaluate,
      `({
        text: document.querySelector('#value')?.textContent ?? '',
        visible: document.querySelector('.cm-content')?.innerText ?? '',
      })`,
      value => (value.visible || value.text).includes('日本語'),
      '変換後の「日本語」がエディタに出ません。',
    );
    assert.equal(converted.visible.includes('にほんご日本語') || converted.text.includes('にほんご日本語'), false, `変換中の文字が確定されて残りました: ${JSON.stringify(converted)}`);
    assert.equal(converted.visible.includes('にほんご') || converted.text.includes('にほんご'), false, `変換前の読みが確定されたままです: ${JSON.stringify(converted)}`);

    await session.send('Input.insertText', { text: '日本語' });
    const committed = await until(
      session.evaluate,
      `({
        text: document.querySelector('#value')?.textContent ?? '',
        visible: document.querySelector('.cm-content')?.innerText ?? '',
        composing: document.querySelector('.cm-editor')?.getAttribute('data-composing'),
      })`,
      value => value.text === '日本語',
      '確定後の値が「日本語」になりません。',
    );
    assert.equal(committed.text, '日本語');
    assert.equal(committed.visible.replace(/\n$/u, ''), '日本語');
    assert.notEqual(committed.composing, 'true');

    await session.evaluate('document.querySelector("#clear").click()');
    await until(session.evaluate, 'document.querySelector("#value")?.textContent ?? ""', value => value === '', 'エディタを空にできません。');
    await focusEditor(session);

    await key(session, 'Tab');
    const indented = await until(session.evaluate, 'document.querySelector("#value")?.textContent ?? ""', value => value.includes('\t'), 'Tabでインデントできません。');
    assert.equal(indented, '\t');

    await key(session, 'Tab');
    const more = await until(session.evaluate, 'document.querySelector("#value")?.textContent ?? ""', value => value === '\t\t', '2回目のTabでインデントが増えません。');
    assert.equal(more, '\t\t');

    await key(session, 'Tab', { shift: true });
    const dedented = await until(session.evaluate, 'document.querySelector("#value")?.textContent ?? ""', value => value === '\t', 'Shift+Tabで逆インデントできません。');
    assert.equal(dedented, '\t');

    await key(session, 'Escape');
    await new Promise(resolve => setTimeout(resolve, 50));
    await key(session, 'Tab');
    const afterEscape = await session.evaluate(`({
      value: document.querySelector('#value')?.textContent ?? '',
      inEditor: document.activeElement === document.querySelector('.cm-content'),
    })`);
    assert.equal(afterEscape.value, '\t');
    assert.equal(afterEscape.inEditor, false, 'EscapeのあとTabしてもフォーカスがエディタから出ません。');
  } finally {
    await session.close();
    await server.close();
  }
});
