---
id: exam-html-16
number: 16
type: 単一選択
title: |-
  同じページの下のほうに、次の見出しがあります。
  この見出しへ移動するリンクとして正しいものはどれですか？
required: true
choices:
  - "<a href=\"contact\">お問い合わせへ</a>"
  - "<a href=\"#contact\">お問い合わせへ</a>"
  - "<a href=\"/contact\">お問い合わせへ</a>"
  - "<a id=\"contact\">お問い合わせへ</a>"
answers:
  - "<a href=\"#contact\">お問い合わせへ</a>"
feedback: "同じページ内の移動には、href に「#」と移動先の id を書きます。"
---

```html label="移動先の見出し"
<h2 id="contact">お問い合わせ</h2>
```
