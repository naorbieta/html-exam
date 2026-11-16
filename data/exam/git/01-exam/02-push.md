---
id: exam-git-02
number: 2
type: ターミナル
title: ~/blog では about.html と style.css の2つが変更されています。about.html の変更だけをコミットして、リモート（origin）に送ってください。style.css の変更はコミットせず、手元に残します。
required: true
example:
  - 'git status'
  - 'git add about.html'
  - 'git commit -m "自己紹介を更新"'
  - 'git push'
feedback: about.html の変更だけを含むコミットがリモートにも届いていて、style.css の変更はコミットされずに手元に残っている状態にしてください。
---

```text label="はじめの状態"
~/blog/
├── index.html
├── about.html   変更あり → コミットしてリモートへ送る
└── style.css    変更あり → コミットしない（変更は残す）
```
