import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <input id=\"acd-lock\" class=\"acd-lock\" type=\"checkbox\">\n        <input id=\"acd-check\" class=\"acd-check\" type=\"checkbox\">\n        <label class=\"acd-label\" for=\"acd-check\">クリックで開く</label>\n        <div class=\"acd-content\">\n            <p>クイズ第４１問</p>\n        </div>\n        <style>\n            .acd-check{\n                display: none;\n            }\n            .acd-label{\n                background: #333;\n                color: #fff;\n                display: block;\n                margin-bottom: 1px;\n                padding: 10px;\n            }\n            .acd-content{\n                border: 1px solid #333;\n                height: 0;\n                opacity: 0;\n                padding: 0 10px;\n                visibility: hidden;\n            }\n            .acd-check:checked + .acd-label + .acd-content{\n                height: 40px;\n                opacity: 1;\n                padding: 10px;\n                visibility: visible;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    h.assert(h.css('.acd-label').cursor==='pointer','開閉ラベルにポインターを設定してください。');
  },
  documentAnswer: true
};

export default grader;
