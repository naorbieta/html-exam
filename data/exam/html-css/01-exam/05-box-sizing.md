---
id: exam-html-05
number: 5
type: 単一選択
title: |-
  次のCSSを指定した .box の、画面上の横幅（border の外側の端から端まで）は何px になりますか？
required: true
choices:
  - "200px"
  - "250px"
  - "270px"
  - "150px"
answers:
  - "200px"
feedback: "box-sizing: border-box では、width の中に padding と border も含まれます（margin は含まれません）。"
---

```css label="style.css"
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid #333;
  margin: 10px;
}
```

```svg label="ボックスの各部分（外側から margin → border → padding → 内容）"
<svg viewBox="0 0 420 200" width="420" height="200" font-family="sans-serif" font-size="13">
  <rect x="5" y="5" width="410" height="190" fill="#fde7c8" stroke="#e0a458" stroke-dasharray="4 3"/>
  <text x="14" y="22" fill="#8a5a1a">margin</text>
  <rect x="40" y="32" width="340" height="136" fill="#555"/>
  <text x="48" y="48" fill="#fff">border</text>
  <rect x="52" y="54" width="316" height="104" fill="#c8e6c9"/>
  <text x="60" y="72" fill="#2e6b30">padding</text>
  <rect x="100" y="82" width="220" height="50" fill="#bbdefb" stroke="#4a8bd8"/>
  <text x="210" y="112" text-anchor="middle" fill="#1d4f91">内容（content）</text>
</svg>
```
