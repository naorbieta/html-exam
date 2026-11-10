# 問題の編集手順

正本は `data/test/` のレッスンフォルダです。編集したら `npm run build` で `dist/sheets/practice.csv` を作り、スプレッドシートの「問題データ」シートへ取り込みます。

## レッスンの置き方

```text
data/test/js/01-hajimete-no-javascript/     JavaScript / 初級
data/test/html-css/10-html-structure/       HTML・CSS・Web基礎
```

フォルダ名は `{レッスン番号2桁}-{スラッグ}` にします。番号は分野ごとに付け、欠番があってもそのまま使います。各フォルダには `lesson.md` と、設問ごとの Markdown を置きます。採点が必要な設問には、同じ名前の TypeScript を添えます。画像は `images/` に入れ、`lesson.md` から参照します。

### lesson.md

```markdown
---
id: quiz-01
course: JavaScript / 初級
number: 1
title: はじめてのJavaScript
images:
  - file: images/quiz-01-01.png
    path: images/quiz-01-01.png
    alt: 第1問 はじめてのJavaScriptの参考画像
---

導入文をここに書きます。
```

`id` は既存の回答記録と対応させるため、公開後は変更しません。`path` はアプリが画像を識別する名前です。通常は `images/` に元のファイル名を付けます。

### 設問の Markdown

```markdown
---
id: quiz-03-answer-1
number: 1
type: 短文
title: |-
  ①
  console.log(8 + 2);
  コンソールに出力される結果は何でしょう？
required: true
answers:
  - "10"
feedback: 出力結果や用語をもう一度確認してください。
---
```

| 項目 | 内容 |
| --- | --- |
| `id` | 設問ID。公開後は変更しません |
| `number` | レッスン内の設問番号 |
| `type` | `短文` / `長文` / `単一選択` / `複数選択` / `コード` / `ページ編集` / `CSS調査` / `ファイル` |
| `title` | 設問文 |
| `choices` | 選択問題の選択肢 |
| `answers` | 正解（選択問題は選択肢の文言そのもの。複数選択は複数行） |
| `language` | コード問題の `js` / `html` / `css` |
| `starter` | 初期コード |
| `example` | 解答例（コードや登録済み採点で使う） |
| `feedback` | 不正解時のメッセージ |
| `hint` | ヒント |
| `context` | 補足 |
| `required` | 省略時は必須 |
| `reference_editable` | 参照コードを編集して調べる実習のとき `true` |
| `method` | 採点TSが無いときの採点方法。`コンソール出力` や `ファイル拡張子` |

フロントマターの下の本文は、必要なら「設問の説明」として表示します。前後の空白・全角と半角・英字の大文字と小文字の違いは、正解との照合では無視します。

## 選択問題・記述問題

選択問題は `type: 単一選択` または `複数選択` にし、`choices` と `answers` を書きます。選択肢は画面でランダムに並びます。正解は番号ではなく、選択肢の文言をそのまま書きます。採点TSは不要です。

記述問題は `type: 短文` または `長文` にし、許容する答えを `answers` に1行ずつ書きます。値や名称など、答えを列挙できる設問に使います。説明文の意味を自動で読み取る採点には使いません。

## コード問題

`type: コード` にし、必要なら `starter` と `language` を書きます。同じファイル名の `.ts` に採点を書きます。

```ts
import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: 'code',
  check(h) {
    h.assert(h.logText().includes('Hello World!'), 'Hello World! の大文字・空白・記号を確認してください。');
  },
};

export default grader;
```

`kind` は `code`（JavaScriptの実行結果）または `render`（HTML/CSSの表示結果）です。表示の採点では `h.css('p').color` や `h.rect('.box')` のように、描画結果を検証します。コンソールへ期待する出力だけを見る簡単な問題は、TSの代わりに frontmatter で次のようにも書けます。

```yaml
type: コード
language: js
method: コンソール出力
answers:
  - "10"
starter: |
  console.log();
example: |
  console.log(8 + 2);
```

複数の入力で動作を確認するときや、前の設問のコードを引き継ぐときは、`cases` や `previous` をTSに書きます。ファイルを選ぶ問題は `type: ファイル` にし、`answers` に `.js` のような拡張子を1つ書きます。中身は空でも採点できます。

コード問題の正誤は、模範解答と同じ文字列かどうかではなく、実行・描画の結果が条件に合うかで判定します。正解の書き方は一つではありません。レッスンの目的が特定の構文を使うこと自体である場合だけ、`requires` でソース上の構文を確認します。

## ビルドと取り込み

```sh
npm test
npm run build
```

`dist/sheets/practice.csv` をスプレッドシートの「問題データ」シートとして取り込みます。セル内改行やコード、採点プログラム、参考画像（Base64）が含まれます。Googleスプレッドシートのインポートでは、テキストの数値・日付・数式への変換をオフにしてください。シート名は `問題データ` のままにします。

新しい画像を追加したら `lesson.md` の `images` に書き、再ビルドしてCSVを取り込み直します。アプリ画面（エディタやプレビュー）を変えたときは `dist/app/` もGASへ更新し、新しいバージョンをデプロイします。
