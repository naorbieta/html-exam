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

問題データはアプリ本体とは別に、スプレッドシートへ置く1枚のCSVで載せます。CSVを差し替えると、設問・画像・採点処理ごと載せ替わります。スプレッドシート上で設問を直接編集する運用はしません。

1. `npm run build`を実行します。
2. 出力は次の2か所です。
   - `dist/app/` … GASへ貼り付けるアプリ（`.gs` / `.html` / `appsscript.json`）
   - `dist/sheets/practice.csv` … スプレッドシートへ取り込む問題データ（1ファイル）
3. [Googleスプレッドシート](https://sheets.google.com/)で新しい表を作り、`practice.csv`を取り込みます。インポート設定では、テキストの数値・日付・数式への変換をオフにします。取り込んだシート名を `問題データ` にします。CSVには設問・採点プログラム・参考画像が含まれ、現状は約20MBあります。大きなGIFを含むため、取り込みには時間がかかることがあります。
4. [Apps Script](https://script.google.com/)で新しいプロジェクトを作り、`dist/app/`内のファイルを同じ名前で作成して内容を貼り付けます。`.gs`はスクリプト、`.html`はHTMLとして作成します。`appsscript.json`はプロジェクト設定でマニフェストの表示を有効にして置き換えます。
5. スクリプトプロパティに `SPREADSHEET_ID` を設定し、エディターで `setup_` を一度実行します。回答を保存する `answers` シートが作成されます。URLは実行ログに表示されます。
6. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選びます。実行するユーザーを自分にし、初回はアクセスできるユーザーも自分に設定してデプロイします。
7. 発行されたURLで回答・採点を試します。回答とブラウザーでの採点結果が `answers` シートに記録されます。

データを載せ替えるときは、新しい `practice.csv` を同じ `問題データ` シートへ上書き取り込みます。アプリ本体の更新があるときだけ `dist/app/` を差し替えて、新しいバージョンをデプロイします。

GASではHTML内にCSSとJavaScriptを埋め込んで配信します。画面とコードの実行はブラウザー、問題の取得と回答の保存はGASが担当します。フォントはGoogle FontsからHTTPSで読み込みます。

旧構成（「レッスン」「設問」の2枚や、アプリに同梱したData.html）から更新する場合は、`dist/app/` を差し替えたうえで、新しいCSVを `問題データ` として取り込み、`SPREADSHEET_ID` を設定して `setup_` を実行してください。既存の回答記録はそのまま残せます。

## 問題を追加・編集する

正本は `data/test/` 以下のMarkdownとTypeScriptです。編集後に `npm run build` すると `dist/sheets/practice.csv` へ書き出されます。採点TSはビルド時にJavaScriptへコンパイルされ、CSVに埋め込まれるため、CSVの差し替えだけで採点も更新されます。

フォルダは1レッスン単位です。

```text
data/test/js/01-hajimete-no-javascript/
  lesson.md          レッスンの導入文と参考画像
  01-code.md         設問（問題文とメタデータ）
  01-code.ts         採点（コード問題など、判定が必要なとき）
  images/            素材
data/test/html-css/10-html-structure/
```

`js/` は「JavaScript / 初級」、`html-css/` は「HTML・CSS・Web基礎」です。具体的な書き方は[問題の編集手順](other/docs/editing-questions.md)を参照してください。

エディタ、プレビュー、採点エンジンはアプリ側（`src/`）にあり、各問題の採点TSはそれを呼び出して判定します。コードを書く問題は、模範解答の文字列と一致するかではなく、実行・描画した結果が条件を満たすかで判定します。レッスンの主題が特定の構文そのもの（例: `switch` 文を使う、テンプレートリテラルを使う）である場合に限り、ソース上の構文チェックを併用します。

HTMLのstyle要素は、エディタではindex.htmlとstyle.cssに分けて表示します。両ファイルの編集内容を保存し、採点時に結合します。コード問題はエディタの下にプレビューを表示します。JavaScriptは「実行」、HTML/CSSは編集後に更新されます。表示結果を予想する問題では、参照コードだけを表示します。コードを編集して調べる実習は「コード」「プレビュー」で表示を切り替えます。

学習用の採点結果はブラウザーで計算し、GASへ保存します。JavaScriptはWorkerで実行し、CSSは通信とスクリプト実行を制限したiframeで描画します。

## ソースと確認

```text
src/                 画面・採点エンジン・GASサーバー
data/test/           問題の正本（Markdown・TypeScript・素材）
data/grader.ts       採点TS用の型
dist/app/            GASへ配置するアプリ（ビルド成果）
dist/sheets/         スプレッドシートへ置くCSV（ビルド成果）
other/scripts/       ビルドとローカル表示
other/tests/         テスト
other/docs/          編集手順などの文書
other/archive/       本流に使わない資料・旧データ
```

```sh
npm test
npm run check:browser
npm run check:grading
npm run build
```

`npm run check:browser`で表示されるURLをブラウザーで開き、「検証する」を押すと、表示問題の解答例と誤答を実際に描画して検証します。検証ツールの実習では、本文・CSSの変更、回答の保存と復元、リセット後の再採点も検証します。結果は画面と一時フォルダ内の`results.txt`に出力します。

`npm run check:grading`は全設問について、正答・書式を変えた正答・空欄・初期コード・不正な選択などを検証します。表示されたURLで「検証する」を押すと、結果を画面と一時フォルダ内の`results.json`に出力します。

演習画面には[TutorialKit](https://github.com/stackblitz/tutorialkit)のナビゲーション、エディタ、標準テーマと左右の画面構成を使用しています。採点結果の表示とGASへの接続を組み込み、実行エンジンにはブラウザーのWorkerを使っています。DOM操作の採点には[LinkeDOM](https://github.com/WebReflection/linkedom)を使用しています。

TutorialKitはMITライセンスです。移植元と変更箇所は`src/vendor/tutorialkit/SOURCE.json`、配信するコードのライセンス本文はビルド時に生成する`THIRD_PARTY_NOTICES.md`を参照してください。
