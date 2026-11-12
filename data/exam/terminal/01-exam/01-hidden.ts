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
    h.assert(!h.exists('~/work/.cache'), '隠しファイルが残っています。ls -a で「.」から始まるファイルを探して削除してください。');
    h.assert(h.read('~/work/index.html') === '<h1>トップ</h1>\n' && h.read('~/work/style.css') === 'h1 { color: navy; }\n' && h.isDir('~/work/images'), '削除するのは隠しファイルだけです。ほかのファイルやフォルダは残してください。');
    h.assert([...h.list('~/work')].sort().join(',') === 'images,index.html,style.css', '~/work の中身が変わっています。隠しファイルだけを削除してください。');
  }
};

export default grader;
