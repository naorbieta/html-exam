---
id: quiz-23-answer-2
number: 1
type: コード
title: |-
  画像のコードをフォールスルーを使用した
  ○日、○時間、○分を秒に変換するプログラムになるように書き換えましょう。
language: js
required: true
starter: |-
  let unit = prompt("変換する単位を入力してください（日、時間、分）");
  let value = parseFloat(prompt("変換する値を入力してください"));
  let seconds = value;

  switch (unit) {
    case "日":
      seconds *= 24;
      break;
    case "時間":
      seconds *= 60;
      break;
    case "分":
      seconds *= 60;
      break;
    default:
      alert("不正な入力です");
  }
  alert(value + unit + "は" + seconds + "秒です");
example: |-
  const unit=prompt('単位');
  const value=Number(prompt('数値'));
  let seconds=value;
  switch(unit){
   case '日': seconds*=24;
   case '時間': seconds*=60;
   case '分': seconds*=60; break;
   default: alert('不正な入力です');
  }
  alert(value+unit+'は'+seconds+'秒です');
feedback: 日を指定した場合にも、時間・分の倍率を続けて掛けてください。
hint: switchのフォールスルーを使って、プログラム全体を入力してください。
---
