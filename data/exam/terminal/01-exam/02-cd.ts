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
    h.assert(!h.exists('~/site/css/docs'), 'docs が css フォルダの中にできています。docs を作る場所は ~/site です。');
    h.assert(h.isDir('~/site/docs'), '~/site に docs フォルダがありません。');
    h.assert(h.cwd === '~/site', 'いまいる場所が ~/site ではありません。');
    h.assert(h.read('~/site/index.html') === '<h1>サイト</h1>\n' && h.read('~/site/css/style.css') === 'body { margin: 0; }\n', 'もとからあるファイルは変更しないでください。');
  }
};

export default grader;
