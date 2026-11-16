---
id: exam-html-25
number: 25
type: 単一選択
title: |-
  画面の幅が広いときはカードを3列、狭いときは自動で2列・1列に減らしたいです。
  .cards（display: grid）に指定する grid-template-columns として適切なものはどれですか？
required: true
choices:
  - "repeat(auto-fit, minmax(200px, 1fr))"
  - "200px 200px 200px"
  - "repeat(3, 1fr)"
  - "100%"
answers:
  - "repeat(auto-fit, minmax(200px, 1fr))"
feedback: "auto-fit と minmax を組み合わせると、入るだけ列を並べ、幅が足りなくなると列数が減ります。"
---

```svg label="画面の幅と列の数"
<svg viewBox="0 0 520 120" width="520" height="120" font-family="sans-serif" font-size="12">
  <text x="10" y="14" fill="#555">広い画面: 3列</text>
  <rect x="10" y="20" width="300" height="80" fill="none" stroke="#90a4ae"/>
  <rect x="18" y="28" width="90" height="30" fill="#bbdefb"/><rect x="115" y="28" width="90" height="30" fill="#bbdefb"/><rect x="212" y="28" width="90" height="30" fill="#bbdefb"/>
  <text x="340" y="14" fill="#555">狭い画面: 1列</text>
  <rect x="340" y="20" width="110" height="96" fill="none" stroke="#90a4ae"/>
  <rect x="348" y="26" width="94" height="26" fill="#bbdefb"/><rect x="348" y="56" width="94" height="26" fill="#bbdefb"/><rect x="348" y="86" width="94" height="26" fill="#bbdefb"/>
</svg>
```
