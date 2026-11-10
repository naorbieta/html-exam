import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<style>\nul{\n            width: 300px;\n            height: 300px;\n            list-style: none;\n            border: 3px solid black;\n        }\n        li{\n            width: 100px;\n            height: 100px;\n            background-color: red;\n        }\n        li.center{\n            width: 200px;\n            height: 200px;\n            background-color: blue;\n        }\n        li.right{\n        }\n</style>\n\n\n<ul>\n        <li class=\"left\">左</li>\n        <li class=\"center\">中</li>\n        <li class=\"right\">右</li>\n    </ul>",
  check(h) {
    const p=h.rect('ul'),a=h.rect('.left'),b=h.rect('.center'),c=h.rect('.right');h.near(a.left,p.left+3,'左の箱を枠の左上に配置してください。');h.near(a.top,p.top+3,'左の箱を枠の左上に配置してください。');h.near(c.right,p.right-3,'右の箱を枠の右下に配置してください。');h.near(c.bottom,p.bottom-3,'右の箱を枠の右下に配置してください。');h.near((b.left+b.right)/2,(p.left+p.right)/2,'青い箱を枠の中央に配置してください。');h.near((b.top+b.bottom)/2,(p.top+p.bottom)/2,'青い箱を枠の中央に配置してください。');
  },
  documentAnswer: true
};

export default grader;
