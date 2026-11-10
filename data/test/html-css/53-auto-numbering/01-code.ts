import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <article>\n            <section>\n                <h2>タイトルタイトル</h2>\n                <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>\n            </section>\n            <section>\n                <h2>タイトルタイトル</h2>\n                <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>\n            </section>\n            <section>\n                <h2>タイトルタイトル</h2>\n                <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>\n            </section>\n        </article>\n    </body>\n</html>",
  check(h) {
    const headings=h.all('h2');h.assert(headings.every(e=>{const s=getComputedStyle(e,'::before');return /counter\(/.test(s.content)&&s.counterIncrement!=='none';}),'見出しの前にカウンターで番号を付けてください。');h.assert(h.all('body,article,section').some(e=>getComputedStyle(e).counterReset!=='none'),'カウンターを初期化してください。');
  },
  documentAnswer: true
};

export default grader;
