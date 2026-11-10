---
id: quiz-08
course: JavaScript / 初級
number: 8
title: コメント
images:
  - file: images/quiz-08-01.png
    path: images/quiz-08-01.png
    alt: 第8問 コメントの参考画像
---

下に、例として、
体重と身長を入力してもらって、BMIを計算するプログラムを用意しました。

しかし、プログラムはコンピュータの言葉なので、
人間にとって読みやすいように意識していないと、

自分で書いたコードでさえ、何をしているプログラムなのか
よくわからなくなってしまいがちです。

それを回避するために、手軽にできることとして、

「コメント」を書いて、
どのような処理をしているのかメモを残すことができます。

それでは、例のプログラムを解読して、
何の処理をしているのかコメントを書いてみましょう。

let weight;
weight = prompt('まずはあなたの体重(kg)を入力してください');

let height;
height = prompt('次にあなたの身長(m)を入力してください');

let bmi = weight / (height * height);
let message = 'あなたのBMIは「' + bmi + '」です。';
alert(message);
