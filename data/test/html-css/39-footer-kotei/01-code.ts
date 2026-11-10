import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        *{\n            margin: 0;\n            padding: 0;\n        }\n        footer{\n            \n            height: 30px;\n            background-color: gray;\n        }\n       </style>\n</head>\n<body>\n    <main>\n        <h1>タイトル</h1>\n        <section> <!-- A -->\n            <h2>タイトル2</h2>\n            <div style=\"height:200px;background-color: red;\">コンテンツ</div>\n        </section>\n        <section> <!-- B -->\n            <h2>タイトル3</h2>\n            <div style=\"height:2000px;background-color: red;\">コンテンツ</div>\n        </section>\n    </main>\n    <footer>フッター</footer>\n</div>\n</body>\n</html>",
  async check(h) {
    h.near(h.rect('footer').bottom,innerHeight,'フッターを画面下端に固定してください。');h.near(h.rect('footer').width,document.documentElement.clientWidth,'フッターを画面の幅いっぱいにしてください。');window.scrollTo(0,500);await h.frame();h.near(h.rect('footer').bottom,innerHeight,'スクロールしてもフッターが画面下端に残るようにしてください。');
  },
  target: "footer",
  documentAnswer: true
};

export default grader;
