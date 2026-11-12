import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'terminal',
  initial: {
    "cwd": "~/site",
    "files": {
      "~/site/index.html": "<img src=\"images/top.jpg\">\n",
      "~/site/style.css": "img { width: 100%; }\n",
      "~/site/script.js": "console.log('ok');\n",
      "~/site/top.jpg": "JPEG-top\n",
      "~/site/logo.png": "PNG-logo\n",
      "~/site/images/": ""
    }
  },
  check(h) {
    h.assert([...h.list('~/site/images')].sort().join(',') === 'logo.png,top.jpg', 'images フォルダの中身が「logo.png と top.jpg」の2つになるように移動してください。');
    h.assert(h.read('~/site/images/top.jpg') === 'JPEG-top\n' && h.read('~/site/images/logo.png') === 'PNG-logo\n', '移動した画像の中身が変わっています。');
    h.assert(!h.exists('~/site/top.jpg') && !h.exists('~/site/logo.png'), '~/site に画像が残っています。コピーではなく移動してください。');
    h.assert(h.isFile('~/site/index.html') && h.isFile('~/site/style.css') && h.isFile('~/site/script.js'), '画像以外のファイルは ~/site に残してください。');
  }
};

export default grader;
