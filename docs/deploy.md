# GASへの自動デプロイ

問題の正本は `data/test/` です。`npm run build` で `dist/app` にアプリ本体と問題データ（Catalog.html と分割した画像HTML）を出力します。スプレッドシートには回答ログだけを記録します。

## 手元で初めてデプロイする

1. [Google Apps Script](https://script.google.com/) で新しいプロジェクトを作り、プロジェクト設定画面でスクリプトIDをコピーします。
2. 雛形をコピーしてIDを書きます。

   ```sh
   cp .clasp.json.example .clasp.json
   ```

   `scriptId` を実際のIDに書き換えます。`rootDir` は `dist/app` のままにします。`.clasp.json` は Git に入れません。
3. Google アカウントで clasp にログインします。

   ```sh
   npx clasp login
   ```

   認証情報は `~/.clasprc.json` に保存されます。
4. ビルドしてコードをアップロードし、ウェブアプリとしてデプロイします。

   ```sh
   npm run deploy
   ```

   `npm run push` はビルドと `clasp push` だけです。既存のウェブアプリURLを更新し続ける場合は、初回に「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を手動で1回作り、そのデプロイIDを控えて `npx clasp deploy -i デプロイID` を使います。
5. 回答ログ用の表を用意します。スクリプトをスプレッドシートにバインドするか、エディターで `setup_` を1回実行します。`setup_` は、スクリプトプロパティ `SPREADSHEET_ID` が無ければ新しいスプレッドシート「Web Practice 回答ログ」を作り、`answers` シートを用意します。シートが既にあればそれを使います。URLは実行ログに出ます。
6. ウェブアプリのURLで動作を確認します。回答すると `answers` シートに、時刻・ユーザー（取得できる場合）・問題ID・回答・正誤・フィードバックが残ります。ウェブアプリの「実行するユーザー」が自分自身で、アクセスが学外の一般アカウントのときは、メールアドレスが空欄になることがあります。

## GitHub Actions で main への push 時にデプロイする

リポジトリの Settings → Secrets and variables → Actions に次を追加します。

| Secret | 内容 |
| --- | --- |
| `CLASPRC_JSON` | `clasp login` のあと、`~/.clasprc.json` の中身をそのまま貼り付けます |
| `SCRIPT_ID` | Apps Script のスクリプトID（`.clasp.json` の `scriptId` と同じ） |
| `DEPLOYMENT_ID` | （推奨）既存ウェブアプリのデプロイID。未設定だとコードの push だけで、公開URLは更新されません |

`main` に push すると、`.github/workflows/deploy.yml` が `npm run build` → `clasp push` を実行し、`DEPLOYMENT_ID` があればそのデプロイを更新します。

認証情報はリポジトリに置かず、Secrets だけに保存してください。ログイン状態が切れたら、手元で `npx clasp login` をやり直して `CLASPRC_JSON` を更新します。

## 画像ファイルの分割について

参考画像の合計は十数MBあり、特に大きなGIFは単体でも数MBあります。Apps Script の1ファイルあたりのサイズ制限に当たらないよう、ビルド時に `Images01.html` のように分割して埋め込んでいます。1ファイルはおよそ 4.5MB までです。問題一覧（画像なし）は約0.4MBで `Catalog.html` に入ります。

`clasp push` がサイズで失敗する場合は、ログを残して相談してください。
