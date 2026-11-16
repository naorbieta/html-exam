---
id: exam-html-15
number: 15
type: 単一選択
title: |-
  親要素の幅が 500px のとき、子要素に width: calc(100% - 40px); を指定しました。
  子要素の幅は何px になりますか？
required: true
choices:
  - "460px"
  - "500px"
  - "540px"
  - "40px"
answers:
  - "460px"
feedback: "calc() では、% と px など単位の違う値も計算できます。親の幅 500px から 40px を引きます。"
---

```svg label="親要素（500px）と子要素"
<svg viewBox="0 0 520 110" width="520" height="110" font-family="sans-serif" font-size="13">
  <rect x="10" y="10" width="500" height="90" fill="#eceff1" stroke="#90a4ae"/>
  <text x="18" y="28" fill="#455a64">親要素 width: 500px</text>
  <rect x="10" y="40" width="460" height="44" fill="#bbdefb" stroke="#1e88e5"/>
  <text x="20" y="67" fill="#0d47a1">子要素 width: calc(100% - 40px) → ？px</text>
</svg>
```
