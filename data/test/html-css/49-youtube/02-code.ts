import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <iframe title=\"動画\"></iframe>\n        </div>\n        <style>\n            .wrapper {\n                width: 80vw;\n                margin: 0 auto;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    const a=h.rect('.wrapper'),b=h.rect('iframe');h.near(b.width,a.width,'動画をwrapperの幅いっぱいにしてください。');h.near(b.width/b.height,16/9,'動画の縦横比を16:9にしてください。',.03);
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
  previous: ["web-49-answer-1"]
};

export default grader;
