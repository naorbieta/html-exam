import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { CodePreview } from '../code-preview.jsx';
import { splitEditorFiles } from '../editor-files.mjs';

export async function checkPreview() {
  const host = document.createElement('div'); document.body.append(host);
  const root = createRoot(host), lines = [];
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const until = async predicate => {
    const limit = Date.now() + 5000;
    while (!predicate()) { if (Date.now() > limit) throw new Error('プレビューの更新を確認できません。'); await new Promise(resolve => setTimeout(resolve, 40)); }
  };
  const render = (item, answer, autoPreview = true) => flushSync(() => root.render(<CodePreview item={item} answer={answer} answers={{}} saving={false} autoPreview={autoPreview} />));
  const run = () => [...host.querySelectorAll('button')].find(button => button.textContent === '実行').click();
  const output = () => host.querySelector('[role="log"]').textContent;
  try {
    const item = { id: 'html', language: 'html', grading: { kind: 'render', config: { documentAnswer: true } } };
    const answer = splitEditorFiles('<html><head><style>p{color:red}</style></head><body><p>表示</p><script>console.log(document.querySelector("p").textContent,getComputedStyle(document.querySelector("p")).color)</script></body></html>');
    render(item, answer);
    await until(() => host.querySelector('iframe')?.srcdoc.includes('color:red'));
    assert(output() === '', 'JavaScriptが自動で実行されました。');
    run(); await until(() => output().includes('rgb(255, 0, 0)'));
    const edited = { ...answer, files: { ...answer.files, 'style.css': 'p{color:blue}', 'index.html': answer.files['index.html'].replace('表示', '編集した表示') } };
    render(item, edited); await until(() => host.querySelector('iframe')?.srcdoc.includes('color:blue') && output() === '');
    run(); await until(() => output().includes('編集した表示 rgb(0, 0, 255)'));
    lines.push('HTML/CSSの実描画・編集反映 PASS');
    render(item, answer, false);
    await until(() => host.querySelector('iframe')?.srcdoc === '');
    assert(output() === '', '参照コードの結果が実行前に表示されました。');
    run(); await until(() => output().includes('rgb(255, 0, 0)'));
    lines.push('参照コードは実行時だけ表示 PASS');
    const js = { id: 'js', language: 'js', grading: { config: {} } };
    render(js, 'console.log(8+2);'); await until(() => host.querySelector('iframe')?.srcdoc.includes('8+2'));
    run(); await until(() => output() === '10');
    render(js, 'throw new Error("確認用エラー");'); await until(() => host.querySelector('iframe')?.srcdoc.includes('確認用エラー'));
    run(); await until(() => output().includes('確認用エラー'));
    lines.push('JavaScriptの出力・実行エラー PASS');
    render(js, 'const name=prompt("名前", "太郎");alert("こんにちは"+name);');
    await until(() => host.querySelector('iframe')?.srcdoc.includes('const name=prompt'));
    run(); await until(() => host.querySelector('[role="dialog"] input')?.value === '太郎');
    [...host.querySelectorAll('button')].find(button => button.textContent === '送信').click();
    await until(() => host.querySelector('[role="dialog"]')?.textContent.includes('こんにちは太郎'));
    assert(output() === '', 'alertがコンソールに出力されました。');
    [...host.querySelectorAll('button')].find(button => button.textContent === 'OK').click();
    await until(() => !host.querySelector('[role="dialog"]'));
    render(js, 'console.log(confirm("続けますか？") ? "はい" : "いいえ");');
    await until(() => host.querySelector('iframe')?.srcdoc.includes('続けますか？'));
    run(); await until(() => host.querySelector('[role="dialog"]'));
    [...host.querySelectorAll('button')].find(button => button.textContent === 'いいえ').click();
    await until(() => output() === 'いいえ');
    lines.push('prompt・confirmの画面入力 PASS');
    return lines;
  } finally { root.unmount(); host.remove(); }
}
