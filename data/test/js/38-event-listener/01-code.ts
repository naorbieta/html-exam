import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<html><body><div class=\"wrapper\"><button id=\"toggle-btn\">開閉ボタン</button><div class=\"text\" style=\"display:none\">こんにちは</div></div></body></html>",
  check(h) {
    h.click('#toggle-btn');h.assert(document.querySelector('.text').style.display!=='none','クリックで開いてください。');h.click('#toggle-btn');h.assert(document.querySelector('.text').style.display==='none','もう一度クリックしたら閉じてください。');
  },
  documentAnswer: true
};

export default grader;
