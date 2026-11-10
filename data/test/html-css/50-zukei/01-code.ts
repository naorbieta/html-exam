import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"triangle\"></div>\n        </div>\n        <style>\n            .wrapper {\n                width: 80vw;\n                margin: 5em auto;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    const s=h.css('.triangle');let triangle=false;for(const p of [null,'::before','::after']){const c=h.css('.triangle',p),b=parseFloat(c.borderBottomWidth)||parseFloat(c.borderTopWidth),l=parseFloat(c.borderLeftWidth),r=parseFloat(c.borderRightWidth);if(b>0&&l>0&&r>0&&Math.abs(l-r)<1&&Math.abs(b/(l+r)-Math.sqrt(3)/2)<.03&&[c.borderBottomColor,c.borderTopColor].some(x=>x!=='rgba(0, 0, 0, 0)'))triangle=true;}if(s.clipPath.startsWith('polygon(')){const r=h.rect('.triangle');const points=h.polygon('.triangle');const sides=points.map((p,i)=>Math.hypot(p[0]-points[(i+1)%points.length][0],p[1]-points[(i+1)%points.length][1]));triangle=r.width>0&&points.length===3&&Math.min(...sides)>0&&Math.max(...sides)/Math.min(...sides)<1.04;}h.assert(triangle,'正三角形の辺の長さや塗りを確認してください。');
  },
  documentAnswer: true
};

export default grader;
