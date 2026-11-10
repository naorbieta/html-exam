import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"box\">\n            <div class=\"box2\"></div>\n        </div>\n        <style>\n            .box {\n                width: 400px;\n                height: 400px;\n                background: #f00;\n            }\n            .box2 {\n                width: 100px;\n                height: 100px;\n                background: #0f0;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    for(const [w,z] of [[400,100],[520,70]]){h.el('.box').style.width=w+'px';h.el('.box').style.height=(w+40)+'px';h.el('.box2').style.width=z+'px';h.el('.box2').style.height=(z+20)+'px';const a=h.rect('.box'),b=h.rect('.box2');h.assert(['absolute','relative','fixed','sticky'].includes(h.css('.box2').position),'positionを使って配置してください。');h.near((b.left+b.right)/2,a.right,'box2の中心をboxの右下に合わせてください。');h.near((b.top+b.bottom)/2,a.bottom,'box2の中心をboxの右下に合わせてください。');}
  },
  documentAnswer: true
};

export default grader;
