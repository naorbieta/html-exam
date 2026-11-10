import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  exerciseHtml: "<div class=\"box\" aria-label=\"箱\"></div><style>.box{width:200px;height:200px;background:#eee;transition:.3s}.box:hover{width:300px;height:300px;background:#f00}</style>",
  html: "<div class=\"box\"></div><style>.box{width:200px;height:200px;background:#eee}</style>",
  target: ".box",
  async check(h) {
    h.hover('.box');await h.frame();h.near(h.rect('.box').width,300,'ホバー時の横幅を確認してください。');h.near(h.rect('.box').height,300,'ホバー時の高さを確認してください。');h.assert(h.css('.box').backgroundColor==='rgb(255, 0, 0)','ホバー時の背景色を確認してください。');
  }
};

export default grader;
