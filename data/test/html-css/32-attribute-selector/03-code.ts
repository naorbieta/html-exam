import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <section>\n            <h1>クイズ第３２問！</h1>\n            <a href=\"https://example.com/\" target=\"_blank\">【１】この文字は赤色？</a>\n            <a href=\"#example\">【２】この文字は赤色？</a>\n            <a href=\"/question/\">【３】この文字は赤色？</a>\n            <a href=\"hogehoge.jpg\">【４】この文字は赤色？</a>\n            <a href=\"fugaguga.pdf\">【５】この文字は赤色？</a>\n        </section>\n        <section id=\"example\">\n            <h1>Example</h1>\n            <form action=\"#\" method=\"post\">\n                <!-- ③ ここから -->\n                <input type=\"text\" name=\"text1\">\n                <input type=\"text\" name=\"text2\">\n                <!-- ③ ここまで -->\n                <input type=\"submit\" name=\"button\">\n            </form>\n        </section>\n        <style>\n            /*  */\n            a[href^=\"#\"] {\n                color: red;\n            }\n            /* ② */\n            a[href$=\".pdf\"] {\n                color: red;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    const fields=h.all('input[type=text]');h.assert(fields.length===2,'2つのテキスト入力欄を残してください。');h.assert(fields.every(e=>e.getBoundingClientRect().width>200),'テキスト入力欄の幅を長くしてください。');h.assert(h.rect('input[type=submit]').width<200,'送信ボタンの幅は変更しないでください。');h.assert(fields.every(e=>h.rules(e).some(rule=>/\[[^\]]+\]/.test(rule.selectorText))),'属性セレクタを使ってください。');
  },
  documentAnswer: true
};

export default grader;
