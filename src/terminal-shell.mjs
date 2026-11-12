// 試験用の仮想ターミナル。ブラウザ・採点Worker・Nodeのテストで同じ実装を使う。
// 外部モジュールに依存しない（ビルド時に採点Workerへそのまま連結する）。
export const TERMINAL_HOME = '/home/user';
const TERMINAL_USER = 'user';
const TERMINAL_HOST = 'exam';
const MAX_ENTRIES = 3000;
const MAX_FILE = 20000;
const MAX_OUTPUT = 20000;
export const MAX_TERMINAL_COMMANDS = 200;
export const MAX_TERMINAL_COMMAND_LENGTH = 1000;

function termHash(text) {
  let out = '';
  for (let round = 0; out.length < 40; round++) {
    let h = (0x811c9dc5 ^ round) >>> 0;
    for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
    out += h.toString(16).padStart(8, '0');
  }
  return out.slice(0, 40);
}
function termNormalize(path) {
  const parts = [];
  for (const part of path.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') parts.pop(); else parts.push(part);
  }
  return '/' + parts.join('/');
}
function termParent(path) { return path === '/' ? '/' : termNormalize(path + '/..'); }
function termBase(path) { return path === '/' ? '/' : path.slice(path.lastIndexOf('/') + 1); }
function termJoin(dir, name) { return dir === '/' ? '/' + name : dir + '/' + name; }
function termInside(path, dir) { return path === dir || path.startsWith(dir === '/' ? '/' : dir + '/'); }
function termRelative(from, to) {
  const a = from === '/' ? [] : from.slice(1).split('/');
  const b = to === '/' ? [] : to.slice(1).split('/');
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return [...a.slice(i).map(() => '..'), ...b.slice(i)].join('/') || '.';
}
function termDisplay(path) {
  if (path === TERMINAL_HOME) return '~';
  return termInside(path, TERMINAL_HOME) ? '~' + path.slice(TERMINAL_HOME.length) : path;
}
function termResolve(cwd, input) {
  if (input === '~') return TERMINAL_HOME;
  if (input.startsWith('~/')) return termNormalize(TERMINAL_HOME + input.slice(1));
  return termNormalize(input.startsWith('/') ? input : cwd + '/' + input);
}
function termLines(text) { return text ? text.split('\n').length - (text.endsWith('\n') ? 1 : 0) : 0; }
function termLineDiff(before, after) {
  const count = new Map();
  for (const line of (before || '').split('\n').slice(0, termLines(before))) count.set(line, (count.get(line) || 0) + 1);
  let added = 0;
  for (const line of (after || '').split('\n').slice(0, termLines(after))) {
    if (count.get(line)) count.set(line, count.get(line) - 1); else added++;
  }
  return { added, removed: Math.max(0, termLines(before) - (termLines(after) - added)) };
}

