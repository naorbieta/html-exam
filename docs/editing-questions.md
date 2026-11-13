# 問題の編集手順

正本は `data/exam/`（試験）と `data/test/`（練習）のレッスンフォルダです。編集したら `npm run build` で `dist/app` に問題データを埋め込みます。画面では試験が先に表示されます。GASへ出す手順は[GASへのデプロイ](deploy.md)を参照してください。

## レッスンの置き方

```text
data/exam/html-css/01-exam/                  試験 / HTML・CSS
data/exam/javascript/01-exam/               試験 / JavaScript
data/exam/php/01-exam/                      試験 / PHP
data/exam/git/01-exam/                      試験 / Git
data/exam/terminal/01-exam/                 試験 / ターミナル操作
data/exam/design/01-exam/                   試験 / デザイン理論
data/test/js/01-hajimete-no-javascript/     JavaScript / 初級（練習）
data/test/html-css/10-html-structure/       HTML・CSS・Web基礎（練習）
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
| `type` | `短文` / `長文` / `単一選択` / `複数選択` / `コード` / `ページ編集` / `CSS調査` / `ファイル` / `ターミナル` |
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

## ビルドとデプロイ

```sh
npm test
npm run build
```

問題・採点・参考画像は `dist/app/Catalog.html` と、サイズ制限に収まるよう分割した `Images01.html` などに書き出されます。スプレッドシートへCSVを取り込む手順は不要です。

新しい画像を追加したら `lesson.md` の `images` に書いて再ビルドし、`npm run deploy` でアプリごと更新します。

## ターミナル問題（コマンドを入力して答える）

ターミナル操作とGitの試験は `type: ターミナル` にします。画面に試験用のターミナルが表示され、受験者はコマンドを入力して Enter で実行します。GASの上で動くよう、ファイルとGitはブラウザー内の仮想環境（`src/terminal-shell.mjs`）で再現します。採点は入力した文字列ではなく、**初期状態から入力したコマンドを順に実行し直したあとの状態**で判定します。

```yaml
---
id: exam-terminal-02
number: 2
type: ターミナル
title: 今いる ~/site/css から cd .. で1つ上の ~/site に移動し、docs フォルダを作ってください。
required: true
example:
  - 'cd ..'
  - 'mkdir docs'
feedback: cd .. で ~/site に移動してから mkdir docs を実行してください。
---
```

`example` は模範解答のコマンドを1行ずつリストで書きます（テストで正解になることを確認します）。同じ名前の `.ts` に、初期状態 `initial` と判定 `check(h)` を書きます。

```ts
const grader: Grader = {
  kind: 'terminal',
  initial: {
    cwd: '~/site/css',
    files: { '~/site/index.html': '<h1>サイト</h1>\n', '~/site/css/': '' },   // 末尾が / ならフォルダ
    repos: { '~/blog': { remote: 'https://github.com/example/blog.git', commits: [{ message: '作成', files: { 'index.html': '...' } }] } },
    remotes: { 'https://github.com/example/team.git': { commits: [/* リモートだけにあるコミットも書けます */] } },
    overrides: { '~/blog/style.css': '変更後の内容' }   // リポジトリを作ったあとの未コミットの変更
  },
  check(h) {
    h.assert(h.isDir('~/site/docs'), '~/site に docs フォルダがありません。');
    h.assert(h.cwd === '~/site', '最後は ~/site にいる状態にしてください。');
  }
};
```

`h` で使えるもの: `cwd`（`~/site` の形）、`exists` / `isDir` / `isFile` / `read` / `list`（パスは `~/` から）、`repo('~/blog')`（`branch`・`head`・`branches`・`log[].message/files`・`staged`・`unstaged`・`untracked`・`remote`）、`repos()`、`remote(url)`（`branches`・`log()`）、`commands`（入力したコマンド）。

使えるコマンドは `pwd` `ls [-a -l]` `cd` `mkdir [-p]` `touch` `cat` `echo`（`>` `>>`）`cp [-r]` `mv` `rm [-r -f]` `rmdir` `clear` `history` `help` と、`git init / status / add / commit / log / branch / switch / checkout / restore / clone / pull / push / fetch / remote` です。それ以外は本物のbashと同じく `command not found` になり、`git diff` などの未対応のサブコマンドは「この試験用ターミナルでは使えません」と表示します。Git はコミットIDも含めて決定的に再現するので、同じ操作なら同じ結果になります。回答ログには、入力したコマンドの一覧・やり直した回数・最終状態（ファイルとリポジトリの要約）が記録されます。
