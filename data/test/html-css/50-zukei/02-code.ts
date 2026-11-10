import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"triangle\"></div>\n        </div>\n        <style>\n            .wrapper {\n                width: 80vw;\n                margin: 5em auto;\n            }\n        </style>\n    </body>\n</html>",
  async check(h) {
    const a=h.rect('.triangle');h.hover('.triangle');await h.frame();const animations=h.animations('.triangle');h.assert(animations.length>0,'回転にアニメーションを付けてください。');for(const animation of animations){const d=Number(animation.effect.getTiming().duration);h.assert(d>0,'回転が瞬時に切り替わっています。');animation.finish();}const s=h.css('.triangle'),m=new DOMMatrix(s.transform);h.near(m.a,-1,'180度回転させてください。',.03);h.near(m.d,-1,'180度回転させてください。',.03);const b=h.rect('.triangle');h.near((a.left+a.right)/2,(b.left+b.right)/2,'回転前後で中心がずれています。',2);h.near((a.top+a.bottom)/2,(b.top+b.bottom)/2,'回転前後で中心がずれています。',2);
  },
  previous: ["web-50-answer-1"],
  documentAnswer: true
};

export default grader;
