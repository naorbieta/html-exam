import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"box\"></div>\n        </div>\n        <style>\n            * {\n                box-sizing: border-box;\n            }\n            .wrapper {\n                width: 900px;\n                margin: 0 auto;\n                padding: 5em 0;\n            }\n            .box {\n                width: 100px;\n                height: 100px;\n                background: linear-gradient(to bottom, #FFC778, #F89174 50%, #748af8);\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    const animations=h.animations('.box');h.assert(animations.length>0,'回転するアニメーションがありません。');const a=animations[0],keys=a.effect.getKeyframes();h.assert(Number(a.effect.getTiming().duration)>0,'アニメーションの時間を設定してください。');const angles=keys.map(k=>{const m=String(k.transform||'').match(/rotate(?:Z)?\(([-.\d]+)(deg|turn|rad)\)/);return m?Number(m[1])*(m[2]==='turn'?360:m[2]==='rad'?180/Math.PI:1):0;});h.assert(Math.max(...angles)>720&&Math.max(...angles)<900,'2回転を少し超えてから戻る動きを設定してください。');h.assert(Math.abs(angles.at(-1)-720)<1,'最後は2回転の定位置に戻してください。');h.sample(a,1);h.near(new DOMMatrix(h.css('.box').transform).a,1,'最後の回転角を確認してください。',.03);
  },
  documentAnswer: true
};

export default grader;
