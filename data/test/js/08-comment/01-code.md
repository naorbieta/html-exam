---
id: quiz-08-answer-2
number: 1
type: コード
title: プログラムの各処理について、コメントを挿入してください。
language: js
required: true
starter: |-
  let weight;
  weight = prompt('まずはあなたの体重(kg)を入力してください');

  let height;
  height = prompt('次にあなたの身長(m)を入力してください');

  let bmi = weight / (height * height);
  let message = 'あなたのBMIは「' + bmi + '」です。';
  alert(message);
example: |-
  // 体重を入力してもらう
  let weight = prompt('体重(kg)');
  // 身長を入力してもらう
  let height = prompt('身長(m)');
  // BMIを計算して表示する
  let bmi = weight / (height * height);
  alert('あなたのBMIは「' + bmi + '」です。');
feedback: BMIの計算処理を保ち、体重・身長・BMIの処理についてコメントを入れてください。
hint: プログラム全体を入力してください。コメントに「体重」「身長」「BMI」の説明があるかも確認します。
---
