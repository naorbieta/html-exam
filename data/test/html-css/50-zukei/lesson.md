---
id: web-50
course: HTML・CSS・Web基礎
number: 50
title: CSSで図形を描こう
images:
  - file: images/web-50-01.png
    path: images/web-50-01.png
    alt: 説明のない画像
---

Webサイトに、三角形や円など、
図形を掲載したいというとき、

簡単な図形であれば
画像をペタッと貼り付けるのではなく、
CSSでつくるということはよくあります。

画像にした場合、
変更があった際には、一回一回、
Photoshopなどの画像編集ソフトを使わないといけないのに対して、

CSSで作った場合は、
コードをちょっと加えれば、簡単に色や大きさを変更できる
などのメリットがあります。

今回は、CSSで
正三角形を描いてみましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <div class="triangle"></div>
        </div>
        <style>
            .wrapper {
                width: 80vw;
                margin: 5em auto;
            }
        </style>
    </body>
</html>
