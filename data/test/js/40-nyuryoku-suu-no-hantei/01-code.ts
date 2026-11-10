import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  html: "<html><body><div class=\"text\">入力された文字数を判定します。</div><textarea id=\"textarea\"></textarea></body></html>",
  check(h) {
    const ta=document.getElementById('textarea');for(const value of ['abcde','あいう','']){ta.value=value;for(const type of ['input','keyup','keydown'])h.fire(ta,type,{key:'a'});h.assert(h.text('.text').includes(String(value.length)),'テキストエリアの現在の文字数を表示してください。');}
  },
  documentAnswer: true
};

export default grader;
