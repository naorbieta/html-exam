import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { transform } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { parseFrontmatter } from './frontmatter.mjs';

export const practiceCourseFolders = {
  js: 'JavaScript / 初級',
  'html-css': 'HTML・CSS・Web基礎'
};

export const examCourseFolders = {
  'html-css': '試験 / HTML・CSS',
  javascript: '試験 / JavaScript',
  php: '試験 / PHP',
  git: '試験 / Git',
  terminal: '試験 / ターミナル操作',
  design: '試験 / デザイン理論'
};

export const courseFolders = practiceCourseFolders;

export const answerTypes = {
  '短文': 'short_text',
  '長文': 'paragraph',
  '単一選択': 'multiple_choice',
  '複数選択': 'checkboxes',
  'コード': 'code',
  'ページ編集': 'dom_task',
  'CSS調査': 'inspection',
  'ファイル': 'file'
};

const typeNames = Object.fromEntries(Object.entries(answerTypes).map(([ja, en]) => [en, ja]));

function fail(file, message) {
  throw new Error(`${path.relative(process.cwd(), file)}: ${message}`);
}

function enabled(value, fallback = false) {
  if (value === '' || value == null) return fallback;
  if (typeof value === 'boolean') return value;
  return ['はい', 'true', true].includes(typeof value === 'string' ? value.toLowerCase() : value);
}

function lines(value) {
  if (Array.isArray(value)) return value.map(item => String(item)).filter(item => item !== '');
  if (value == null || value === '') return [];
  return String(value).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}

function asType(value, file) {
  if (answerTypes[value]) return answerTypes[value];
  if (typeNames[value]) return value;
  fail(file, `回答形式は ${Object.keys(answerTypes).join('・')} から選んでください。`);
}

export function functionBody(fn) {
  const source = fn.toString().trim();
  const start = source.indexOf('{');
  const end = source.lastIndexOf('}');
  if (start >= 0 && end > start) return source.slice(start + 1, end).replace(/^\n/, '').replace(/\s+$/, '');
  const arrow = source.indexOf('=>');
  if (arrow >= 0) return source.slice(arrow + 2).trim();
  throw new Error('採点関数の本体を取り出せませんでした。');
}

function normalizeGrader(exported, file) {
  if (!exported || typeof exported !== 'object' || Array.isArray(exported)) fail(file, 'default export は採点オブジェクトにしてください。');
  const { kind, check, cases, ...rest } = exported;
  if (!['text', 'code', 'render', 'dom', 'file', 'manual'].includes(kind)) fail(file, 'kind を確認してください。');
  const config = { ...rest };
  if (typeof check === 'function') config.check = functionBody(check);
  else if (typeof check === 'string') config.check = check;
  if (cases) {
    config.cases = cases.map((scenario, index) => {
      const next = { ...scenario };
      if (typeof scenario.check === 'function') next.check = functionBody(scenario.check);
      if (next.check === undefined) delete next.check;
      return next;
    });
  }
  return { kind, config };
}

