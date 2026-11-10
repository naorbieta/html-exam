import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <blockquote class=\"haiku\">\n                <p>五月雨を<br>集めてはやし<br>最上川</p>\n                <p class=\"author\">松尾芭蕉<br>(寛永<span class=\"digits\">21</span>年 - 元禄<span class=\"digits\">7</span>年)</p>\n            </blockquote>\n        </div>\n        <style>\n            .wrapper {\n                width: 30vw;\n                margin: 0 auto;\n            }\n            .haiku {\n                width: 100%;\n                display: flex;\n                flex-direction: column;\n                justify-content: center;\n                margin: 0;\n                border: 3px solid green;\n                line-height: 2;\n                padding: 20% 10%;\n                box-sizing: border-box;\n            }\n            .author {\n                margin-top: 3em;\n            }\n            .author:before {\n                content: '―――';\n                margin-top: -3em;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    h.assert(['vertical-rl','vertical-lr'].includes(h.css('.haiku').writingMode),'俳句を縦書きにしてください。');
  },
  documentAnswer: true
};

export default grader;