function termTokenize(line) {
  const tokens = [];
  let current = null;
  const start = () => { if (!current) current = { value: '', glob: false }; };
  const push = () => { if (current) { tokens.push(current); current = null; } };
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === ' ' || ch === '\t') { push(); continue; }
    if (ch === '#' && !current) break;
    if (ch === "'") {
      start();
      const end = line.indexOf("'", i + 1);
      if (end < 0) throw new Error("unexpected EOF while looking for matching `''");
      current.value += line.slice(i + 1, end); i = end; continue;
    }
    if (ch === '"') {
      start();
      let j = i + 1;
      for (; j < line.length && line[j] !== '"'; j++) {
        if (line[j] === '\\' && /["\\$`]/.test(line[j + 1] || '')) j++;
        current.value += line[j];
      }
      if (j >= line.length) throw new Error('unexpected EOF while looking for matching `"\'');
      i = j; continue;
    }
    if (ch === '\\') { start(); current.value += line[i + 1] ?? ''; i++; continue; }
    if (ch === '&' && line[i + 1] === '&') { push(); tokens.push({ op: '&&' }); i++; continue; }
    if (ch === '|' && line[i + 1] === '|') { push(); tokens.push({ op: '||' }); i++; continue; }
    if (ch === ';' || ch === '|' || ch === '&' || ch === '<') { push(); tokens.push({ op: ch }); continue; }
    if (ch === '>') { push(); if (line[i + 1] === '>') { tokens.push({ op: '>>' }); i++; } else tokens.push({ op: '>' }); continue; }
    start();
    if (ch === '*' || ch === '?') current.glob = true;
    current.value += ch;
  }
  push();
  return tokens;
}
function termGlob(pattern) {
  return new RegExp('^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
}
function termTree(repo, id) { return id ? repo.commits[id].tree : {}; }
function termCommit(repo, parent, message, tree, depth) {
  const id = termHash(JSON.stringify([parent, message, tree]));
  repo.commits[id] = { id, parent, message, tree: { ...tree }, depth };
  return id;
}
function termHistory(list) {
  const store = { commits: {} };
  let head = null, depth = 0;
  for (const commit of list || []) head = termCommit(store, head, commit.message, commit.files || {}, ++depth);
  return { commits: store.commits, head };
}

export function createShell(initial = {}) {
  const fs = { '/': { type: 'dir' }, '/home': { type: 'dir' }, [TERMINAL_HOME]: { type: 'dir' } };
  const state = { cwd: TERMINAL_HOME, oldpwd: null, repos: {}, remotes: {}, history: [] };
  const ensureDir = path => { if (fs[path]) return; ensureDir(termParent(path)); fs[path] = { type: 'dir' }; };
  const writeFile = (path, content) => { ensureDir(termParent(path)); fs[path] = { type: 'file', content }; };
  const removePath = path => { for (const key of Object.keys(fs)) if (termInside(key, path)) delete fs[key]; };
  const childrenOf = dir => {
    const prefix = dir === '/' ? '/' : dir + '/';
    const names = [];
    for (const path of Object.keys(fs)) if (path !== dir && path.startsWith(prefix) && !path.slice(prefix.length).includes('/')) names.push(path.slice(prefix.length));
    return names.sort((a, b) => a.replace(/^\./, '').localeCompare(b.replace(/^\./, ''), 'en') || a.localeCompare(b));
  };

  for (const [key, value] of Object.entries(initial.files || {})) {
    const path = termResolve(TERMINAL_HOME, key);
    if (key.endsWith('/') || value === null) ensureDir(path); else writeFile(path, String(value));
  }
  for (const [url, spec] of Object.entries(initial.remotes || {})) {
    const { commits, head } = termHistory(spec.commits);
    state.remotes[url] = { commits, branches: head ? { main: head } : {} };
  }
  for (const [key, spec] of Object.entries(initial.repos || {})) {
    const root = termResolve(TERMINAL_HOME, key);
    ensureDir(termJoin(root, '.git'));
    const { commits, head } = termHistory(spec.commits);
    const branch = spec.branch || 'main';
    const repo = { root, branch, branches: head ? { [branch]: head } : {}, commits, index: {}, remotes: {}, upstream: {}, remoteRefs: {} };
    repo.index = { ...termTree(repo, head) };
    for (const [rel, content] of Object.entries(repo.index)) writeFile(termJoin(root, rel), content);
    if (spec.remote) {
      repo.remotes.origin = spec.remote;
      if (!state.remotes[spec.remote]) state.remotes[spec.remote] = { commits: { ...commits }, branches: head ? { [branch]: head } : {} };
      if (head) { repo.upstream[branch] = 'origin/' + branch; repo.remoteRefs['origin/' + branch] = head; }
    }
    state.repos[root] = repo;
  }
  for (const [key, value] of Object.entries(initial.overrides || {})) {
    const path = termResolve(TERMINAL_HOME, key);
    if (value === null) removePath(path); else writeFile(path, String(value));
  }
  if (initial.cwd) state.cwd = termResolve(TERMINAL_HOME, initial.cwd);
  ensureDir(state.cwd);

  const copyPath = (from, to) => {
    for (const key of Object.keys(fs).filter(key => termInside(key, from)).sort()) {
      fs[to + key.slice(from.length)] = fs[key].type === 'dir' ? { type: 'dir' } : { type: 'file', content: fs[key].content };
    }
  };
  const expand = token => {
    if (!token.glob) return [token.value];
    const value = token.value, slash = value.lastIndexOf('/');
    const dirPart = slash >= 0 ? value.slice(0, slash + 1) : '', pattern = value.slice(slash + 1);
    if (/[*?]/.test(dirPart)) return [value];
    const dir = termResolve(state.cwd, dirPart || '.');
    if (fs[dir]?.type !== 'dir') return [value];
    const regex = termGlob(pattern);
    const matches = childrenOf(dir).filter(name => (pattern.startsWith('.') || !name.startsWith('.')) && regex.test(name)).map(name => dirPart + name);
    return matches.length ? matches : [value];
  };
  const cleanRepos = () => { for (const root of Object.keys(state.repos)) if (!fs[termJoin(root, '.git')]) delete state.repos[root]; };
  const findRepo = () => {
    cleanRepos();
    for (let dir = state.cwd; ; dir = termParent(dir)) {
      if (state.repos[dir]) return state.repos[dir];
      if (dir === '/') return null;
    }
  };
  const workTree = repo => {
    const tree = {}, gitDir = termJoin(repo.root, '.git');
    for (const [path, node] of Object.entries(fs)) {
      if (node.type !== 'file' || !termInside(path, repo.root) || termInside(path, gitDir)) continue;
      if (Object.keys(state.repos).some(root => root !== repo.root && termInside(root, repo.root) && termInside(path, root))) continue;
      tree[path.slice(repo.root.length + 1)] = node.content;
    }
    return tree;
  };
  const repoStatus = repo => {
    const head = termTree(repo, repo.branches[repo.branch]);
    const work = workTree(repo);
    const staged = [], unstaged = [], untracked = [];
    for (const path of [...new Set([...Object.keys(head), ...Object.keys(repo.index)])].sort()) {
      if (!(path in repo.index)) staged.push({ path, kind: 'deleted' });
      else if (!(path in head)) staged.push({ path, kind: 'new file' });
      else if (head[path] !== repo.index[path]) staged.push({ path, kind: 'modified' });
    }
    for (const path of Object.keys(repo.index).sort()) {
      if (!(path in work)) unstaged.push({ path, kind: 'deleted' });
      else if (work[path] !== repo.index[path]) unstaged.push({ path, kind: 'modified' });
    }
    for (const path of Object.keys(work).sort()) if (!(path in repo.index)) untracked.push(path);
    return { staged, unstaged, untracked, head, work };
  };
  const ancestors = (repo, id) => { const list = []; while (id) { list.push(id); id = repo.commits[id]?.parent; } return list; };
  const logOf = (repo, id) => ancestors(repo, id).map(c => repo.commits[c]);

  const ok = (out = '') => ({ out, err: '', code: 0 });
  const fail = (err, code = 1, out = '') => ({ out, err, code });
  const done = (out, errors, code = 1) => ({ out, err: errors.join('\n'), code: errors.length ? code : 0 });
  const flags = (args, allowed) => {
    const set = new Set(), rest = [];
    let stop = false;
    for (const arg of args) {
      if (!stop && arg === '--') { stop = true; continue; }
      if (!stop && /^-[a-zA-Z]+$/.test(arg)) {
        for (const ch of arg.slice(1)) { if (!allowed.includes(ch)) return { error: ch }; set.add(ch); }
      } else if (!stop && /^--[a-z-]+$/.test(arg)) {
        const mapped = { '--all': 'a', '--recursive': 'r', '--force': 'f', '--parents': 'p' }[arg];
        if (!mapped || !allowed.includes(mapped)) return { error: arg };
        set.add(mapped);
      } else rest.push(arg);
    }
    return { set, rest };
  };
  const invalid = (name, opt) => opt.startsWith('--')
    ? fail(`${name}: unrecognized option '${opt}'\nTry '${name} --help' for more information.`, 2)
    : fail(`${name}: invalid option -- '${opt}'\nTry '${name} --help' for more information.`, 2);

  const commands = {};
  commands.pwd = () => ok(state.cwd + '\n');
  commands.whoami = () => ok(TERMINAL_USER + '\n');
  commands.clear = () => ({ out: '', err: '', code: 0, clear: true });
  commands.history = () => ok(state.history.map((line, i) => `${String(i + 1).padStart(5)}  ${line}\n`).join(''));
  commands.help = () => ok([
    '使えるコマンド:',
    '  pwd  ls [-a] [-l]  cd  mkdir [-p]  touch  cat  echo（> >> で書き込み）',
    '  cp [-r]  mv  rm [-r] [-f]  rmdir  clear  history  whoami',
    '  git init / status / add / commit -m / log [--oneline] / branch / switch [-c]',
    '      checkout [-b] / restore / clone / pull / push / fetch / remote -v',
    '↑↓ で入力履歴、Tab で名前の補完ができます。'
  ].join('\n') + '\n');
  commands.echo = args => {
    const newline = args[0] !== '-n';
    return ok((newline ? args : args.slice(1)).join(' ') + (newline ? '\n' : ''));
  };
  commands.ls = args => {
    const parsed = flags(args, 'alhAF1');
    if (parsed.error) return invalid('ls', parsed.error);
    const all = parsed.set.has('a'), almost = parsed.set.has('A'), long = parsed.set.has('l');
    const targets = parsed.rest.length ? parsed.rest : ['.'];
    const row = (path, name) => {
      const node = fs[path];
      const size = node.type === 'dir' ? 4096 : new TextEncoder().encode(node.content).length;
      return `${node.type === 'dir' ? 'drwxr-xr-x 2' : '-rw-r--r-- 1'} ${TERMINAL_USER} ${TERMINAL_USER} ${String(size).padStart(5)} Nov 12 10:00 ${name}`;
    };
    const errors = [], parts = [], fileNames = [];
    const dirs = [];
    for (const target of targets) {
      const path = termResolve(state.cwd, target);
      if (!fs[path]) errors.push(`ls: cannot access '${target}': No such file or directory`);
      else if (fs[path].type === 'file') fileNames.push([path, target]);
      else dirs.push([path, target]);
    }
    if (fileNames.length) parts.push(long ? fileNames.map(([p, n]) => row(p, n)).join('\n') : fileNames.map(([, n]) => n).join('  '));
    for (const [path, target] of dirs) {
      let names = childrenOf(path).filter(name => all || almost || !name.startsWith('.'));
      if (all) names = ['.', '..', ...names];
      const body = long
        ? [`total ${names.length * 4}`, ...names.map(name => row(name === '.' ? path : name === '..' ? termParent(path) : termJoin(path, name), name))].join('\n')
        : names.join('  ');
      parts.push((targets.length > 1 ? `${target}:\n` : '') + body);
    }
    const text = parts.filter((part, i) => part || targets.length > 1 || i > 0).join(targets.length > 1 ? '\n\n' : '\n');
    return done(text ? text + '\n' : '', errors, 2);
  };
  commands.cd = args => {
    if (args.length > 1) return fail('bash: cd: too many arguments');
    let target = args[0] ?? '~';
    if (target === '-') { if (!state.oldpwd) return fail('bash: cd: OLDPWD not set'); target = state.oldpwd; }
    const path = termResolve(state.cwd, target);
    if (!fs[path]) return fail(`bash: cd: ${args[0]}: No such file or directory`);
    if (fs[path].type !== 'dir') return fail(`bash: cd: ${args[0]}: Not a directory`);
    state.oldpwd = state.cwd; state.cwd = path;
    return ok(args[0] === '-' ? path + '\n' : '');
  };
  commands.mkdir = args => {
    const parsed = flags(args, 'pv');
    if (parsed.error) return invalid('mkdir', parsed.error);
    if (!parsed.rest.length) return fail("mkdir: missing operand\nTry 'mkdir --help' for more information.");
    const errors = [];
    for (const name of parsed.rest) {
      const path = termResolve(state.cwd, name);
      if (fs[path]) { if (!parsed.set.has('p') || fs[path].type !== 'dir') errors.push(`mkdir: cannot create directory ‘${name}’: File exists`); continue; }
      if (parsed.set.has('p')) {
        let blocked = false;
        for (let dir = termParent(path); dir !== '/'; dir = termParent(dir)) if (fs[dir] && fs[dir].type !== 'dir') blocked = true;
        if (blocked) errors.push(`mkdir: cannot create directory ‘${name}’: Not a directory`); else ensureDir(path);
        continue;
      }
      const parent = fs[termParent(path)];
      if (!parent) errors.push(`mkdir: cannot create directory ‘${name}’: No such file or directory`);
      else if (parent.type !== 'dir') errors.push(`mkdir: cannot create directory ‘${name}’: Not a directory`);
      else fs[path] = { type: 'dir' };
    }
    return done('', errors);
  };
  commands.touch = args => {
    const names = args.filter(arg => !arg.startsWith('-'));
    if (!names.length) return fail("touch: missing file operand\nTry 'touch --help' for more information.");
    const errors = [];
    for (const name of names) {
      const path = termResolve(state.cwd, name);
      if (fs[path]) continue;
      if (fs[termParent(path)]?.type !== 'dir') errors.push(`touch: cannot touch '${name}': No such file or directory`);
      else fs[path] = { type: 'file', content: '' };
    }
    return done('', errors);
  };
  commands.cat = args => {
    const out = [], errors = [];
    for (const name of args.filter(arg => arg !== '-n')) {
      const node = fs[termResolve(state.cwd, name)];
      if (!node) errors.push(`cat: ${name}: No such file or directory`);
      else if (node.type === 'dir') errors.push(`cat: ${name}: Is a directory`);
      else out.push(node.content);
    }
    return done(out.join(''), errors);
  };
  const transfer = (name, args, move) => {
    const parsed = flags(args, move ? 'fivn' : 'rRfivp');
    if (parsed.error) return invalid(name, parsed.error);
    const recursive = parsed.set.has('r') || parsed.set.has('R');
    const list = parsed.rest;
    if (!list.length) return fail(`${name}: missing file operand\nTry '${name} --help' for more information.`);
    if (list.length === 1) return fail(`${name}: missing destination file operand after '${list[0]}'\nTry '${name} --help' for more information.`);
    const destName = list[list.length - 1], dest = termResolve(state.cwd, destName);
    const destIsDir = fs[dest]?.type === 'dir', sources = list.slice(0, -1);
    if (sources.length > 1 && !destIsDir) return fail(`${name}: target '${destName}' is not a directory`);
    const errors = [];
    for (const sourceName of sources) {
      const source = termResolve(state.cwd, sourceName), node = fs[source];
      if (!node) { errors.push(`${name}: cannot stat '${sourceName}': No such file or directory`); continue; }
      const target = destIsDir ? termJoin(dest, termBase(source)) : dest;
      const shownTarget = destIsDir ? destName.replace(/\/?$/, '/') + termBase(source) : destName;
      if (node.type === 'dir' && !move && !recursive) { errors.push(`cp: -r not specified; omitting directory '${sourceName}'`); continue; }
      if (target === source) { errors.push(`${name}: '${sourceName}' and '${shownTarget}' are the same file`); continue; }
      if (node.type === 'dir' && termInside(target, source)) { errors.push(`${name}: cannot ${move ? 'move' : 'copy'} '${sourceName}' to a subdirectory of itself, '${shownTarget}'`); continue; }
      if (fs[termParent(target)]?.type !== 'dir') { errors.push(`${name}: cannot ${move ? 'move' : "create regular file"} '${move ? sourceName : shownTarget}'${move ? ` to '${shownTarget}'` : ''}: No such file or directory`); continue; }
      if (fs[target]?.type === 'dir' && node.type === 'file') { errors.push(`${name}: cannot overwrite directory '${shownTarget}' with non-directory`); continue; }
      if (fs[target]?.type === 'file' && node.type === 'dir') { errors.push(`${name}: cannot overwrite non-directory '${shownTarget}' with directory '${sourceName}'`); continue; }
      if (fs[target]) removePath(target);
      copyPath(source, target);
      if (move) removePath(source);
      if (Object.keys(fs).length > MAX_ENTRIES) { removePath(target); errors.push(`${name}: error writing '${shownTarget}': No space left on device`); }
    }
    cleanRepos();
    return done('', errors);
  };
  commands.cp = args => transfer('cp', args, false);
  commands.mv = args => transfer('mv', args, true);
  commands.rm = args => {
    const parsed = flags(args, 'rRfiv');
    if (parsed.error) return invalid('rm', parsed.error);
    const recursive = parsed.set.has('r') || parsed.set.has('R'), force = parsed.set.has('f');
    if (!parsed.rest.length) return force ? ok() : fail("rm: missing operand\nTry 'rm --help' for more information.");
    const errors = [];
    for (const name of parsed.rest) {
      const path = termResolve(state.cwd, name), node = fs[path];
      if (path === '/') { errors.push("rm: it is dangerous to operate recursively on '/'\nrm: use --no-preserve-root to override this failsafe"); continue; }
      if (/(^|\/)\.\.?\/?$/.test(name)) { errors.push(`rm: refusing to remove '.' or '..' directory: skipping '${name}'`); continue; }
      if (!node) { if (!force) errors.push(`rm: cannot remove '${name}': No such file or directory`); continue; }
      if (node.type === 'dir' && !recursive) { errors.push(`rm: cannot remove '${name}': Is a directory`); continue; }
      removePath(path);
    }
    cleanRepos();
    return done('', errors);
  };
  commands.rmdir = args => {
    if (!args.length) return fail("rmdir: missing operand\nTry 'rmdir --help' for more information.");
    const errors = [];
    for (const name of args) {
      const path = termResolve(state.cwd, name), node = fs[path];
      if (!node) errors.push(`rmdir: failed to remove '${name}': No such file or directory`);
      else if (node.type !== 'dir') errors.push(`rmdir: failed to remove '${name}': Not a directory`);
      else if (childrenOf(path).length) errors.push(`rmdir: failed to remove '${name}': Directory not empty`);
      else delete fs[path];
    }
    return done('', errors);
  };

  // ---------- git ----------
  const short = id => id ? id.slice(0, 7) : '0000000';
  const shown = (repo, rel) => termRelative(state.cwd, termJoin(repo.root, rel));
  const decorations = (repo, id) => {
    const names = [];
    for (const [name, value] of Object.entries(repo.branches)) if (value === id) names.push(name === repo.branch ? `HEAD -> ${name}` : name);
    for (const [name, value] of Object.entries(repo.remoteRefs)) if (value === id) names.push(name);
    names.sort((a, b) => (b.startsWith('HEAD') ? 1 : 0) - (a.startsWith('HEAD') ? 1 : 0));
    return names.length ? ` (${names.join(', ')})` : '';
  };
  const setTree = (repo, fromTree, toTree) => {
    for (const path of Object.keys(fromTree)) if (!(path in toTree)) { removePath(termJoin(repo.root, path)); delete repo.index[path]; }
    for (const [path, content] of Object.entries(toTree)) {
      if (fromTree[path] !== content || !fs[termJoin(repo.root, path)]) writeFile(termJoin(repo.root, path), content);
      repo.index[path] = content;
    }
  };
  const conflicts = (repo, fromTree, toTree) => {
    const status = repoStatus(repo);
    const dirty = new Set([...status.staged, ...status.unstaged].map(s => s.path));
    const changed = [...new Set([...Object.keys(fromTree), ...Object.keys(toTree)])].filter(path => fromTree[path] !== toTree[path]);
    return {
      blocked: changed.filter(path => dirty.has(path)),
      untrackedHit: changed.filter(path => status.untracked.includes(path) && path in toTree && toTree[path] !== status.work[path])
    };
  };
  const moveTo = (repo, branch, target, verb) => {
    const fromTree = termTree(repo, repo.branches[repo.branch]), toTree = termTree(repo, target);
    const { blocked, untrackedHit } = conflicts(repo, fromTree, toTree);
    if (blocked.length) return fail(`error: Your local changes to the following files would be overwritten by ${verb}:\n${blocked.map(p => '\t' + p).join('\n')}\nPlease commit your changes or stash them before you switch branches.\nAborting`);
    if (untrackedHit.length) return fail(`error: The following untracked working tree files would be overwritten by ${verb}:\n${untrackedHit.map(p => '\t' + p).join('\n')}\nPlease move or remove them before you switch branches.\nAborting`);
    setTree(repo, fromTree, toTree);
    repo.branch = branch;
    return null;
  };
  const summary = (fromTree, toTree) => {
    const changed = [...new Set([...Object.keys(fromTree), ...Object.keys(toTree)])].filter(path => fromTree[path] !== toTree[path]).sort();
    let insertions = 0, deletions = 0;
    const lines = [], modes = [];
    for (const path of changed) {
      const diff = termLineDiff(fromTree[path], toTree[path]);
      insertions += diff.added; deletions += diff.removed;
      lines.push({ path, diff });
      if (!(path in fromTree)) modes.push(` create mode 100644 ${path}`);
      if (!(path in toTree)) modes.push(` delete mode 100644 ${path}`);
    }
    const parts = [`${changed.length} file${changed.length === 1 ? '' : 's'} changed`];
    if (insertions || !deletions) parts.push(`${insertions} insertion${insertions === 1 ? '' : 's'}(+)`);
    if (deletions) parts.push(`${deletions} deletion${deletions === 1 ? '' : 's'}(-)`);
    return { line: ' ' + parts.join(', '), lines, modes };
  };
  const collapseUntracked = (repo, untracked) => {
    const tracked = Object.keys(repo.index), result = new Set();
    for (const path of untracked) {
      const parts = path.split('/');
      let dir = null;
      for (let i = 1; i < parts.length && !dir; i++) {
        const candidate = parts.slice(0, i).join('/');
        if (!tracked.some(t => t.startsWith(candidate + '/'))) dir = candidate;
      }
      result.add(dir ? shown(repo, dir) + '/' : shown(repo, path));
    }
    return [...result].sort();
  };
  const statusText = (repo, shortForm) => {
    const status = repoStatus(repo);
    if (shortForm) {
      const rows = new Map();
      for (const s of status.staged) rows.set(s.path, [{ 'new file': 'A', modified: 'M', deleted: 'D' }[s.kind], ' ']);
      for (const s of status.unstaged) { const row = rows.get(s.path) || [' ', ' ']; row[1] = s.kind === 'deleted' ? 'D' : 'M'; rows.set(s.path, row); }
      const lines = [...rows.entries()].sort().map(([path, row]) => `${row.join('')} ${shown(repo, path)}`);
      for (const path of collapseUntracked(repo, status.untracked)) lines.push(`?? ${path}`);
      return lines.map(line => line + '\n').join('');
    }
    const lines = [`On branch ${repo.branch}`];
    const head = repo.branches[repo.branch], upstream = repo.upstream[repo.branch];
    if (!head) lines.push('', 'No commits yet');
    else if (upstream && repo.remoteRefs[upstream]) {
      const mine = ancestors(repo, head), theirs = ancestors(repo, repo.remoteRefs[upstream]);
      const ahead = mine.filter(id => !theirs.includes(id)).length, behind = theirs.filter(id => !mine.includes(id)).length;
      const s = n => n > 1 ? 's' : '';
      if (!ahead && !behind) lines.push(`Your branch is up to date with '${upstream}'.`);
      else if (!behind) lines.push(`Your branch is ahead of '${upstream}' by ${ahead} commit${s(ahead)}.`, '  (use "git push" to publish your local commits)');
      else if (!ahead) lines.push(`Your branch is behind '${upstream}' by ${behind} commit${s(behind)}, and can be fast-forwarded.`, '  (use "git pull" to update your local branch)');
      else lines.push(`Your branch and '${upstream}' have diverged,`, `and have ${ahead} and ${behind} different commits each, respectively.`);
    }
    if (status.staged.length) {
      lines.push('', 'Changes to be committed:', head ? '  (use "git restore --staged <file>..." to unstage)' : '  (use "git rm --cached <file>..." to unstage)');
      for (const s of status.staged) lines.push(`\t${(s.kind + ':').padEnd(12)}${shown(repo, s.path)}`);
    }
    if (status.unstaged.length) {
      lines.push('', 'Changes not staged for commit:', '  (use "git add <file>..." to update what will be committed)', '  (use "git restore <file>..." to discard changes in working directory)');
      for (const s of status.unstaged) lines.push(`\t${(s.kind + ':').padEnd(12)}${shown(repo, s.path)}`);
    }
    const untracked = collapseUntracked(repo, status.untracked);
    if (untracked.length) {
      lines.push('', 'Untracked files:', '  (use "git add <file>..." to include in what will be committed)');
      for (const path of untracked) lines.push(`\t${path}`);
    }
    lines.push('');
    if (!status.staged.length) {
      if (status.unstaged.length) lines.push('no changes added to commit (use "git add" and/or "git commit -a")');
      else if (untracked.length) lines.push('nothing added to commit but untracked files present (use "git add" to track)');
      else lines.push(head ? 'nothing to commit, working tree clean' : 'nothing to commit (create/copy files and use "git add" to track)');
    }
    return lines.join('\n') + '\n';
  };
  const stage = (repo, specs, all) => {
    const work = workTree(repo);
    const apply = rels => { for (const rel of rels) { if (rel in work) repo.index[rel] = work[rel]; else delete repo.index[rel]; } };
    const pool = [...new Set([...Object.keys(work), ...Object.keys(repo.index)])];
    if (all) { apply(pool); return null; }
    for (const spec of specs) {
      const abs = termResolve(state.cwd, spec);
      if (!termInside(abs, repo.root)) return `fatal: ${spec}: '${spec}' is outside repository at '${repo.root}'`;
      if (termInside(abs, termJoin(repo.root, '.git'))) continue;
      const rel = abs === repo.root ? '' : abs.slice(repo.root.length + 1);
      const matches = pool.filter(path => !rel || path === rel || path.startsWith(rel + '/'));
      if (!matches.length) return `fatal: pathspec '${spec}' did not match any files`;
      apply(matches);
    }
    return null;
  };
  const fetchInto = (repo, remote) => {
    for (const [id, commit] of Object.entries(remote.commits)) if (!repo.commits[id]) repo.commits[id] = { ...commit, tree: { ...commit.tree } };
    const updates = [];
    for (const [name, id] of Object.entries(remote.branches)) {
      const ref = 'origin/' + name;
      if (repo.remoteRefs[ref] !== id) updates.push({ name, from: repo.remoteRefs[ref], to: id });
      repo.remoteRefs[ref] = id;
    }
    return updates;
  };
  const fetchText = (url, updates) => updates.length ? `From ${url}\n` + updates.map(u => u.from
    ? `   ${short(u.from)}..${short(u.to)}  ${u.name.padEnd(10)} -> origin/${u.name}`
    : ` * [new branch]      ${u.name.padEnd(10)} -> origin/${u.name}`).join('\n') : '';
  const remoteFor = (repo, name = 'origin') => {
    const url = repo.remotes[name];
    if (!url) return { error: fail(`fatal: '${name}' does not appear to be a git repository\nfatal: Could not read from remote repository.\n\nPlease make sure you have the correct access rights\nand the repository exists.`, 128) };
    const remote = state.remotes[url];
    if (!remote) return { error: fail(`remote: Repository not found.\nfatal: repository '${url.replace(/\/$/, '')}/' not found`, 128) };
    return { url, remote };
  };
  const validBranch = name => /^[\w.\-/]+$/.test(name) && !name.startsWith('-') && !name.endsWith('/') && !name.includes('..') && !name.endsWith('.lock');

  const git = {};
  git.init = () => {
    const root = state.cwd;
    if (state.repos[root] && fs[termJoin(root, '.git')]) return ok(`Reinitialized existing Git repository in ${root}/.git/\n`);
    ensureDir(termJoin(root, '.git'));
    state.repos[root] = { root, branch: 'main', branches: {}, commits: {}, index: {}, remotes: {}, upstream: {}, remoteRefs: {} };
    return ok(`Initialized empty Git repository in ${root}/.git/\n`);
  };
  git.status = (args, repo) => ok(statusText(repo, args.includes('-s') || args.includes('--short')));
  git.add = (args, repo) => {
    const all = args.includes('-A') || args.includes('--all');
    const specs = args.filter(arg => !arg.startsWith('-'));
    if (!all && !specs.length) return fail("Nothing specified, nothing added.\nhint: Maybe you wanted to say 'git add .'?");
    const error = stage(repo, specs, all);
    return error ? fail(error, 128) : ok();
  };
  git.commit = (args, repo) => {
    let message = null, all = false;
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === '-m' || arg === '--message') {
        if (i + 1 >= args.length) return fail("error: switch `m' requires a value", 129);
        message = message == null ? args[++i] : message + '\n\n' + args[++i];
      } else if (arg.startsWith('--message=')) message = arg.slice(10);
      else if (arg === '--all') all = true;
      else if (/^-[a-zA-Z]/.test(arg)) {
        const letters = arg.slice(1);
        for (let j = 0; j < letters.length; j++) {
          const ch = letters[j];
          if (ch === 'a') all = true;
          else if (ch === 'm') {
            const rest = letters.slice(j + 1);
            if (rest) message = rest;
            else { if (i + 1 >= args.length) return fail("error: switch `m' requires a value", 129); message = args[++i]; }
            break;
          } else if (ch !== 'v' && ch !== 'q') return fail(`error: unknown switch \`${ch}'`, 129);
        }
      } else return fail(`error: pathspec '${arg}' did not match any file(s) known to git`);
    }
    if (all) {
      const work = workTree(repo);
      for (const rel of Object.keys(repo.index)) { if (rel in work) repo.index[rel] = work[rel]; else delete repo.index[rel]; }
    }
    if (!repoStatus(repo).staged.length) return { out: statusText(repo, false), err: '', code: 1 };
    if (message == null) return fail('error: このターミナルではエディタを開けません。git commit -m "メッセージ" のようにメッセージを付けてください。');
    if (!message.trim()) return fail('Aborting commit due to empty commit message.');
    const parent = repo.branches[repo.branch] || null;
    const before = termTree(repo, parent);
    const id = termCommit(repo, parent, message, repo.index, parent ? repo.commits[parent].depth + 1 : 1);
    repo.branches[repo.branch] = id;
    const info = summary(before, repo.index);
    return ok(`[${repo.branch}${parent ? '' : ' (root-commit)'} ${short(id)}] ${message.split('\n')[0]}\n${info.line}\n${info.modes.map(m => m + '\n').join('')}`);
  };
  git.log = (args, repo) => {
    const head = repo.branches[repo.branch];
    if (!head) return fail(`fatal: your current branch '${repo.branch}' does not have any commits yet`, 128);
    let limit = Infinity;
    args.forEach((arg, i) => { const m = arg.match(/^-(\d+)$/); if (m) limit = Number(m[1]); if (arg === '-n') limit = Number(args[i + 1]); });
    const list = logOf(repo, head).slice(0, limit);
    if (args.includes('--oneline')) return ok(list.map(c => `${short(c.id)}${decorations(repo, c.id)} ${c.message.split('\n')[0]}\n`).join(''));
    return ok(list.map(c => `commit ${c.id}${decorations(repo, c.id)}\nAuthor: ${TERMINAL_USER} <${TERMINAL_USER}@example.com>\nDate:   Thu Nov 12 10:${String(c.depth % 60).padStart(2, '0')}:00 2026 +0900\n\n${c.message.split('\n').map(line => '    ' + line).join('\n')}\n`).join('\n'));
  };
  git.branch = (args, repo) => {
    const del = args.some(arg => arg === '-d' || arg === '-D' || arg === '--delete');
    const listAll = args.includes('-a') || args.includes('--all');
    const names = args.filter(arg => !arg.startsWith('-'));
    if (listAll || (!names.length && !del)) {
      const lines = Object.keys(repo.branches).sort().map(name => `${name === repo.branch ? '*' : ' '} ${name}`);
      if (listAll) for (const ref of Object.keys(repo.remoteRefs).sort()) lines.push(`  remotes/${ref}`);
      return ok(lines.map(line => line + '\n').join(''));
    }
    if (del) {
      const errors = [], out = [];
      if (!names.length) return fail('fatal: branch name required', 128);
      for (const name of names) {
        if (!repo.branches[name]) errors.push(`error: branch '${name}' not found`);
        else if (name === repo.branch) errors.push(`error: cannot delete branch '${name}' used by worktree at '${repo.root}'`);
        else { out.push(`Deleted branch ${name} (was ${short(repo.branches[name])}).\n`); delete repo.branches[name]; delete repo.upstream[name]; }
      }
      return done(out.join(''), errors);
    }
    const [name, start] = names;
    if (!validBranch(name)) return fail(`fatal: '${name}' is not a valid branch name`, 128);
    if (repo.branches[name]) return fail(`fatal: a branch named '${name}' already exists`, 128);
    const base = start ? (repo.branches[start] || repo.remoteRefs[start]) : repo.branches[repo.branch];
    if (!base) return fail(`fatal: not a valid object name: '${start || repo.branch}'`, 128);
    repo.branches[name] = base;
    return ok();
  };
  const switchBranch = (repo, name, create, startPoint, command) => {
    if (create) {
      if (!name) return fail(`error: switch \`${command === 'checkout' ? 'b' : 'c'}' requires a value`, 129);
      if (!validBranch(name)) return fail(`fatal: '${name}' is not a valid branch name`, 128);
      if (repo.branches[name]) return fail(`fatal: a branch named '${name}' already exists`, 128);
      const base = startPoint ? (repo.branches[startPoint] || repo.remoteRefs[startPoint]) : repo.branches[repo.branch];
      if (startPoint && !base) return fail(`fatal: invalid reference: ${startPoint}`, 128);
      if (!base) { repo.branch = name; return ok(`Switched to a new branch '${name}'\n`); }
      const error = moveTo(repo, name, base, 'checkout');
      if (error) return error;
      repo.branches[name] = base;
      if (startPoint && repo.remoteRefs[startPoint]) repo.upstream[name] = startPoint;
      return ok(`Switched to a new branch '${name}'\n`);
    }
    if (!name) return fail(command === 'checkout' ? "error: you must specify a branch to checkout" : 'fatal: missing branch or commit argument', 128);
    if (name === repo.branch) return ok(`Already on '${name}'\n`);
    const target = repo.branches[name];
    if (!target && repo.remoteRefs['origin/' + name]) {
      const error = moveTo(repo, name, repo.remoteRefs['origin/' + name], 'checkout');
      if (error) return error;
      repo.branches[name] = repo.remoteRefs['origin/' + name];
      repo.upstream[name] = 'origin/' + name;
      return ok(`branch '${name}' set up to track 'origin/${name}'.\nSwitched to a new branch '${name}'\n`);
    }
    if (!target) return command === 'checkout'
      ? fail(`error: pathspec '${name}' did not match any file(s) known to git`)
      : fail(`fatal: invalid reference: ${name}`, 128);
    const error = moveTo(repo, name, target, 'checkout');
    return error || ok(`Switched to branch '${name}'\n`);
  };
  const createArgs = (args, letters) => {
    const index = args.findIndex(arg => letters.includes(arg));
    if (index < 0) return null;
    return { name: args[index + 1], start: args.filter((arg, i) => i !== index && i !== index + 1 && !arg.startsWith('-'))[0] };
  };
  git.switch = (args, repo) => {
    const create = createArgs(args, ['-c', '-C', '--create']);
    if (create) return switchBranch(repo, create.name, true, create.start, 'switch');
    return switchBranch(repo, args.filter(arg => !arg.startsWith('-'))[0], false, null, 'switch');
  };
  git.restore = (args, repo) => {
    const staged = args.includes('--staged') || args.includes('-S');
    const specs = args.filter(arg => !arg.startsWith('-'));
    if (!specs.length) return fail('fatal: you must specify path(s) to restore', 128);
    const head = termTree(repo, repo.branches[repo.branch]), work = workTree(repo);
    for (const spec of specs) {
      const abs = termResolve(state.cwd, spec);
      const rel = abs === repo.root ? '' : abs.slice(repo.root.length + 1);
      const pool = staged ? [...new Set([...Object.keys(head), ...Object.keys(repo.index)])] : Object.keys(repo.index);
      const matches = termInside(abs, repo.root) ? pool.filter(path => !rel || path === rel || path.startsWith(rel + '/')) : [];
      if (!matches.length) return fail(`error: pathspec '${spec}' did not match any file(s) known to git`);
      for (const path of matches) {
        if (staged) { if (path in head) repo.index[path] = head[path]; else delete repo.index[path]; }
        else if (work[path] !== repo.index[path]) writeFile(termJoin(repo.root, path), repo.index[path]);
      }
    }
    return ok();
  };
  git.checkout = (args, repo) => {
    const create = createArgs(args, ['-b', '-B']);
    if (create) return switchBranch(repo, create.name, true, create.start, 'checkout');
    const dash = args.indexOf('--');
    if (dash >= 0) return git.restore(args.slice(dash + 1), repo);
    const names = args.filter(arg => !arg.startsWith('-'));
    if (names.length >= 1 && !repo.branches[names[0]] && !repo.remoteRefs['origin/' + names[0]]) {
      const abs = termResolve(state.cwd, names[0]);
      if (termInside(abs, repo.root) && abs !== repo.root && Object.keys(repo.index).some(path => { const rel = abs.slice(repo.root.length + 1); return path === rel || path.startsWith(rel + '/'); })) {
        const result = git.restore(names, repo);
        return result.code ? result : ok(`Updated ${names.length} path${names.length > 1 ? 's' : ''} from the index\n`);
      }
    }
    return switchBranch(repo, names[0], false, null, 'checkout');
  };
  git.remote = (args, repo) => {
    if (args[0] === 'add') {
      const [, name, url] = args;
      if (!name || !url) return fail('usage: git remote add [<options>] <name> <url>', 129);
      if (repo.remotes[name]) return fail(`error: remote ${name} already exists.`, 3);
      repo.remotes[name] = url;
      return ok();
    }
    if (args[0] === '-v' || args[0] === '--verbose') return ok(Object.entries(repo.remotes).map(([name, url]) => `${name}\t${url} (fetch)\n${name}\t${url} (push)\n`).join(''));
    if (args.length) return fail(`error: unknown subcommand: \`${args[0]}'`, 129);
    return ok(Object.keys(repo.remotes).map(name => name + '\n').join(''));
  };
  git.fetch = (args, repo) => {
    const { url, remote, error } = remoteFor(repo, args.filter(arg => !arg.startsWith('-'))[0] || 'origin');
    if (error) return error;
    return { out: '', err: fetchText(url, fetchInto(repo, remote)), code: 0 };
  };
  git.pull = (args, repo) => {
    const names = args.filter(arg => !arg.startsWith('-'));
    const { url, remote, error } = remoteFor(repo, names[0] || 'origin');
    if (error) return error;
    let branch = names[1];
    if (!branch) {
      const upstream = repo.upstream[repo.branch];
      if (!upstream) return fail(`There is no tracking information for the current branch.\nPlease specify which branch you want to merge with.\nSee git-pull(1) for details.\n\n    git pull <remote> <branch>\n\nIf you wish to set tracking information for this branch you can do so with:\n\n    git branch --set-upstream-to=origin/<branch> ${repo.branch}\n`);
      branch = upstream.replace(/^origin\//, '');
    }
    const fetched = fetchText(url, fetchInto(repo, remote));
    const target = repo.remoteRefs['origin/' + branch];
    if (!target) return fail(`${fetched ? fetched + '\n' : ''}fatal: couldn't find remote ref ${branch}`);
    const head = repo.branches[repo.branch];
    if (head && ancestors(repo, head).includes(target)) return { out: 'Already up to date.\n', err: fetched, code: 0 };
    if (head && !ancestors(repo, target).includes(head)) return fail(`${fetched ? fetched + '\n' : ''}hint: You have divergent branches and need to specify how to reconcile them.\nfatal: Need to specify how to reconcile divergent branches.`, 128);
    const fromTree = termTree(repo, head), toTree = termTree(repo, target);
    const { blocked, untrackedHit } = conflicts(repo, fromTree, toTree);
    if (blocked.length) return fail(`${fetched ? fetched + '\n' : ''}Updating ${short(head)}..${short(target)}\nerror: Your local changes to the following files would be overwritten by merge:\n${blocked.map(p => '\t' + p).join('\n')}\nPlease commit your changes or stash them before you merge.\nAborting`);
    if (untrackedHit.length) return fail(`${fetched ? fetched + '\n' : ''}error: The following untracked working tree files would be overwritten by merge:\n${untrackedHit.map(p => '\t' + p).join('\n')}\nPlease move or remove them before you merge.\nAborting`);
    setTree(repo, fromTree, toTree);
    repo.branches[repo.branch] = target;
    const info = summary(fromTree, toTree);
    const width = Math.max(0, ...info.lines.map(l => l.path.length));
    const stat = info.lines.map(l => ` ${l.path.padEnd(width)} | ${String(l.diff.added + l.diff.removed).padStart(2)} ${'+'.repeat(Math.min(l.diff.added, 30))}${'-'.repeat(Math.min(l.diff.removed, 30))}\n`).join('');
    return { out: `Updating ${short(head)}..${short(target)}\nFast-forward\n${stat}${info.line}\n${info.modes.map(m => m + '\n').join('')}`, err: fetched, code: 0 };
  };
  git.push = (args, repo) => {
    const setUpstream = args.includes('-u') || args.includes('--set-upstream');
    const names = args.filter(arg => !arg.startsWith('-'));
    let remoteName = names[0], branch = names[1];
    if (!remoteName) {
      const upstream = repo.upstream[repo.branch];
      if (!upstream) {
        if (!Object.keys(repo.remotes).length) return fail('fatal: No configured push destination.\nEither specify the URL from the command-line or configure a remote repository using\n\n    git remote add <name> <url>\n\nand then push using the remote name\n\n    git push <name>\n', 128);
        return fail(`fatal: The current branch ${repo.branch} has no upstream branch.\nTo push the current branch and set the remote as upstream, use\n\n    git push --set-upstream origin ${repo.branch}\n`, 128);
      }
      remoteName = 'origin'; branch = upstream.replace(/^origin\//, '');
    }
    branch = branch || repo.branch;
    const { url, remote, error } = remoteFor(repo, remoteName);
    if (error) return error;
    const local = repo.branches[branch];
    if (!local) return fail(`error: src refspec ${branch} does not match any\nerror: failed to push some refs to '${url}'`);
    const current = remote.branches[branch];
    if (current === local) {
      if (setUpstream) repo.upstream[branch] = 'origin/' + branch;
      return { out: '', err: 'Everything up-to-date', code: 0 };
    }
    if (current && !ancestors(repo, local).includes(current)) return fail(`To ${url}\n ! [rejected]        ${branch} -> ${branch} (fetch first)\nerror: failed to push some refs to '${url}'\nhint: Updates were rejected because the remote contains work that you do not\nhint: have locally. This is usually caused by another repository pushing to\nhint: the same ref. If you want to integrate the remote changes, use\nhint: 'git pull' before pushing again.`);
    for (const id of ancestors(repo, local)) if (!remote.commits[id]) remote.commits[id] = { ...repo.commits[id], tree: { ...repo.commits[id].tree } };
    remote.branches[branch] = local;
    repo.remoteRefs['origin/' + branch] = local;
    let message = `To ${url}\n` + (current ? `   ${short(current)}..${short(local)}  ${branch} -> ${branch}` : ` * [new branch]      ${branch} -> ${branch}`);
    if (setUpstream) { repo.upstream[branch] = 'origin/' + branch; message += `\nbranch '${branch}' set up to track 'origin/${branch}'.`; }
    return { out: '', err: message, code: 0 };
  };
  git.clone = args => {
    const [url, dirName] = args.filter(arg => !arg.startsWith('-'));
    if (!url) return fail('fatal: You must specify a repository to clone.\n\nusage: git clone [<options>] [--] <repo> [<dir>]', 129);
    const name = dirName || url.replace(/\/+$/, '').replace(/\.git$/, '').split(/[/:]/).pop();
    const root = termResolve(state.cwd, name);
    if (fs[root] && (fs[root].type !== 'dir' || childrenOf(root).length)) return fail(`fatal: destination path '${name}' already exists and is not an empty directory.`, 128);
    const remote = state.remotes[url];
    if (!remote) return fail(`Cloning into '${name}'...\nremote: Repository not found.\nfatal: repository '${url.replace(/\/$/, '')}/' not found`, 128);
    if (fs[termParent(root)]?.type !== 'dir') return fail(`fatal: could not create leading directories of '${name}': No such file or directory`, 128);
    ensureDir(termJoin(root, '.git'));
    const repo = { root, branch: 'main', branches: {}, commits: {}, index: {}, remotes: { origin: url }, upstream: {}, remoteRefs: {} };
    state.repos[root] = repo;
    fetchInto(repo, remote);
    const main = remote.branches.main ? 'main' : Object.keys(remote.branches)[0];
    if (!main) return { out: '', err: `Cloning into '${name}'...\nwarning: You appear to have cloned an empty repository.`, code: 0 };
    repo.branch = main;
    repo.branches[main] = remote.branches[main];
    repo.upstream[main] = 'origin/' + main;
    setTree(repo, {}, termTree(repo, remote.branches[main]));
    const n = Object.keys(remote.commits).length * 3;
    return { out: '', err: `Cloning into '${name}'...\nremote: Enumerating objects: ${n}, done.\nremote: Total ${n} (delta 0), reused 0 (delta 0), pack-reused 0\nReceiving objects: 100% (${n}/${n}), done.`, code: 0 };
  };
  git.config = () => ok();
  const gitUnsupported = ['diff', 'merge', 'rebase', 'stash', 'reset', 'rm', 'show', 'tag', 'revert', 'cherry-pick', 'blame', 'reflog', 'mv', 'grep', 'bisect', 'clean', 'gc', 'describe', 'shortlog', 'archive', 'worktree', 'submodule'];
  commands.git = args => {
    const [sub, ...rest] = args;
    if (!sub || ['help', '--help', '-h'].includes(sub)) return ok('usage: git <command> [<args>]\n\nこの試験用ターミナルで使える git コマンド:\n   init status add commit log branch switch checkout restore clone pull push fetch remote\n');
    if (sub === '--version' || sub === 'version') return ok('git version 2.43.0\n');
    if (gitUnsupported.includes(sub)) return fail(`git ${sub}: この試験用ターミナルでは使えません（git help で使えるコマンドを確認できます）`);
    if (!Object.hasOwn(git, sub)) return fail(`git: '${sub}' is not a git command. See 'git --help'.`);
    if (['init', 'clone', 'config'].includes(sub)) return git[sub](rest);
    const repo = findRepo();
    if (!repo) return fail('fatal: not a git repository (or any of the parent directories): .git', 128);
    return git[sub](rest, repo);
  };

  const redirectError = (path, name) => {
    if (fs[path]?.type === 'dir') return fail(`bash: ${name}: Is a directory`);
    if (fs[termParent(path)]?.type !== 'dir') return fail(`bash: ${name}: No such file or directory`);
    return null;
  };
  const runSimple = tokens => {
    const words = [];
    let redirect = null;
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.op === '>' || token.op === '>>' || token.op === '<') {
        const next = tokens[i + 1];
        if (!next || next.op) return fail(`bash: syntax error near unexpected token \`${next?.op || 'newline'}'`, 2);
        const target = expand(next);
        if (target.length > 1) return fail(`bash: ${next.value}: ambiguous redirect`);
        if (token.op === '<') { if (!fs[termResolve(state.cwd, target[0])]) return fail(`bash: ${target[0]}: No such file or directory`); }
        else redirect = { append: token.op === '>>', name: target[0] };
        i++;
        continue;
      }
      words.push(...expand(token));
    }
    let result;
    if (!words.length) result = ok();
    else {
      const [name, ...args] = words;
      result = Object.hasOwn(commands, name) ? commands[name](args) : fail(`bash: ${name}: command not found`, 127);
    }
    if (redirect && !result.clear) {
      const path = termResolve(state.cwd, redirect.name);
      const error = redirectError(path, redirect.name);
      if (error) return error;
      const previous = redirect.append && fs[path]?.type === 'file' ? fs[path].content : '';
      writeFile(path, (previous + result.out).slice(0, MAX_FILE));
      result = { ...result, out: '' };
    }
    return result;
  };

  function run(line) {
    const text = String(line ?? '');
    if (text.length > MAX_TERMINAL_COMMAND_LENGTH) return { output: 'bash: コマンドが長すぎます。\n', code: 1, clear: false };
    if (text.trim()) state.history.push(text);
    let tokens;
    try { tokens = termTokenize(text); }
    catch (error) { return { output: `bash: ${error.message}\n`, code: 2, clear: false }; }
    const chunks = [];
    let segment = [], last = 0, clear = false, skip = false, broken = false;
    const flush = connector => {
      if (!segment.length) {
        if (connector) { chunks.push(`bash: syntax error near unexpected token \`${connector}'\n`); last = 2; broken = true; }
        return;
      }
      if (!skip) {
        if (segment.some(t => t.op === '|' || t.op === '&')) {
          chunks.push('bash: この試験用ターミナルではパイプ（|）とバックグラウンド実行（&）は使えません\n'); last = 1;
        } else {
          const result = runSimple(segment);
          if (result.clear) { chunks.length = 0; clear = true; }
          if (result.out) chunks.push(result.out);
          if (result.err) chunks.push(result.err.endsWith('\n') ? result.err : result.err + '\n');
          last = result.code;
        }
      }
      segment = [];
      skip = connector === '&&' ? last !== 0 : connector === '||' ? last === 0 : false;
    };
    for (const token of tokens) {
      if (broken) break;
      if (token.op === '&&' || token.op === '||' || token.op === ';') flush(token.op);
      else segment.push(token);
    }
    if (!broken) flush(null);
    let output = chunks.join('');
    if (output.length > MAX_OUTPUT) output = output.slice(0, MAX_OUTPUT) + '\n…（出力が長いため省略しました）\n';
    return { output, code: last, clear };
  }

  const prompt = () => `${TERMINAL_USER}@${TERMINAL_HOST}:${termDisplay(state.cwd)}$ `;

  function complete(line) {
    const match = line.match(/(^|[\s;&|<>])([^\s;&|<>]*)$/);
    const word = match ? match[2] : '';
    const before = line.slice(0, line.length - word.length);
    let candidates;
    if ((!before.trim() || /(&&|\|\||;)\s*$/.test(before)) && !word.includes('/')) {
      candidates = Object.keys(commands).filter(name => name.startsWith(word)).map(text => ({ text, dir: false }));
    } else if (/(^|[\s;&])git\s+$/.test(before)) {
      candidates = ['add', 'branch', 'checkout', 'clone', 'commit', 'fetch', 'init', 'log', 'pull', 'push', 'remote', 'restore', 'status', 'switch'].filter(name => name.startsWith(word)).map(text => ({ text, dir: false }));
    } else if (/(^|[\s;&])git\s+(switch|checkout|branch)(\s+-[a-zA-Z]+)*\s+$/.test(before)) {
      const repo = findRepo();
      candidates = repo ? Object.keys(repo.branches).filter(name => name.startsWith(word)).map(text => ({ text, dir: false })) : [];
    } else {
      const slash = word.lastIndexOf('/');
      const dirPart = slash >= 0 ? word.slice(0, slash + 1) : '', prefix = word.slice(slash + 1);
      const dir = termResolve(state.cwd, dirPart || '.');
      candidates = fs[dir]?.type === 'dir'
        ? childrenOf(dir).filter(name => name.startsWith(prefix) && (prefix.startsWith('.') || !name.startsWith('.'))).map(name => ({ text: dirPart + name, dir: fs[termJoin(dir, name)].type === 'dir' }))
        : [];
    }
    if (!candidates.length) return { line, candidates: [] };
    if (candidates.length === 1) return { line: before + candidates[0].text + (candidates[0].dir ? '/' : ' '), candidates: [] };
    let common = candidates[0].text;
    for (const candidate of candidates) while (!candidate.text.startsWith(common)) common = common.slice(0, -1);
    return { line: before + (common.length > word.length ? common : word), candidates: candidates.map(c => c.text.slice(c.text.lastIndexOf('/') + 1) + (c.dir ? '/' : '')) };
  }

  const repoView = repo => {
    const status = repoStatus(repo);
    const head = repo.branches[repo.branch] || null;
    return {
      root: termDisplay(repo.root), branch: repo.branch, head, branches: { ...repo.branches },
      remote: repo.remotes.origin || null, upstream: { ...repo.upstream },
      log: logOf(repo, head).map(c => ({ id: c.id, message: c.message, files: { ...c.tree } })),
      staged: status.staged.map(s => s.path), unstaged: status.unstaged.map(s => s.path), untracked: status.untracked,
      index: { ...repo.index }
    };
  };
  function helpers(extra = {}) {
    const abs = path => termResolve(TERMINAL_HOME, path);
    cleanRepos();
    return {
      cwd: termDisplay(state.cwd),
      exists: path => Boolean(fs[abs(path)]),
      isDir: path => fs[abs(path)]?.type === 'dir',
      isFile: path => fs[abs(path)]?.type === 'file',
      read: path => fs[abs(path)]?.type === 'file' ? fs[abs(path)].content : null,
      list: path => fs[abs(path)]?.type === 'dir' ? childrenOf(abs(path)) : [],
      repo: path => state.repos[abs(path)] ? repoView(state.repos[abs(path)]) : null,
      repos: () => Object.values(state.repos).map(repoView),
      remote: url => {
        const remote = state.remotes[url];
        if (!remote) return null;
        return { branches: { ...remote.branches }, log: (branch = 'main') => logOf(remote, remote.branches[branch]).map(c => ({ id: c.id, message: c.message, files: { ...c.tree } })) };
      },
      ...extra
    };
  }
  function snapshot() {
    cleanRepos();
    const files = {};
    let budget = 12000;
    for (const path of Object.keys(fs).sort()) {
      if (!termInside(path, TERMINAL_HOME) || path === TERMINAL_HOME) continue;
      const node = fs[path];
      if (node.type === 'dir') { files[termDisplay(path) + '/'] = null; continue; }
      const content = node.content.length > 300 ? node.content.slice(0, 300) + '…' : node.content;
      budget -= content.length + path.length;
      files[termDisplay(path)] = budget > 0 ? content : `（${node.content.length}文字）`;
    }
    const repos = {};
    for (const repo of Object.values(state.repos)) {
      const view = repoView(repo);
      repos[view.root] = {
        branch: view.branch, branches: Object.fromEntries(Object.entries(view.branches).map(([k, v]) => [k, short(v)])),
        log: view.log.slice(0, 20).map(c => `${short(c.id)} ${c.message.split('\n')[0]}`),
        staged: view.staged, unstaged: view.unstaged, untracked: view.untracked, remote: view.remote
      };
    }
    const remotes = {};
    for (const [url, remote] of Object.entries(state.remotes)) remotes[url] = Object.fromEntries(Object.entries(remote.branches).map(([k, v]) => [k, short(v)]));
    return { cwd: termDisplay(state.cwd), files, repos, remotes };
  }
  return { run, prompt, complete, snapshot, helpers };
}

