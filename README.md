# Web Practice

JavaScript、HTML・CSS、Web制作の基礎問題を、画面上で1問ずつ回答する学習アプリです。問題文を左のサイドに表示し、右側で回答・採点して次へ進みます。記述・選択問題は通常の回答欄、コード問題は言語に対応したTutorialKitのエディタを使います。スマホでは「問題」「解答」で切り替えます。回答・採点結果・途中の進捗を保存し、前の設問に戻って修正できます。

## ローカルで開く

Node.js 22以上を用意し、プロジェクトのフォルダで実行します。

```sh
npm ci
npm run dev
```

表示されたURLを開きます。回答・採点結果・進捗はブラウザーに保存されます。「回答を書き出す」でJSONを保存できます。

## GASへ配置する

問題データは `data/test/` が正本です。ビルドすると設問・採点・参考画像が `dist/app` の中（`Catalog.html` と分割した画像HTML）に埋め込まれ、アプリと一緒にデプロイされます。スプレッドシートには回答ログだけを記録します。

手元で初めて出すときは、Apps Script のスクリプトIDを `.clasp.json` に書き、`npx clasp login` のあと `npm run deploy` を実行します。詳細と GitHub Actions（`main` への push で自動デプロイ）の設定は[GASへの自動デプロイ](docs/deploy.md)を参照してください。

1. `npm run build`（または `npm run deploy`）を実行します。出力は `dist/app/` だけです。
2. `clasp` で `dist/app` をアップロードし、ウェブアプリとしてデプロイします。初回は「デプロイ」→「新しいデプロイ」→「ウェブアプリ」でも構いません。実行するユーザーを自分にし、アクセスできるユーザーもまず自分に設定します。
3. エディターで `setup_` を一度実行するか、スクリプトを記録用のスプレッドシートにバインドします。シートが無ければ「Web Practice 回答ログ」が作られ、`answers` シートに見出しが入ります。スクリプトプロパティ `SPREADSHEET_ID` に表のIDが保存されます。URLは実行ログに表示されます。
4. 発行されたURLで回答・採点を試します。回答は `answers` シートに、時刻・ユーザー（取得できる場合）・レッスンID・問題ID・回答内容・正誤・フィードバックとして残ります。

問題や画面を更新したあとは、もう一度 `npm run deploy`（または GitHub の `main` へ push）すれば、問題データも含めて置き換わります。以前の「問題データ」シートや `practice.csv` は不要です。既存の `answers` シートはそのまま使え、古い見出しは `setup_` で新しい列構成へ移行します。

GASではHTML内にCSSとJavaScriptを埋め込んで配信します。画面とコードの実行はブラウザー、問題の取得と回答の保存はGASが担当します。フォントはGoogle FontsからHTTPSで読み込みます。

## 問題を追加・編集する

正本は `data/test/` 以下のMarkdownとTypeScriptです。編集後に `npm run build` すると、採点TSがJavaScriptへコンパイルされ、問題データごと `dist/app` に埋め込まれます。

フォルダは1レッスン単位です。

```text
data/test/js/01-hajimete-no-javascript/
  lesson.md          レッスンの導入文と参考画像
  01-code.md         設問（問題文とメタデータ）
  01-code.ts         採点（コード問題など、判定が必要なとき）
  images/            素材
data/test/html-css/10-html-structure/
```

`js/` は「JavaScript / 初級」、`html-css/` は「HTML・CSS・Web基礎」です。具体的な書き方は[問題の編集手順](docs/editing-questions.md)を参照してください。

エディタ、プレビュー、採点エンジンはアプリ側（`src/`）にあり、各問題の採点TSはそれを呼び出して判定します。コードを書く問題は、模範解答の文字列と一致するかではなく、実行・描画した結果が条件を満たすかで判定します。レッスンの主題が特定の構文そのもの（例: `switch` 文を使う、テンプレートリテラルを使う）である場合に限り、ソース上の構文チェックを併用します。

HTMLのstyle要素は、エディタではindex.htmlとstyle.cssに分けて表示します。両ファイルの編集内容を保存し、採点時に結合します。コード問題はエディタの下にプレビューを表示します。JavaScriptは「実行」、HTML/CSSは編集後に更新されます。表示結果を予想する問題では、参照コードだけを表示します。コードを編集して調べる実習は「コード」「プレビュー」で表示を切り替えます。

学習用の採点結果はブラウザーで計算し、GASへ保存します。JavaScriptはWorkerで実行し、CSSは通信とスクリプト実行を制限したiframeで描画します。

## ソースと確認

```text
src/                 画面・採点エンジン・GASサーバー
src/scripts/         ビルドとローカル表示
src/tests/           テスト
data/test/           問題の正本（Markdown・TypeScript・素材）
data/grader.ts       採点TS用の型
dist/app/            GASへ配置するアプリと問題データ（ビルド成果）
docs/                編集手順などの文書
```

```sh
npm test
npm run check:browser
npm run check:grading
npm run build
npm run deploy
```

`npm run check:browser`で表示されるURLをブラウザーで開き、「検証する」を押すと、表示問題の解答例と誤答を実際に描画して検証します。検証ツールの実習では、本文・CSSの変更、回答の保存と復元、リセット後の再採点も検証します。結果は画面と一時フォルダ内の`results.txt`に出力します。

`npm run check:grading`は全設問について、正答・書式を変えた正答・空欄・初期コード・不正な選択などを検証します。表示されたURLで「検証する」を押すと、結果を画面と一時フォルダ内の`results.json`に出力します。

演習画面には[TutorialKit](https://github.com/stackblitz/tutorialkit)のナビゲーション、エディタ、標準テーマと左右の画面構成を使用しています。採点結果の表示とGASへの接続を組み込み、実行エンジンにはブラウザーのWorkerを使っています。DOM操作の採点には[LinkeDOM](https://github.com/WebReflection/linkedom)を使用しています。

TutorialKitはMITライセンスです。移植元と変更箇所は`src/vendor/tutorialkit/SOURCE.json`、配信するコードのライセンス本文はビルド時に生成する`THIRD_PARTY_NOTICES.md`を参照してください。
