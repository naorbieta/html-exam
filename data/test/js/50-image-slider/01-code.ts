import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    const main=document.getElementById('main-image');const caption=document.getElementById('caption');const thumbs=[...document.querySelectorAll('.thumbnail')];h.assert(main&&caption&&thumbs.length>=3,'ひな形のメイン画像・キャプション・サムネイルを用意してください。');for(const thumb of thumbs.slice(0,3)){h.fire(thumb,'click');h.assert(main.getAttribute('src')===thumb.getAttribute('src')&&caption.textContent.trim()===thumb.dataset.caption,'画像とキャプションを同時に切り替えてください。');}
  }
};

export default grader;
