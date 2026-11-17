import test from 'node:test';
import assert from 'node:assert/strict';
import { readAuthoringData } from '../scripts/data.mjs';
import { catalogFromTables } from '../catalog.mjs';
import { gradeAnswer } from '../grader.mjs';
import { createShell } from '../terminal-shell.mjs';

const catalog = catalogFromTables(await readAuthoringData());
const exam = catalog.filter(quiz => quiz.id.startsWith('exam-'));
const items = exam.flatMap(quiz => quiz.items);
const gradable = items.filter(item => item.grading.kind !== 'render');
const terminalItems = items.filter(item => item.type === 'terminal');
const byId = id => items.find(item => item.id === id);
const commands = list => ({ commands: list });

function exampleOf(item) {
  // 複数選択の正解は JSON の配列で入っています。
  return item.type === 'checkboxes' ? JSON.parse(item.grading.example) : item.grading.example;
}

test('カタログは試験6カテゴリ・54問だけである', () => {
  assert.deepEqual(catalog.map(quiz => quiz.id), ['exam-html', 'exam-js', 'exam-php', 'exam-git', 'exam-terminal', 'exam-design']);
  assert.deepEqual(exam.map(quiz => quiz.id), catalog.map(quiz => quiz.id));
  assert.equal(items.length, 54);
});

test('ターミナル操作とGitは、すべてターミナルに入力して答える問題になっている', () => {
  const ids = terminalItems.map(item => item.id).sort();
  assert.deepEqual(ids, ['exam-git-01', 'exam-git-02', 'exam-git-03', 'exam-git-04', 'exam-terminal-01', 'exam-terminal-02', 'exam-terminal-03', 'exam-terminal-04']);
  for (const item of terminalItems) {
    assert.equal(item.grading.kind, 'terminal');
    assert.ok(item.grading.config.initial && typeof item.grading.config.check === 'string', `${item.id} に初期状態と判定がある`);
    assert.ok(Array.isArray(JSON.parse(item.grading.example).commands));
  }
});

test('試験の模範解答はすべて正解になる', () => {
  for (const item of gradable) {
    const result = gradeAnswer(item, exampleOf(item));
    assert.equal(result.passed, true, `${item.id}: ${result.feedback}`);
  }
});

const terminalWrong = {
  'exam-terminal-01': [['rm index.html'], ['ls -a'], ['rm *'], ['ls -a', 'rm .cache index.html'], ['rm -r ~/work', 'mkdir ~/work']],
  'exam-terminal-02': [['mkdir docs'], ['cd ..'], ['cd ..', 'mkdir doc'], ['mkdir ../docs'], ['cd ..', 'mkdir docs', 'cd docs']],
  'exam-terminal-03': [['mv top.jpg images'], ['mv * images'], ['cp top.jpg logo.png images'], ['mv top.jpg logo.png script.js images/']],
  'exam-terminal-04': [['echo こんにちは > memo.txt'], ['touch memo.txt', 'cp memo.txt backup/'], ['echo こんにちは > memo.txt', 'mv memo.txt backup/'], ['echo こんばんは > memo.txt', 'cp memo.txt backup/']],
  'exam-git-01': [['git init', 'git commit -m "最初のコミット"'], ['git init', 'git add index.html'], ['git init', 'git add index.html', 'git commit -m "first"'], ['git add index.html', 'git commit -m "最初のコミット"'], ['git init', 'git add index.html', 'git commit']],
  'exam-git-02': [['git add .', 'git commit -m "更新"', 'git push'], ['git add about.html', 'git commit -m "更新"'], ['git commit -am "更新"', 'git push'], ['git add about.html', 'git push'], ['git restore style.css', 'git add .', 'git commit -m "更新"', 'git push']],
  'exam-git-03': [['git clone https://github.com/example/portfolio.git'], ['mkdir portfolio', 'cd portfolio'], ['git clone https://github.com/example/portfolo.git', 'cd portfolio'], ['mkdir portfolio', 'cd portfolio', 'git init']],
  'exam-git-04': [['git switch -c feature'], ['git pull'], ['git switch -c feature', 'git pull'], ['git pull', 'git branch feature'], ['git checkout -b feature', 'git pull origin main']]
};
const terminalVariants = {
  'exam-terminal-01': [['rm ~/work/.cache'], ['ls -la', 'rm -f /home/user/work/.cache'], ['cd ..', 'rm work/.cache']],
  'exam-terminal-02': [['cd ~/site', 'mkdir -p docs'], ['mkdir ../docs', 'cd /home/user/site'], ['cd ../', 'mkdir ./docs/'], ['cd ..', 'mkdir doc', 'rmdir doc', 'mkdir docs']],
  'exam-terminal-03': [['mv *.jpg *.png images'], ['mv top.jpg images/', 'mv logo.png ./images/logo.png'], ['cp top.jpg logo.png images', 'rm top.jpg logo.png'], ['cd images', 'mv ../top.jpg ../logo.png .']],
  'exam-terminal-04': [['touch memo.txt', 'echo "こんにちは" >> memo.txt', 'cp memo.txt backup/memo.txt'], ["echo 'こんにちは' > memo.txt", 'cp memo.txt /home/user/notes/backup'], ['cd backup', 'echo こんにちは > ../memo.txt', 'cp ../memo.txt .']],
  'exam-git-01': [['git init', 'git add .', "git commit -m '最初のコミット'"], ['git init', 'git status', 'git add -A', 'git commit -m最初のコミット'], ['git init && git add index.html && git commit -m "最初のコミット"']],
  'exam-git-02': [['git add about.html', 'git commit -m "自己紹介を更新"', 'git push origin main'], ['git add .', 'git restore --staged style.css', 'git commit -m "更新"', 'git push -u origin main'], ['git add about.html', 'git commit -m "更新"', 'git status', 'git push', 'git log --oneline']],
  'exam-git-03': [['git clone https://github.com/example/portfolio.git my-site', 'cd my-site'], ['git clone https://github.com/example/portfolio.git', 'cd /home/user/portfolio'], ['mkdir work', 'cd work', 'git clone https://github.com/example/portfolio.git', 'cd portfolio']],
  'exam-git-04': [['git pull origin main', 'git checkout -b feature'], ['git pull', 'git branch feature', 'git switch feature'], ['git fetch', 'git pull', 'git branch feature', 'git checkout feature'], ['git status', 'git pull', 'git switch -c feature', 'git branch']]
};

