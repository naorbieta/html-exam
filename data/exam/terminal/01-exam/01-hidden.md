---
id: exam-terminal-01
number: 1
type: ターミナル
title: ~/work フォルダには、ls だけでは表示されない隠しファイルが1つあります。ls -a で探して、その隠しファイルだけを削除してください。
required: true
example:
  - 'ls -a'
  - 'rm .cache'
feedback: ls -a で「.」から始まる隠しファイルを表示し、rm でそのファイルだけを削除してください。ほかのファイルやフォルダは消さないでください。
---
