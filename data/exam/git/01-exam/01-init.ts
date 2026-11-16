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
    h.assert(repo, '~/profile がまだGitのリポジトリになっていません。');
    h.assert(repo.log.length > 0, 'まだコミットがありません。');
    h.assert(repo.log[0].message === '最初のコミット', 'コミットメッセージが「最初のコミット」になっていません。');
    h.assert(repo.log[0].files['index.html'] === '<h1>プロフィール</h1>\n', 'index.html がコミットに含まれていません。');
  }
};

export default grader;
