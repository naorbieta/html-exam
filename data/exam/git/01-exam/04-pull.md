---
id: exam-git-04
number: 4
type: ターミナル
title: ~/team のリモート（origin）には、チームメンバーが新しいコミットを push しています。git pull で main を最新にしてから、feature ブランチを作って切り替えてください。
required: true
example:
  - 'git pull'
  - 'git switch -c feature'
feedback: 先に git pull でリモートの変更を取り込み、そのあと git switch -c feature（または git checkout -b feature）でブランチを作って切り替えてください。
---
