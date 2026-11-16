---
id: exam-js-09
number: 9
type: コード
title: |-
  関数 showAll を完成させてください。
  受け取った配列 list の中身を、for 文または while 文で1つずつ console.log します。
language: js
required: true
starter: |-
  function showAll(list) {
    // ここに書いてください
  }

  // 試しに呼び出して確かめられます（「実行」で表示されます）
  showAll(['りんご', 'みかん', 'ぶどう']);

example: |-
  function showAll(list) {
    for (let i = 0; i < list.length; i++) {
      console.log(list[i]);
    }
  }
feedback: "for 文または while 文を使い、配列の要素を1つずつ console.log してください。"
---

表示の例（りんご・みかん・ぶどう の配列を渡したとき）

```text label="コンソール"
りんご
みかん
ぶどう
```

採点では、中身や個数の違う配列でも showAll を呼び出して確かめます。
