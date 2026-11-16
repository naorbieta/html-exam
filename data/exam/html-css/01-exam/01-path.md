---
id: exam-html-01
number: 1
type: 単一選択
title: |-
  index.html に、images フォルダの中にある logo.png を表示します。
  img の src に書く相対パスとして正しいものはどれですか？
required: true
choices:
  - "images/logo.png"
  - "/images/logo.png"
  - "../images/logo.png"
  - "css/logo.png"
answers:
  - "images/logo.png"
feedback: "index.html と同じ階層にある images フォルダを、相対パスで指定します。"
---

```text label="フォルダ構成"
プロジェクト/
├── index.html      ← このファイルに書きます
├── images/
│   └── logo.png    ← 表示したい画像
└── css/
    └── style.css
```

```html label="index.html"
<img src="？？？" alt="ロゴ">
```
