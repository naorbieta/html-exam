import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'terminal',
  initial: {
    "cwd": "~/team",
    "repos": {
      "~/team": {
        "remote": "https://github.com/example/team.git",
        "commits": [
          {
            "message": "チームサイトを作成",
            "files": {
              "index.html": "<h1>チーム</h1>\n"
            }
          }
        ]
      }
    },
    "remotes": {
      "https://github.com/example/team.git": {
        "commits": [
          {
            "message": "チームサイトを作成",
            "files": {
              "index.html": "<h1>チーム</h1>\n"
            }
          },
          {
            "message": "お知らせを追加",
            "files": {
              "index.html": "<h1>チーム</h1>\n",
              "news.html": "<p>お知らせ</p>\n"
            }
          }
        ]
      }
    }
  },
  check(h) {
    const repo = h.repo('~/team');
    h.assert(repo, '~/team のリポジトリが見つかりません。');
    const remote = h.remote('https://github.com/example/team.git');
    h.assert(repo.branches.main === remote.branches.main, 'main がリモートの最新になっていません。git pull を実行してください。');
    h.assert(repo.branches.feature, 'feature ブランチがありません。');
    h.assert(repo.branch === 'feature', 'feature ブランチに切り替えてください（git branch で確認できます）。');
    h.assert(repo.branches.feature === repo.branches.main, 'feature は最新の main から作ってください。先に git pull してからブランチを作ります。');
    h.assert(h.read('~/team/news.html') === '<p>お知らせ</p>\n', 'リモートで追加された news.html がありません。');
  }
};

export default grader;
