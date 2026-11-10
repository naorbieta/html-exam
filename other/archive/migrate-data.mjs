import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv } from './csv.mjs';
import { stringifyFrontmatter } from './frontmatter.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const courseFolder = {
  'JavaScript / 初級': 'js',
  'HTML・CSS・Web基礎': 'html-css'
};

const slugs = {
  'quiz-01': 'hajimete-no-javascript',
  'quiz-02': 'kantan-na-keisan',
  'quiz-03': 'data-types',
  'quiz-04': 'gengo-ni-tsuite',
  'quiz-05': 'dialog-box',
  'quiz-06': 'hensu',
  'quiz-07': 'aisatsu-program',
  'quiz-08': 'comment',
  'quiz-09': 'tsushin-hoshiki',
  'quiz-10': 'error-kaisho',
  'quiz-11': 'error-kaisho-2',
  'quiz-12': 'escape-sequence',
  'quiz-13': 'joken-bunki',
  'quiz-14': 'joken-bunki-2',
  'quiz-15': 'fukuzatsu-na-joken-bunki',
  'quiz-16': 'fukuzatsu-na-joken-bunki-2',
  'quiz-17': 'shin-gi-quiz',
  'quiz-18': 'teisuu',
  'quiz-19': 'let-to-var',
  'quiz-20': 'block-scope',
  'quiz-21': 'mojiretsu-wo-suchi-ni',
  'quiz-22': 'switch-bun',
  'quiz-23': 'fallthrough',
  'quiz-24': 'kansuu',
  'quiz-25': 'kansuu-2',
  'quiz-26': 'default-hikisuu',
  'quiz-27': 'kurikaeshi',
  'quiz-28': 'kurikaeshi-2',
  'quiz-29': 'kurikaeshi-no-chudan',
  'quiz-30': 'loop-skip',
  'quiz-31': 'object',
  'quiz-32': 'html-wo-ayatsuru',
  'quiz-33': 'moji-wo-kakikaeru',
  'quiz-34': 'mojiiro-wo-henkou',
  'quiz-35': 'haikeishoku-wo-henkou',
  'quiz-36': 'yoso-wo-tsuika',
  'quiz-37': 'yoso-wo-sakujo',
  'quiz-38': 'event-listener',
  'quiz-39': 'event-object',
  'quiz-40': 'nyuryoku-suu-no-hantei',
  'quiz-41': 'timer',
  'quiz-42': 'renda-game',
  'quiz-43': 'hairetsu',
  'quiz-44': 'hairetsu-wo-hyoji',
  'quiz-45': 'object-2',
  'quiz-46': 'this',
  'quiz-47': 'null-to-undefined',
  'quiz-48': 'custom-data-attribute',
  'quiz-49': 'template-literal',
  'quiz-50': 'image-slider',
  'web-02': 'css-toha',
  'web-03': 'form',
  'web-05': 'list',
  'web-06': 'css-position',
  'web-07': 'path',
  'web-08': 'radio-button',
  'web-09': 'block-inline',
  'web-10': 'html-structure',
  'web-11': 'css-no-kakikata',
  'web-12': 'rgb',
  'web-13': 'image-format',
  'web-14': 'it-kiso',
  'web-15': 'layout',
  'web-16': 'chuou-yose',
  'web-17': 'sotai-path-2',
  'web-18': 'table',
  'web-19': 'table-kiso',
  'web-20': 'haba-no-shitei',
  'web-22': 'font-family',
  'web-23': 'meta',
  'web-24': 'futatsu-no-div',
  'web-25': 'form-soto-no-submit',
  'web-26': 'em-rem',
  'web-27': 'selectors',
  'web-28': 'nth-child',
  'web-29': 'box-sizing',
  'web-30': 'haichi',
  'web-31': 'pseudo-class',
  'web-32': 'attribute-selector',
  'web-33': 'z-index',
  'web-34': 'css-position-2',
  'web-35': 'backup',
  'web-36': 'yokonarabi',
  'web-37': 'calc',
  'web-38': 'anchor-link',
  'web-39': 'footer-kotei',
  'web-40': 'dangumi',
  'web-41': 'click-suru-toki',
  'web-42': 'mojigumi',
  'web-43': 'initial-inherit',
  'web-44': 'table-css',
  'web-45': 'responsive',
  'web-46': 'custom-property',
  'web-47': 'hsl',
  'web-48': 'gradient',
  'web-49': 'youtube',
  'web-50': 'zukei',
  'web-51': 'zukei-2',
  'web-52': 'tategaki',
  'web-53': 'auto-numbering',
  'web-54': 'svg',
  'web-55': 'kenshou-tool',
  'web-56': 'kenshou-tool-2',
  'web-57': 'zougen',
  'web-58': 'zougen-2',
  'web-59': 'zougen-3',
  'web-60': 'animation',
  'web-61': 'animation-2',
  'web-62': 'sozai',
  'web-63': 'inyou',
  'web-64': 'contrast',
  'web-65': 'ou-bun-font',
  'web-66': 'font-inshou',
  'web-67': 'logo-quiz',
  'web-68': 'img-background',
  'web-69': 'kanren-haichi',
  'web-70': 'gamen',
  'web-71': 'logo-font-wabun',
  'web-72': 'css-filter',
  'web-73': 'grid',
  'web-74': 'grid-2',
  'web-75': 'kakuchoshi'
};

