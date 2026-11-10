import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <table>\n                <tr>\n                    <th>新宿駅</th>\n                    <td>2,404,763人</td>\n                    <td>東京都</td>\n                </tr>\n                <tr>\n                    <th>渋谷駅</th>\n                    <td>2,284,302人</td>\n                    <td>東京都</td>\n                </tr>\n                <tr>\n                    <th>池袋駅</th>\n                    <td>1,926,362人</td>\n                    <td>東京都</td>\n                </tr>\n                <tr>\n                    <th>横浜駅</th>\n                    <td>1,673,613人</td>\n                    <td>神奈川県</td>\n                </tr>\n                <tr>\n                    <th>梅田駅</th>\n                    <td>838,158人</td>\n                    <td>大阪府</td>\n                </tr>\n            </table>\n        </div>\n    </body>\n    <style>\n        .wrapper {\n            width: 900px;\n            margin: 0 auto;\n        }\n        table {\n            width: 100%;\n        }\n        th, td {\n            border: 1px solid #333;\n        }\n    </style>\n</html>",
  check(h) {
    h.assert(h.css('table').borderCollapse==='collapse','セルの枠線が二重になっています。');
  },
  documentAnswer: true
};

export default grader;
