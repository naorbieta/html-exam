import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<html><body><div class=\"wrapper\"><button id=\"toggle-btn\">開閉ボタン</button><div class=\"text\" style=\"display:none\">こんにちは</div></div></body></html>",
  check(h) {
    const box = document.querySelector('.text');
    const closed = () => {
      if (!box || box.hidden) return true;
      if (box.style.display === 'none' || box.style.visibility === 'hidden') return true;
      try {
        const cs = getComputedStyle(box);
        if (cs.display === 'none' || cs.visibility === 'hidden') return true;
      } catch {}
      return false;
    };
    h.assert(closed(), '初期状態ではテキストが隠れている想定です。');
    h.click('#toggle-btn');
    h.assert(!closed(), 'クリックで開いてください。');
    h.click('#toggle-btn');
    h.assert(closed(), 'もう一度クリックしたら閉じてください。');
  },
  documentAnswer: true
};

export default grader;
