---
id: quiz-35
course: JavaScript / 初級
number: 35
title: 背景色を変更する
images:
  - file: images/quiz-35-01.png
    path: images/quiz-35-01.png
    alt: 第35問 背景色を変更するの参考画像
---

前回は、文字色のスタイルをJavaScriptで変更しましたが、
もちろん、他のスタイルも同じように変更することが可能です。

しかし、下の画像のように
試しに背景色を変更しようとしたところ

エラーとなり、なぜか背景色が変わってくれません。
なぜでしょうか？

実は、「background-color」など、
CSSのプロパティ名でハイフンが使われている場合
JS上ではこのまま使用できません。

では、どのようにすればよいのでしょうか？
