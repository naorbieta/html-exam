---
id: quiz-49-answer-2
number: 1
type: コード
title: |-
  ①(画像参照)
  これをテンプレートリテラルを使って、
  置き換えてください。
language: js
required: true
starter: |-
  let friendName = "太郎";
  let message = "こんにちは、" + friendName + "!\n今日は何をしましょうか?\n公園で遊ぶのはどうですか?";
  console.log(message);
example: |-
  let message = `こんにちは、${friendName}！
  今日は何をしましょうか？
  公園で遊ぶのはどうですか？`;
  console.log(message);
feedback: バッククォートと${}を使い、名前と改行を含む同じ文章を表示してください。
hint: friendName="太郎"は用意されています。
---
