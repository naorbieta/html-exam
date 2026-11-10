import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"box\">\n                <img src=\"https://i.postimg.cc/YCbHZBQR/sunset-7504891-1920.jpg\">\n            </div>\n        </div>\n        <style>\n            .wrapper {\n                width: 900px;\n                margin: 0 auto;\n            }\n            .box img {\n                width: 100%;\n                display: block;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    h.assert(new RegExp('grayscale\\((?!0(?:px|deg)?\\))').test(h.css('img').filter),'画像に指定された効果が適用されていません。');
  },
  target: "img",
  documentAnswer: true
};

export default grader;
