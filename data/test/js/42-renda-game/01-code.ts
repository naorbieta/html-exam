import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<html><body><div class=\"text\"><button id=\"trigger\">スタート</button></div></body></html>",
  scaffold: {
    detect: "(?:btn|document[^;]+)\\.addEventListener|querySelector",
    prefix: "const text=document.querySelector('.text');const btn=document.getElementById('trigger');btn.addEventListener('click',function(){let count=0;let flag=true;text.innerHTML='5秒以内にEnterを10回連打せよ!';",
    after: "});"
  },
  cases: [
    {
      label: "時間内に10回でクリア",
      check(h) {
        h.click('#trigger');for(let i=0;i<9;i++)h.key('Enter');h.assert(!/クリア/.test(h.text('.text')),'9回ではクリアしません。');h.advance(4999);h.key('Enter');h.assert(/クリア/.test(h.text('.text')),'5秒以内の10回でクリアしてください。');h.advance(1);h.assert(/クリア/.test(h.text('.text')),'クリア後に失敗へ変えないでください。');
      }
    },
    {
      label: "時間切れ後はクリアしない",
      check(h) {
        h.click('#trigger');h.advance(5000);h.assert(/失敗/.test(h.text('.text')),'5秒で時間切れにしてください。');for(let i=0;i<10;i++)h.key('Enter');h.assert(/失敗/.test(h.text('.text')),'時間切れ後のキー入力でクリアにしないでください。');
      }
    }
  ],
  documentAnswer: true
};

export default grader;
