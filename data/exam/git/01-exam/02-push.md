---
id: exam-git-02
number: 2
type: ターミナル
title: ~/blog では about.html と style.css が変更されています。about.html の変更だけをコミットして、リモート（origin）に push してください。style.css の変更は消さずに残します。
required: true
example:
  - 'git status'
  - 'git add about.html'
  - 'git commit -m "自己紹介を更新"'
  - 'git push'
feedback: git status で変更を確認し、git add about.html で about.html だけをステージに追加してコミットし、git push で送ってください。git add . や git commit -a だと style.css も含まれます。
---
