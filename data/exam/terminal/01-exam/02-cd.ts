import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'terminal',
  initial: {
    "cwd": "~/site/css",
    "files": {
      "~/site/index.html": "<h1>サイト</h1>\n",
      "~/site/css/style.css": "body { margin: 0; }\n"
    }
  },
  check(h) {
    h.assert(!h.exists('~/site/css/docs'), 'docs が css フォルダの中に作られています。先に cd .. で ~/site に移動してください。');
    h.assert(h.isDir('~/site/docs'), '~/site に docs フォルダがありません。');
    h.assert(h.cwd === '~/site', '最後は ~/site にいる状態にしてください（pwd で確認できます）。');
    h.assert(h.read('~/site/index.html') === '<h1>サイト</h1>\n' && h.read('~/site/css/style.css') === 'body { margin: 0; }\n', 'もとからあるファイルは変更しないでください。');
  }
};

export default grader;
