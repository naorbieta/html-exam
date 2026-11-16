import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'terminal',
  initial: {
    "cwd": "~/work",
    "files": {
      "~/work/index.html": "<h1>トップ</h1>\n",
      "~/work/style.css": "h1 { color: navy; }\n",
      "~/work/.cache": "temp\n",
      "~/work/images/": ""
    }
  },
  check(h) {
    h.assert(!h.exists('~/work/.cache'), '隠しファイルがまだ ~/work に残っています。');
    h.assert(h.read('~/work/index.html') === '<h1>トップ</h1>\n' && h.read('~/work/style.css') === 'h1 { color: navy; }\n' && h.isDir('~/work/images'), '隠しファイル以外のファイルやフォルダまで変わっています。残すものは残してください。');
    h.assert([...h.list('~/work')].sort().join(',') === 'images,index.html,style.css', '~/work の中身が、はじめの状態から隠しファイルを除いたものと違います。');
  }
};

export default grader;
