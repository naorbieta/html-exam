---
id: exam-html-02
number: 2
type: 単一選択
title: |-
  ブラウザの初期状態で「インライン要素」なのはどれですか？
required: true
choices:
  - "div"
  - "p"
  - "h1"
  - "span"
answers:
  - "span"
feedback: "div・p・見出しはブロック要素、span はインライン要素です。"
---

- **ブロック要素**: 横幅いっぱいを使い、前後で改行されます。
- **インライン要素**: 文の途中に入り、前後で改行されません。

```preview height=150 label="表示例（色の付いた部分が要素の範囲）"
<section style="background:#dbeafe;padding:4px 8px">section（ブロック要素）は1行まるごと使います</section>
<p style="margin:12px 0 0">文章の途中に <strong style="background:#fde68a">strong（インライン要素）</strong> を入れても、前後で改行されません。</p>
```