const typeSlug = {
  'コード': 'code',
  '短文': 'short',
  '長文': 'paragraph',
  '単一選択': 'choice',
  '複数選択': 'choices',
  'ページ編集': 'page-edit',
  'CSS調査': 'css-inspect',
  'ファイル': 'file'
};

function objects(rows) {
  const [header, ...body] = rows;
  return body.filter(row => row.some(value => String(value ?? '').trim())).map(row => Object.fromEntries(header.map((key, i) => [key, row[i] ?? ''])));
}

function indent(text, n) {
  const pad = '  '.repeat(n);
  return String(text).split('\n').map((line, i) => (i === 0 ? line : pad + line)).join('\n');
}

function jsLiteral(value, depth = 0) {
  const pad = '  '.repeat(depth);
  const inner = '  '.repeat(depth + 1);
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : JSON.stringify(value);
  if (typeof value === 'string') {
    if (value.includes('\n') || value.includes('`') || value.includes('${') || value.includes('\\')) return JSON.stringify(value);
    if (value.includes("'") && !value.includes('"')) return JSON.stringify(value);
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    if (value.every(item => typeof item !== 'object' || item == null)) {
      const oneLine = `[${value.map(item => jsLiteral(item, depth)).join(', ')}]`;
      if (oneLine.length < 80) return oneLine;
    }
    return `[\n${value.map(item => inner + jsLiteral(item, depth + 1)).join(',\n')}\n${pad}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (!entries.length) return '{}';
    return `{\n${entries.map(([k, v]) => `${inner}${/^[A-Za-z_][\w]*$/.test(k) ? k : JSON.stringify(k)}: ${jsLiteral(v, depth + 1)}`).join(',\n')}\n${pad}}`;
  }
  return JSON.stringify(value);
}

function emitCheckMethod(check, depth) {
  const pad = '  '.repeat(depth);
  const body = String(check).replace(/^\n/, '').replace(/\s+$/, '');
  const lines = body.split('\n');
  const prefix = /\bawait\b/.test(body) ? 'async check(h)' : 'check(h)';
  if (lines.length === 1) return `${pad}${prefix} {\n${pad}  ${lines[0]}\n${pad}}`;
  return `${pad}${prefix} {\n${lines.map(line => pad + '  ' + line).join('\n')}\n${pad}}`;
}

function emitGrader(rule) {
  const cfg = { ...rule.config };
  const parts = [`  kind: ${JSON.stringify(rule.kind)}`];
  for (const [key, value] of Object.entries(cfg)) {
    if (key === 'check' && typeof value === 'string') {
      parts.push(emitCheckMethod(value, 1));
      continue;
    }
    if (key === 'cases' && Array.isArray(value)) {
      const items = value.map(scenario => {
        const { check, ...rest } = scenario;
        const inner = [];
        for (const [k, v] of Object.entries(rest)) inner.push(`${k}: ${jsLiteral(v, 3)}`);
        if (typeof check === 'string') inner.push(emitCheckMethod(check, 0).replace(/^/gm, '  ').trimStart ? null : check);
        const fields = [];
        for (const [k, v] of Object.entries(rest)) fields.push(`      ${k}: ${jsLiteral(v, 3)}`);
        if (typeof check === 'string') fields.push(emitCheckMethod(check, 3));
        return `    {\n${fields.join(',\n')}\n    }`;
      });
      parts.push(`  cases: [\n${items.join(',\n')}\n  ]`);
      continue;
    }
    parts.push(`  ${/^[A-Za-z_][\w]*$/.test(key) ? key : JSON.stringify(key)}: ${jsLiteral(value, 1)}`);
  }
  return `import type { Grader } from '../../../grader.ts';\n\nconst grader: Grader = {\n${parts.join(',\n')}\n};\n\nexport default grader;\n`;
}

const convertedWeb10 = `h.assert(h.doctype && /^html$/i.test(h.doctype.name), 'DOCTYPEを確認してください。');
h.assert(h.document.querySelector('h1')?.textContent==='Hello!みなさん！', 'h1の文言を確認してください。');
h.assert([...h.document.querySelectorAll('*')].every(e=>['HTML','HEAD','BODY','H1'].includes(e.tagName)), 'HTML・HEAD・BODY・H1以外の要素は使わないでください。');`;

function compact(data) {
  const out = {};
  for (const [key, value] of Object.entries(data)) {
    if (value == null || value === '' || value === false) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out;
}

const rootCsv = path.join(root, 'other/archive/data');
const lessons = objects(parseCsv(await readFile(path.join(rootCsv, 'lessons.csv'), 'utf8')));
const questions = objects(parseCsv(await readFile(path.join(rootCsv, 'questions.csv'), 'utf8')));
const rules = JSON.parse(await readFile(path.join(root, 'other/archive/grading-rules.json'), 'utf8'));

if (lessons.length !== Object.keys(slugs).length) {
  const missing = lessons.filter(l => !slugs[l['レッスンID']]).map(l => l['レッスンID']);
  throw new Error(`スラッグ不足: ${missing.join(', ')}`);
}

const questionsByLesson = new Map();
for (const question of questions) {
  const key = `${question['分野']}\t${question['レッスン番号']}`;
  const list = questionsByLesson.get(key) || [];
  list.push(question);
  questionsByLesson.set(key, list);
}

for (const lesson of lessons) {
  const id = lesson['レッスンID'];
  const folder = courseFolder[lesson['分野']];
  const number = String(Number(lesson['レッスン番号'])).padStart(2, '0');
  const slug = slugs[id];
  if (!folder || !slug) throw new Error(`分類またはスラッグがありません: ${id} ${lesson['分野']}`);
  const dir = path.join(root, 'data', 'test', folder, `${number}-${slug}`);
  await mkdir(path.join(dir, 'images'), { recursive: true });

  const imagePaths = lesson['参考画像'] ? lesson['参考画像'].split(/\r?\n/).map(s => s.trim()).filter(Boolean) : [];
  const imageAlts = lesson['画像の説明'] ? lesson['画像の説明'].split(/\r?\n/).map(s => s.trim()) : [];
  const images = [];
  for (const [index, imagePath] of imagePaths.entries()) {
    const filename = path.basename(imagePath);
    const dest = path.join(dir, 'images', filename);
    await copyFile(path.join(root, 'other/archive/unused-images', path.basename(imagePath)) /* originals now live in lesson folders; this script is historical */, dest);
    images.push({ file: `images/${filename}`, path: imagePath, alt: imageAlts[index] || lesson['レッスン名'] });
  }

  const lessonData = compact({
    id,
    course: lesson['分野'],
    number: Number(lesson['レッスン番号']),
    title: lesson['レッスン名'],
    images: images.length ? images : undefined
  });
  await writeFile(path.join(dir, 'lesson.md'), stringifyFrontmatter(lessonData, lesson['導入文']), 'utf8');

  const items = questionsByLesson.get(`${lesson['分野']}\t${lesson['レッスン番号']}`) || [];
  for (const question of items) {
    const qid = question['設問ID'];
    const qnum = String(Number(question['設問番号'])).padStart(2, '0');
    const base = `${qnum}-${typeSlug[question['回答形式']] || 'item'}`;
    const mdFile = path.join(dir, `${base}.md`);
    const method = question['採点方法'] || (question['採点ルール'] ? '登録済み' : question['回答形式'] === 'ファイル' ? 'ファイル拡張子' : '正解と照合');
    const hasRule = method === '登録済み' || Boolean(question['採点コード']);
    const data = compact({
      id: qid,
      number: Number(question['設問番号']),
      type: question['回答形式'],
      title: question['設問'],
      language: question['言語'] || undefined,
      required: question['必須'] === 'はい',
      reference_editable: question['参照コードの編集'] === 'はい' ? true : undefined,
      method: !hasRule ? (method === '正解と照合' ? undefined : method) : undefined,
      choices: question['選択肢'] ? question['選択肢'].split(/\r?\n/).filter(Boolean) : undefined,
      answers: (!hasRule && question['正解']) ? question['正解'].split(/\r?\n/).filter(s => s !== '') : undefined,
      starter: question['初期コード'] || undefined,
      example: question['解答例'] || undefined,
      context: question['補足'] || undefined,
      feedback: question['不正解時のメッセージ'] || undefined,
      hint: question['ヒント'] || undefined
    });
    await writeFile(mdFile, stringifyFrontmatter(data, question['設問の説明']), 'utf8');

    if (hasRule) {
      let rule = rules[question['採点ルール'] || qid];
      if (question['採点コード']) {
        rule = { kind: method === 'HTML・CSS表示' ? 'render' : (rule?.kind || 'code'), config: { ...(rule?.config || {}), check: question['採点コード'] } };
        if (question['参照HTML']) rule.config.html = question['参照HTML'];
      }
      if (!rule) throw new Error(`採点ルールがありません: ${qid}`);
      if (qid === 'web-10-answer-1') rule = { ...rule, config: { ...rule.config, check: convertedWeb10 } };
      await writeFile(path.join(dir, `${base}.ts`), emitGrader(rule), 'utf8');
    }
  }
}

console.log(`migrated ${lessons.length} lessons, ${questions.length} questions`);