test('試験の誤答は不正解になる', () => {
  const wrong = {
    'exam-js-02': "console.log('太郎');",
    'exam-js-03': "function judge(score) { return score > 60 ? '合格' : '不合格'; }",
    'exam-js-05': 'function maxNumber(a, b) { return a; }',
    'exam-js-12': "function greet(name) { return 'こんにちは、' + name + 'さん'; }",
    'exam-js-09': "function showAll(list) { console.log(list[0]); }"
  };
  const wrongChoices = item => item.type === 'checkboxes'
    ? [[exampleOf(item)[0]], [...exampleOf(item), item.options.find(option => !exampleOf(item).includes(option))], [item.options.find(option => !exampleOf(item).includes(option))]]
    : [item.options.find(option => option !== exampleOf(item))];
  for (const item of gradable) {
    const answers = item.type === 'terminal' ? terminalWrong[item.id].map(commands) : wrong[item.id] ? [wrong[item.id]] : wrongChoices(item);
    assert.ok(answers.length && answers.every(answer => answer != null && answer !== ''), `${item.id} に誤答を用意してください`);
    for (const answer of answers) {
      const result = gradeAnswer(item, answer);
      assert.equal(result.passed, false, `${item.id} が誤答を受理しました: ${JSON.stringify(answer)}`);
    }
  }
});

test('書き方が違っても結果が同じなら試験のコード問題は正解になる', () => {
  const variants = {
    'exam-js-02': 'let user = "太郎";\nconsole.log(user);',
    'exam-js-03': "const judge = score => score >= 60 ? '合格' : '不合格';",
    'exam-js-05': 'function maxNumber(a, b) { return Math.max(a, b); }',
    'exam-js-12': 'function greet(name) {\n  const message = `こんにちは、${name}さん`;\n  return message;\n}',
    'exam-js-09': 'function showAll(list) { let i = list.length; while (i > 0) { i--; console.log(list[i]); } }'
  };
  for (const [id, answer] of Object.entries(variants)) {
    const result = gradeAnswer(byId(id), answer);
    assert.equal(result.passed, true, `${id}: ${result.feedback}`);
  }
});

test('複数選択は選んだ順番に関係なく正解になる（順不同）', () => {
  for (const item of items.filter(item => item.type === 'checkboxes')) {
    const answer = exampleOf(item);
    assert.ok(answer.length >= 2, `${item.id} は正解が2つ以上`);
    assert.equal(gradeAnswer(item, [...answer].reverse()).passed, true, item.id);
  }
  assert.ok(items.filter(item => item.type === 'checkboxes').length >= 2);
});

