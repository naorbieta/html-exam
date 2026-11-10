---
id: web-49
course: HTML・CSS・Web基礎
number: 49
title: YouTube動画埋め込み
---

今回は、埋め込みについて。

よく、YouTubeにアップロードされている動画を
サイトに埋め込んで使うということがあると思いますが、

動画の端が、切れて見えなくなったり
黒帯が出たりするのは、ちょっと格好悪いので、
なるべく回避したいところです。

埋め込みをきれいにする方法を
確認していきましょう。

<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="wrapper">
            <!-- ここに埋め込み -->
        </div>
        <style>
            .wrapper {
                width: 80vw;
                margin: 0 auto;
            }
        </style>
    </body>
</html>
