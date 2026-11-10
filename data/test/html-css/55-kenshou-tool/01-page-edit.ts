import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "dom",
  task: "text",
  selector: "#post-text",
  initialText: "ふとんがふっとんだ",
  initialColor: "rgb(15, 20, 25)",
  exerciseHtml: "<article aria-label=\"投稿\"><p id=\"post-text\">ふとんがふっとんだ</p></article>"
};

export default grader;
