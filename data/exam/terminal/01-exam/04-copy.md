---
id: exam-terminal-04
number: 4
type: ターミナル
title: ~/notes フォルダに、中身が「こんにちは」の memo.txt を作ってください。さらに、同じ memo.txt を backup フォルダの中にも用意してください。
required: true
example:
  - 'echo こんにちは > memo.txt'
  - 'cp memo.txt backup/'
feedback: ~/notes と ~/notes/backup の両方に、中身が「こんにちは」の memo.txt がある状態にしてください。
---

```text label="完成形"
~/notes/
├── memo.txt        中身は「こんにちは」
└── backup/
    └── memo.txt    同じ中身
```
