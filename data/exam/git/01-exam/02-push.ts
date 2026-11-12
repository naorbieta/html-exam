import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'terminal',
  initial: {
    "cwd": "~/blog",
    "repos": {
      "~/blog": {
        "remote": "https://github.com/example/blog.git",
        "commits": [
          {
            "message": "ブログを作成",
            "files": {
              "index.html": "<h1>ブログ</h1>\n",
              "about.html": "<p>はじめまして</p>\n",
              "style.css": "body { margin: 0; }\n"
            }
          }
        ]
      }
    },
    "overrides": {
      "~/blog/about.html": "<p>はじめまして。Webデザインを勉強中です。</p>\n",
      "~/blog/style.css": "body { margin: 0; color: #333; }\n"
    }
  },
  check(h) {
    const repo = h.repo('~/blog');
    h.assert(repo, '~/blog のリポジトリが見つかりません。');
    h.assert(repo.log.length >= 2, 'まだコミットしていません。git add about.html のあと git commit -m "メッセージ" を実行してください。');
    h.assert(repo.log[0].files['about.html'] === '<p>はじめまして。Webデザインを勉強中です。</p>\n', 'about.html の変更がコミットされていません。');
    h.assert(repo.log.every(commit => commit.files['style.css'] === 'body { margin: 0; }\n'), 'style.css の変更までコミットされています。about.html だけを git add してください。');
    h.assert(h.read('~/blog/style.css') === 'body { margin: 0; color: #333; }\n', 'style.css の変更が消えています。変更は残したままにしてください。');
    const remote = h.remote('https://github.com/example/blog.git');
    h.assert(remote.branches.main === repo.head, 'リモートに push されていません。git push を実行してください。');
  }
};

export default grader;
