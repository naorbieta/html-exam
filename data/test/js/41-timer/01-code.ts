import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<html><body><div class=\"text\"><button id=\"trigger\">スタート</button></div></body></html>",
  scaffold: {
    detect: "(?:btn|document[^;]+)\\.addEventListener|querySelector",
    prefix: "const text=document.querySelector('.text');const btn=document.getElementById('trigger');btn.addEventListener('click',function(){let count=5;text.innerHTML=count;",
    after: "});"
  },
  check(h) {
    h.click('#trigger');h.assert(h.text('.text')==='5','最初は5を表示してください。');for(const n of [4,3,2,1]){h.advance(1000);h.assert(h.text('.text')===String(n),'1秒ごとにカウントを減らしてください。');}h.advance(1000);h.assert(/ドーン/.test(h.text('.text')),'最後はドーン！を表示してください。');h.advance(3000);h.assert(/ドーン/.test(h.text('.text')),'カウントダウン後はタイマーを止めてください。');
  },
  documentAnswer: true
};

export default grader;
