---
id: quiz-30
course: JavaScript / 初級
number: 30
title: 現在のループをスキップ
images:
  - file: images/quiz-30-01.png
    path: images/quiz-30-01.png
    alt: 第30問 現在のループをスキップの参考画像
  - file: images/quiz-30-02.png
    path: images/quiz-30-02.png
    alt: 第30問 現在のループをスキップの参考画像
---

前回は、breakを使って
繰り返しを途中で終了してみました。

しかし、終了するのではなく、
現在のループだけを中断して、
次の繰り返しに進みたいときはどうすればいいのでしょうか。

そんなときは、continueを使うことができます。

例えば、

(窓の汚れが消えるまで) {
	拭く;
	if (疲れてきた) {
		5分休憩;
		continue;  // 繰り返しの最初へ
	}
}

といった具合です。

では、問題です。
下の画像を見てください。

前回の例題を発展させて、
サイコロゲームを作りました。

下にコードを置いておくので
動かしてみてください。

1〜6の数字がランダムに出て、
6が出れば当たりです。
チャンスは5回あります。

しかし、これだけだとゲーム性が低いので、
もし、5が出たら、大ハズレということにして、
5回のチャンスが1回分なくなってしまうことにしようと思います。

この、5が出たら、1ターンスキップする分岐を
continueを使って追記し、

サイコロゲームを完成させてください！

コード
diceGame(5);

function diceGame(tryTimes) { // tryTimes: 抽選回数
    let hit = false; // 当たりが出たかどうかのフラグ
    alert('サイコロゲーム!\n\n6が出たら当たり!\nチャンスは' + tryTimes + '回!');
    for (let i = 1; i <= tryTimes; i++) {
        let diceResult = Math.floor(Math.random() * 6) + 1; // 1~6までの数値をランダムに生成
        console.log(i +'回目: ' + diceResult);
        if (diceResult === 6) {
            alert(i +'回目: ' + diceResult + '\n\n6が出た!\n当たり!👏');
            hit = true;
            break;
        }
        if (i < tryTimes) {
            alert(i +'回目: ' + diceResult + '\nハズレ!もう一回!');
        } else {
            alert(i +'回目: ' + diceResult + '\nハズレ!');
        }
    }
    if (!hit) { // 当たりが出ていない場合
        alert("終了!ざんねん!");
    }
}
