import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'terminal',
  initial: {
    "cwd": "~",
    "remotes": {
      "https://github.com/example/portfolio.git": {
        "commits": [
          {
            "message": "ポートフォリオを作成",
            "files": {
              "index.html": "<h1>Portfolio</h1>\n",
              "README.md": "# portfolio\n"
            }
          }
        ]
      }
    }
  },
  check(h) {
    const clones = h.repos().filter(repo => repo.remote === 'https://github.com/example/portfolio.git');
    h.assert(clones.length > 0, 'リポジトリがクローンされていません。URLを確認して git clone してください。');
    const repo = clones.find(item => item.root === h.cwd);
    h.assert(repo, 'クローンしたフォルダに cd で移動してください（pwd で確認できます）。');
    h.assert(h.read(repo.root + '/index.html') === '<h1>Portfolio</h1>\n' && h.read(repo.root + '/README.md') === '# portfolio\n', 'クローンしたフォルダにリモートのファイルがありません。');
  }
};

export default grader;
