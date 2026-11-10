import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head>\n        <!-- 【ここに何か必要】 -->\n    </head>\n    <body>\n        <div class=\"wrapper\">\n            <ul>\n                <li class=\"box\">\n                    <h1>タイトル</h1>\n                    <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>\n                </li>\n                <li class=\"box\">\n                    <h1>タイトル</h1>\n                    <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>\n                </li>\n                <li class=\"box\">\n                    <h1>タイトル</h1>\n                    <p>テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト</p>\n                </li>\n            </ul>\n        </div>\n    </body>\n    <style>\n        .wrapper {\n            width: 900px;\n            margin: 0 auto;\n        }\n        ul {\n            display: flex;\n            list-style-type: none;\n        }\n        .box {\n            width: calc(100% / 3);\n            background: #ccc;\n        }\n    </style>\n</html>",
  check(h) {
    const a=h.rect('li:nth-child(1)'),b=h.rect('li:nth-child(2)');if(innerWidth<600){h.assert(b.top>=a.bottom-1,'スマホ幅では縦に並べてください。');h.assert(h.rect('.wrapper').right<=innerWidth+1&&a.right<=innerWidth+1,'コンテンツが画面からはみ出しています。');}else{h.near(a.top,b.top,'PC幅では横並びを維持してください。');}
  },
  cases: [
    {
      width: 1200
    },
    {
      width: 390
    }
  ],
  documentAnswer: true,
  previous: ["web-45-answer-1"]
};

export default grader;
