---
id: exam-js-03
number: 3
type: コード
title: |-
  関数 judge を完成させてください。
  点数 score が 60 以上なら「合格」、60 未満なら「不合格」という文字列を return します。
language: js
required: true
starter: |-
  function judge(score) {
    // ここに書いてください
  }

  // 試しに呼び出して確かめられます（「実行」で表示されます）
  console.log(judge(80)); // 合格 になればOK
  console.log(judge(59)); // 不合格 になればOK

example: |-
  function judge(score) {
    if (score >= 60) {
      return '合格';
    } else {
      return '不合格';
    }
  }
feedback: "60 以上のときは「合格」、60 未満のときは「不合格」を return してください。"
---

- 80点 → 「合格」
- 60点（ちょうど）→ 「合格」
- 59点 → 「不合格」

採点では、いろいろな点数で judge を呼び出して確かめます。
