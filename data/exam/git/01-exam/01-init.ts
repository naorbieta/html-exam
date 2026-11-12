import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'terminal',
  initial: {
    "cwd": "~/profile",
    "files": {
      "~/profile/index.html": "<h1>プロフィール</h1>\n"
    }
  },
  check(h) {
    const repo = h.repo('~/profile');
    h.assert(repo, '~/profile がGitのリポジトリになっていません。git init を実行してください。');
    h.assert(repo.log.length > 0, 'まだコミットがありません。git add のあと git commit -m "最初のコミット" を実行してください。');
    h.assert(repo.log[0].message === '最初のコミット', 'コミットメッセージを「最初のコミット」にしてください（git log で確認できます）。');
    h.assert(repo.log[0].files['index.html'] === '<h1>プロフィール</h1>\n', 'index.html がコミットに含まれていません。git add index.html を忘れていないか確認してください。');
  }
};

export default grader;
