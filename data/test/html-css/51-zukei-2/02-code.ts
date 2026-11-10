import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"balloon\"></div>\n            <div class=\"trapezoid\"></div>\n        </div>\n        <style>\n            .wrapper {\n                width: 30vw;\n                margin: 5em auto;\n            }\n            .wrapper > * + * {\n                margin-top: 20em;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    const s=h.css('.trapezoid'),r=h.rect('.trapezoid');const points=h.polygon('.trapezoid');if(points.length){h.assert(points.some((p,i)=>{const n=points[(i+1)%points.length];return Math.abs(n[0]-p[0])>2&&Math.abs(n[1]-p[1])>2;}),'斜辺のある図形にしてください。');}h.near(r.width,h.rect('.wrapper').width,'図形をwrapperの幅いっぱいにしてください。');h.assert(r.height>30,'図形の高さがありません。');const ps=['::before','::after'].map(p=>h.css('.trapezoid',p));h.assert((s.clipPath.startsWith('polygon(')&&s.clipPath.split(',').length>=4)||ps.some(p=>p.content!=='none'&&(parseFloat(p.borderBottomWidth)>0||parseFloat(p.borderTopWidth)>0))||parseFloat(s.borderLeftWidth)>0,'図形の輪郭を確認してください。');h.assert(s.backgroundColor!=='rgba(0, 0, 0, 0)'||ps.some(p=>p.backgroundColor!=='rgba(0, 0, 0, 0)'),'図形が透明です。');
  },
  cases: [
    {
      width: 1200
    },
    {
      width: 900
    }
  ],
  documentAnswer: true
};

export default grader;