test('ターミナル問題は別解（-p・相対/絶対パス・switch/checkout など）も正解になる', () => {
  for (const [id, list] of Object.entries(terminalVariants)) {
    for (const answer of list) {
      const result = gradeAnswer(byId(id), commands(answer));
      assert.equal(result.passed, true, `${id}: ${JSON.stringify(answer)} → ${result.feedback}`);
    }
  }
});

test('ターミナル問題は失敗したコマンドや打ち間違いが混ざっても、最終状態で判定する', () => {
  const result = gradeAnswer(byId('exam-terminal-02'), commands(['cd..', 'mkdri docs', 'cd ..', 'ls', 'mkdir docs']));
  assert.equal(result.passed, true, result.feedback);
  const git = gradeAnswer(byId('exam-git-01'), commands(['git commit -m "最初のコミット"', 'git init', 'git add index.htm', 'git add index.html', 'git comit -m x', 'git commit -m "最初のコミット"']));
  assert.equal(git.passed, true, git.feedback);
});

test('ターミナル問題の回答形式が壊れていたり空なら不正解になる', () => {
  const item = byId('exam-terminal-01');
  for (const answer of ['', 'rm .cache', { commands: [] }, { commands: 'rm .cache' }, { commands: [1] }, { commands: Array(201).fill('ls') }]) {
    assert.equal(gradeAnswer(item, answer).passed, false, JSON.stringify(answer).slice(0, 60));
  }
});

test('仮想ターミナルは本物に近いエラーと出力を返す', () => {
  const shell = createShell({ cwd: '~/a', files: { '~/a/x.txt': 'hi\n', '~/a/dir/': '' } });
  assert.equal(shell.prompt(), 'user@exam:~/a$ ');
  assert.equal(shell.run('pwd').output, '/home/user/a\n');
  assert.equal(shell.run('ls').output, 'dir  x.txt\n');
  assert.equal(shell.run('ls -a').output, '.  ..  dir  x.txt\n');
  assert.equal(shell.run('foo').output, 'bash: foo: command not found\n');
  assert.equal(shell.run('foo').code, 127);
  assert.equal(shell.run('cd nowhere').output, 'bash: cd: nowhere: No such file or directory\n');
  assert.equal(shell.run('cat dir').output, 'cat: dir: Is a directory\n');
  assert.equal(shell.run('rm dir').output, "rm: cannot remove 'dir': Is a directory\n");
  assert.equal(shell.run('mkdir dir').output, 'mkdir: cannot create directory ‘dir’: File exists\n');
  assert.equal(shell.run('mkdir p/q').output, 'mkdir: cannot create directory ‘p/q’: No such file or directory\n');
  assert.equal(shell.run('git status').output, 'fatal: not a git repository (or any of the parent directories): .git\n');
  assert.match(shell.run('git merge x').output, /使えません/);
  assert.equal(shell.run('git frobnicate').output, "git: 'frobnicate' is not a git command. See 'git --help'.\n");
  shell.run('echo one > y.txt'); shell.run('echo two >> y.txt');
  assert.equal(shell.run('cat y.txt').output, 'one\ntwo\n');
  assert.equal(shell.run('cd ~ && pwd').output, '/home/user\n');
  assert.equal(shell.run('cd -').output, '/home/user/a\n');
  assert.ok(shell.run('clear').clear);
  assert.deepEqual(shell.complete('cat x'), { line: 'cat x.txt ', candidates: [] });
  assert.deepEqual(shell.complete('cd d'), { line: 'cd dir/', candidates: [] });
  assert.equal(shell.complete('m').candidates.join(','), 'mkdir,mv');
});

test('Git エミュレーションは同じ操作なら同じコミットIDになり、push/pull の状態が追える', () => {
  const run = () => {
    const shell = createShell({ cwd: '~/p', files: { '~/p/a.txt': 'a\n' } });
    for (const line of ['git init', 'git add .', 'git commit -m first']) shell.run(line);
    return shell;
  };
  assert.equal(run().helpers().repo('~/p').head, run().helpers().repo('~/p').head);
  const shell = run();
  assert.match(shell.run('git status').output, /nothing to commit, working tree clean/);
  assert.match(shell.run('git push').output, /No configured push destination/);
  shell.run('echo b > b.txt');
  assert.match(shell.run('git status -s').output, /\?\? b\.txt/);
  assert.match(shell.run('git commit -m x').output, /nothing added to commit but untracked files present/);
  assert.match(shell.run('git log --oneline').output, /^[0-9a-f]{7} \(HEAD -> main\) first\n$/);
});
