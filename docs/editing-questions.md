# 問題の編集手順

正本は `data/exam/` のレッスンフォルダです。編集したら `npm run build` で `dist/app` に問題データを埋め込みます。GASへ出す手順は[GASへのデプロイ](deploy.md)を参照してください。

## レッスンの置き方

```text
data/exam/html-css/01-exam/                  試験 / HTML・CSS
data/exam/javascript/01-exam/               試験 / JavaScript
data/exam/php/01-exam/                      試験 / PHP
data/exam/git/01-exam/                      試験 / Git
data/exam/terminal/01-exam/                 試験 / ターミナル操作
data/exam/design/01-exam/                   試験 / デザイン理論
```

フォルダ名は `{レッスン番号2桁}-{スラッグ}` にします。番号は分野ごとに付け、欠番があってもそのまま使います。各フォルダには `lesson.md` と、設問ごとの Markdown を置きます。採点が必要な設問には、同じ名前の TypeScript を添えます。画像は `images/` に入れ、`lesson.md` から参照します。

### lesson.md

```markdown
---
id: exam-js
course: 試験 / JavaScript
number: 1
title: JavaScript
images:
  - file: images/example.png
    path: images/example.png
    alt: 参考画像
---

導入文をここに書きます。
```

`id` は既存の回答記録と対応させるため、公開後は変更しません。`path` はアプリが画像を識別する名前です。通常は `images/` に元のファイル名を付けます。

### 設問の Markdown

```markdown
---
id: exam-js-01
number: 1
type: 単一選択
title: 次のうち、正しい説明はどれですか？
required: true
choices:
  - "説明A"
  - "説明B"
  - "説明C"
  - "説明D"
answers:
  - "説明A"
feedback: 解説をここに書きます。採点後に表示されます。
---
```

| 項目 | 内容 |
| --- | --- |
| `id` | 設問ID。公開後は変更しません |
| `number` | レッスン内の設問番号 |
| `type` | `単一選択` / `複数選択` / `コード` / `ターミナル` |
| `title` | 設問文 |
| `choices` | 選択問題の選択肢 |
| `answers` | 正解（選択問題は選択肢の文言そのもの。複数選択は複数行） |
| `language` | コード問題の `js` / `html` / `css` |
| `starter` | 初期コード |
| `example` | 解答例（コードや登録済み採点で使う） |
| `feedback` | 不正解時のメッセージ |
| `required` | 省略時は必須 |
| `method` | 採点TSが無いときの採点方法。コンソール出力だけを見るコード問題では `コンソール出力` |

フロントマターの下の本文は「設問の説明」として、設問文と一緒に**左ペイン**に表示します（右ペインは解答欄だけです）。本文には次の書き方が使えます。

~~~markdown
```html label="index.html"
<p class="note">コードとして表示します（html・css・js・php・text など）</p>
```

```preview height=150 label="見本"
<p style="color:red">HTML/CSS の表示例。スクリプトと通信を止めた枠に描画します（<html> タグは書かず断片で書きます）</p>
```

```svg label="図の説明"
<svg viewBox="0 0 100 40"><rect width="100" height="40" fill="#bbdefb"/></svg>
```

- 箇条書き、### 小見出し、`インラインコード`、**強調** も使えます。
~~~

設問文（`title`）でも `` `コード` `` と `**強調**` が使えます。

### 問題を書くときの決まり

- 設問番号から好きな順に解けます。各設問は1回だけ回答でき、採点後は確定します。回答済みの番号から見返せますが、やり直すことはできません。
- 採点したあとに正誤と `feedback`（解説）を表示し、「次へ」で次の未回答へ進みます。解説は回答前には出しません。ターミナル・コード問題では、満たせなかった条件の説明（`h.assert` のメッセージ）もあわせて出します。メッセージには**答えのコマンドや書き方を書かず**、「いまの状態のどこが条件と違うか」を書きます。
- ターミナル・Git の問題文には、使うコマンドを書かず、目指す状態を書きます（テストで確認します）。
- 順番が関係ない答えは、`複数選択`（正解を複数書く）にします。選んだ順番に関係なく採点されます。
- 選択肢は、正解だけが長く詳しくならないよう、同じくらいの長さ・具体さにそろえます。

前後の空白・全角と半角・英字の大文字と小文字の違いは、正解との照合では無視します。

## 選択問題

選択問題は `type: 単一選択` または `複数選択` にし、`choices` と `answers` を書きます。選択肢は画面でランダムに並びます。正解は番号ではなく、選択肢の文言をそのまま書きます。採点TSは不要です。

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

複数の入力で動作を確認するときは、`cases` をTSに書きます。

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
