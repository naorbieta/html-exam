---
id: quiz-50-answer-2
number: 1
type: コード
title: 画像とキャプションが切り替わるスライダーを、HTML・CSS・JSで作成してください。
language: html
required: true
starter: |-
  <!doctype html>
  <html lang="ja">
  <body>
    <img id="main-image" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20360%22%3E%3Crect%20width%3D%22600%22%20height%3D%22360%22%20fill%3D%22%23247ba0%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%22210%22%20font-size%3D%22100%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E1%3C%2Ftext%3E%3C%2Fsvg%3E" alt="メイン画像">
    <p id="caption">キャプション1</p>
    <img class="thumbnail" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20360%22%3E%3Crect%20width%3D%22600%22%20height%3D%22360%22%20fill%3D%22%23247ba0%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%22210%22%20font-size%3D%22100%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E1%3C%2Ftext%3E%3C%2Fsvg%3E" data-caption="キャプション1" alt="画像1">
    <img class="thumbnail" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20360%22%3E%3Crect%20width%3D%22600%22%20height%3D%22360%22%20fill%3D%22%2370c1b3%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%22210%22%20font-size%3D%22100%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E2%3C%2Ftext%3E%3C%2Fsvg%3E" data-caption="キャプション2" alt="画像2">
    <img class="thumbnail" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20360%22%3E%3Crect%20width%3D%22600%22%20height%3D%22360%22%20fill%3D%22%23f3a712%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%22210%22%20font-size%3D%22100%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E3%3C%2Ftext%3E%3C%2Fsvg%3E" data-caption="キャプション3" alt="画像3">
    <script>
      // サムネイルをクリックすると、画像と説明を切り替えてください
    </script>
  </body>
  </html>
example: |-
  <!doctype html>
  <html lang="ja">
  <body>
    <img id="main-image" src="image-1.jpg" alt="メイン画像">
    <p id="caption">キャプション1</p>
    <img class="thumbnail" src="image-1.jpg" data-caption="キャプション1" alt="画像1">
    <img class="thumbnail" src="image-2.jpg" data-caption="キャプション2" alt="画像2">
    <img class="thumbnail" src="image-3.jpg" data-caption="キャプション3" alt="画像3">
    <script>
      document.querySelectorAll('.thumbnail').forEach(thumb=>{
        thumb.addEventListener('click',()=>{
          document.getElementById('main-image').src=thumb.src;
          document.getElementById('caption').textContent=thumb.dataset.caption;
        });
      });
    </script>
  </body>
  </html>
feedback: サムネイルをクリックしたときに、対応する大きな画像と説明を切り替えてください。
hint: HTML・CSS・JSを1つのHTMLとして入力します。ひな形のID・class・data-captionを使ってください。見た目の装飾は採点対象に含みません。
---