export async function compileGraderFile(file) {
  const source = await readFile(file, 'utf8');
  const result = await transform(source, { loader: 'ts', format: 'esm', target: 'es2022', charset: 'utf8' });
  const moduleUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(result.code + `\n//# sourceURL=${pathToFileURL(file)}`)}`;
  const mod = await import(moduleUrl);
  return normalizeGrader(mod.default, file);
}

function inferMethod(data, hasGrader) {
  if (data.method) return data.method;
  if (hasGrader) return '登録済み';
  if (asTypeSafe(data.type) === 'file') return 'ファイル拡張子';
  return '正解と照合';
}

function asTypeSafe(value) {
  return answerTypes[value] || (typeNames[value] ? value : null);
}

function answersOf(data) {
  if (data.answers != null) return lines(data.answers);
  if (data.answer != null) return lines(data.answer);
  if (data.correct != null) return lines(data.correct);
  return [];
}

function buildSimpleGrader(data, type, file) {
  const method = inferMethod(data, false);
  const correct = answersOf(data);
  if (method === 'ファイル拡張子') {
    if (type !== 'file' || correct.length !== 1 || !/^\.[a-z\d]+$/i.test(correct[0])) {
      fail(file, 'ファイル問題の正解には「.js」のような拡張子を1つ書いてください。');
    }
    return { kind: 'file', config: { extension: correct[0] } };
  }
  if (method === 'コンソール出力') {
    if (!correct.length || type !== 'code') fail(file, 'コンソール出力の問題は、正解に期待する出力を1行ずつ書いてください。');
    return { kind: 'code', config: { check: `h.assert(JSON.stringify(h.logText()) === ${JSON.stringify(JSON.stringify(correct))}, 'コンソールの出力を確認してください。');` } };
  }
  if (method === '正解と照合') {
    if (!correct.length) fail(file, '正解を入力してください。');
    if (type === 'code') fail(file, 'コード問題には採点TSを置くか、method: コンソール出力 を指定してください。');
    return { kind: 'text', config: type === 'checkboxes' ? { acceptSets: [correct] } : { accept: correct } };
  }
  fail(file, `${method} の採点を使う場合は、同じ名前の .ts ファイルに採点を書いてください。`);
}

function exampleOf(data, type, grader, file) {
  if (data.example != null && data.example !== '') return String(data.example);
  if (grader.kind === 'file') {
    const ext = grader.config.extension;
    return JSON.stringify({ name: 'example' + ext, content: '' });
  }
  if (grader.kind === 'text') {
    const correct = grader.config.accept || grader.config.acceptSets?.[0];
    return type === 'checkboxes' ? JSON.stringify(correct || []) : (correct?.[0] ?? '');
  }
  return '';
}

async function listLessonsIn(base, folders, found) {
  let entries;
  try { entries = await readdir(base, { withFileTypes: true }); }
  catch { return; }
  const names = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
  const preferred = Object.keys(folders);
  const categories = [...preferred.filter(name => names.includes(name)), ...names.filter(name => !preferred.includes(name)).sort()];
  for (const name of categories) {
    const dir = path.join(base, name);
    const lessons = await readdir(dir, { withFileTypes: true });
    for (const lesson of lessons.filter(entry => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
      found.push({ category: name, slug: lesson.name, dir: path.join(dir, lesson.name), courseDefault: folders[name] });
    }
  }
}

async function listLessonDirs(root) {
  const found = [];
  await listLessonsIn(path.join(root, 'data', 'exam'), examCourseFolders, found);
  await listLessonsIn(path.join(root, 'data', 'test'), practiceCourseFolders, found);
  if (!found.length) throw new Error('data/exam または data/test にレッスンフォルダがありません。');
  return found;
}

async function readQuestion(file, graderFile) {
  const { data, body } = parseFrontmatter(await readFile(file, 'utf8'));
  const type = asType(data.type, file);
  const id = data.id;
  const position = Number(data.number ?? data.position);
  if (!id) fail(file, 'id を書いてください。');
  if (!Number.isInteger(position) || position < 1) fail(file, 'number には1以上の整数を指定してください。');
  if (!String(data.title ?? '').trim()) fail(file, 'title（設問文）を書いてください。');
  const hasGrader = Boolean(graderFile);
  const grader = hasGrader ? await compileGraderFile(graderFile) : buildSimpleGrader(data, type, file);
  const options = lines(data.choices ?? data.options);
  if (['multiple_choice', 'checkboxes'].includes(type)) {
    if (options.length < 2 || new Set(options.map(value => value.normalize('NFKC').replace(/\s/g, '').toLowerCase())).size !== options.length) {
      fail(file, '選択肢を重複なしで2つ以上入力してください。');
    }
    const correct = grader.config.accept || grader.config.acceptSets?.[0] || [];
    if (grader.kind === 'text' && (grader.config.accept || grader.config.acceptSets)) {
      if (!correct.length || correct.some(value => !options.includes(value)) || (type === 'multiple_choice' && correct.length !== 1)) {
        fail(file, '正解には選択肢の文言をそのまま入力してください。単一選択の正解は1つです。');
      }
    }
  }
  return {
    id,
    position,
    type,
    title: String(data.title),
    description: body || String(data.description ?? ''),
    required: enabled(data.required, true),
    context: data.context == null ? '' : String(data.context),
    language: data.language == null ? '' : String(data.language),
    referenceEditable: enabled(data.reference_editable ?? data.referenceEditable, false),
    options,
    grader: {
      kind: grader.kind,
      config: grader.config,
      example: exampleOf(data, type, grader, file),
      feedback: data.feedback == null ? '回答をもう一度確認してください。' : String(data.feedback),
      hint: data.hint == null ? '' : String(data.hint),
      starter: data.starter == null ? '' : String(data.starter)
    }
  };
}

async function collectImages(lessonDir, data, lessonId, lessonTitle) {
  const images = [];
  const listed = data.images || [];
  for (const [index, image] of listed.entries()) {
    const file = image.file || image.path;
    if (!file) fail(path.join(lessonDir, 'lesson.md'), 'images の file を書いてください。');
    const abs = path.isAbsolute(file) ? file : path.join(lessonDir, file.startsWith('images/') ? file : path.join('images', path.basename(file)));
    // also allow file relative as written
    let resolved = abs;
    try { await stat(resolved); }
    catch {
      try {
        resolved = path.join(lessonDir, file);
        await stat(resolved);
      } catch {
        fail(path.join(lessonDir, 'lesson.md'), `画像ファイルがありません: ${file}`);
      }
    }
    const logical = image.path || (path.basename(file).match(/^(quiz|web)-/) ? `images/${path.basename(file)}` : `images/${path.basename(file)}`);
    images.push({
      position: Number(image.position) || index + 1,
      path: logical,
      alt: image.alt || lessonTitle,
      file: resolved
    });
  }
  return images;
}

export async function loadLessons(root) {
  const tables = {
    quizzes: [['id', 'number', 'title', 'description', 'course']],
    items: [['id', 'quiz_id', 'position', 'type', 'title', 'description', 'required', 'context', 'language', 'reference_editable']],
    options: [['item_id', 'position', 'value']],
    images: [['quiz_id', 'position', 'path', 'alt']],
    graders: [['item_id', 'kind', 'config', 'example', 'feedback', 'hint', 'starter']]
  };
  const imageFiles = {};
  const ids = new Set();
  const itemIds = new Set();
  const lessons = await listLessonDirs(root);
  for (const lesson of lessons) {
    const lessonFile = path.join(lesson.dir, 'lesson.md');
    let source;
    try { source = await readFile(lessonFile, 'utf8'); }
    catch { fail(lesson.dir, 'lesson.md がありません。'); }
    const { data, body } = parseFrontmatter(source);
    const course = data.course || lesson.courseDefault;
    const number = Number(data.number);
    const title = String(data.title || '').trim();
    const id = String(data.id || '').trim();
    if (!course || !title || !Number.isInteger(number) || number < 1) fail(lessonFile, 'course・number・title を書いてください。');
    if (!id) fail(lessonFile, 'id を書いてください。');
    if (ids.has(id)) fail(lessonFile, 'レッスンIDが重複しています。');
    ids.add(id);
    tables.quizzes.push([id, number, title, body || String(data.description ?? ''), course]);
    for (const image of await collectImages(lesson.dir, data, id, title)) {
      tables.images.push([id, image.position, image.path, image.alt]);
      imageFiles[image.path] = image.file;
    }
    const files = (await readdir(lesson.dir)).filter(name => name.endsWith('.md') && name !== 'lesson.md').sort();
    if (!files.length) fail(lessonFile, '設問の Markdown がありません。');
    const seenPositions = new Set();
    for (const name of files) {
      const file = path.join(lesson.dir, name);
      const graderPath = file.replace(/\.md$/, '.ts');
      let graderFile;
      try { await stat(graderPath); graderFile = graderPath; } catch {}
      const question = await readQuestion(file, graderFile);
      if (itemIds.has(question.id)) fail(file, '設問IDが重複しています。');
      if (seenPositions.has(question.position)) fail(file, '同じレッスン内で設問番号が重複しています。');
      itemIds.add(question.id);
      seenPositions.add(question.position);
      tables.items.push([
        question.id, id, question.position, question.type, question.title, question.description,
        String(question.required), question.context, question.language, String(question.referenceEditable)
      ]);
      question.options.forEach((value, index) => tables.options.push([question.id, index + 1, value]));
      const g = question.grader;
      tables.graders.push([question.id, g.kind, JSON.stringify(g.config), g.example, g.feedback, g.hint, g.starter]);
    }
  }
  return { tables, imageFiles };
}