export function terminalCommands(answer) {
  let value = answer;
  if (typeof value === 'string') { try { value = JSON.parse(value); } catch { return null; } }
  if (!value || typeof value !== 'object' || Array.isArray(value) || !Array.isArray(value.commands)) return null;
  if (value.commands.length > MAX_TERMINAL_COMMANDS || value.commands.some(command => typeof command !== 'string' || command.length > MAX_TERMINAL_COMMAND_LENGTH)) return null;
  return value.commands;
}

const MAX_VALUE_JSON = 19000;

// 回答ログ（スプレッドシート）に入る大きさに収めます。採点はコマンドの再実行で行うので、state は記録用です。
export function terminalValue(commands, resets, state) {
  const value = { commands, resets, state };
  if (JSON.stringify(value).length <= MAX_VALUE_JSON) return value;
  const lighter = { ...value, state: { cwd: state.cwd, repos: state.repos, remotes: state.remotes, files: Object.fromEntries(Object.keys(state.files).map(key => [key, null])), truncated: true } };
  if (JSON.stringify(lighter).length <= MAX_VALUE_JSON) return lighter;
  return { commands, resets, state: { cwd: state.cwd, truncated: true } };
}

export function isTerminalAnswer(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && terminalCommands(value) && JSON.stringify(value).length <= 20000);
}

export function gradeTerminalAnswer(item, answer) {
  const rule = item.grading;
  const result = { itemId: item.id, passed: false, feedback: rule.feedback, checks: [] };
  const commands = terminalCommands(answer);
  if (!commands) { result.feedback = 'ターミナルの回答を読み取れません。「やり直す」を押して、もう一度コマンドを入力してください。'; return result; }
  if (!commands.some(command => command.trim())) { result.feedback = 'ターミナルにコマンドを入力してください。'; return result; }
  try {
    const shell = createShell(rule.config.initial || {});
    for (const command of commands) shell.run(command);
    const assert = (condition, message = '操作後の状態が条件と一致しません。') => { if (!condition) throw new Error(message); };
    new Function('h', rule.config.check || '')(shell.helpers({ assert, commands: [...commands] }));
    result.passed = true;
    result.feedback = '正解です。操作後の状態が条件を満たしています。';
    result.checks.push({ label: '操作後の状態', passed: true });
  } catch (error) {
    result.checks.push({ label: error.message, passed: false });
    result.feedback = `${rule.feedback}\n${error.message}`;
  }
  return result;
}
