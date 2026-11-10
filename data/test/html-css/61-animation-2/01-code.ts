import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"box\">\n                <img src=\"https://i.postimg.cc/YCbHZBQR/sunset-7504891-1920.jpg\">\n            </div>\n        </div>\n        <style>\n            .wrapper {\n                width: 900px;\n                margin: 0 auto;\n            }\n            .box img {\n                width: 100%;\n                display: block;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    const animations=h.animations('.box').concat(h.animations('.box img'));h.assert(animations.length>0,'画像のアニメーションがありません。');const keys=animations.flatMap(a=>a.effect.getKeyframes());h.assert(keys.some(k=>/circle\(/.test(k.clipPath||'')),'画像を円形に切り抜いてください。');h.assert(keys.some(k=>/translate|matrix/.test(k.transform||'')||k.top),'円形の画像が跳ねる動きを設定してください。');h.assert(keys.some(k=>/circle\((?:100|150|200)%|none/.test(k.clipPath||'')),'最後に画像全体を表示してください。');
  },
  documentAnswer: true
};

export default grader;
