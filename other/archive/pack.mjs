// 旧形式: 問題データをスプレッドシートの「問題データ」シート（practice.csv）へ載せるためのパック処理。現在は data/ から dist/app の HTML へ埋め込んでいます。
export const PACK_HEADERS = ['kind', 'id', 'field', 'part', 'value'];
export const PACK_SHEET_NAME = '問題データ';
export const PACK_CELL_LIMIT = 45000;

function chunk(value, size = PACK_CELL_LIMIT) {
  const text = String(value ?? '');
  if (!text) return [''];
  const parts = [];
  for (let i = 0; i < text.length; i += size) parts.push(text.slice(i, i + size));
  return parts;
}

function collect(rows) {
  const [header, ...body] = rows || [];
  if (!header) throw new Error('問題データの見出し行がありません。');
  const keys = header.map(key => String(key).trim());
  const index = Object.fromEntries(PACK_HEADERS.map(name => [name, keys.indexOf(name)]));
  for (const name of PACK_HEADERS) if (index[name] < 0) throw new Error(`問題データに「${name}」列を追加してください。`);
  const records = new Map();
  body.forEach((row, rowIndex) => {
    if (!row.some(value => String(value ?? '').trim())) return;
    const kind = String(row[index.kind] ?? '').trim();
    const id = String(row[index.id] ?? '').trim();
    const field = String(row[index.field] ?? '').trim();
    const part = Number(row[index.part] ?? 0);
    const value = String(row[index.value] ?? '');
    if (!kind || !id || !field || !Number.isInteger(part) || part < 0) {
      throw new Error(`問題データ ${rowIndex + 2}行目: kind・id・field・partを確認してください。`);
    }
    const key = `${kind}\t${id}`;
    const record = records.get(key) || { kind, id, fields: {} };
    (record.fields[field] ||= [])[part] = value;
    records.set(key, record);
  });
  for (const record of records.values()) {
    for (const [field, parts] of Object.entries(record.fields)) {
      record.fields[field] = Array.from({ length: parts.length }, (_, i) => parts[i] ?? '').join('');
    }
  }
  return [...records.values()];
}

const field = (record, name, fallback = '') => record.fields[name] ?? fallback;

export function tablesFromPack(rows) {
  const tables = {
    quizzes: [['id', 'number', 'title', 'description', 'course']],
    items: [['id', 'quiz_id', 'position', 'type', 'title', 'description', 'required', 'context', 'language', 'reference_editable']],
    options: [['item_id', 'position', 'value']],
    images: [['quiz_id', 'position', 'path', 'alt']],
    graders: [['item_id', 'kind', 'config', 'example', 'feedback', 'hint', 'starter']]
  };
  const records = collect(rows);
  for (const record of records.filter(r => r.kind === 'lesson')) {
    tables.quizzes.push([
      record.id,
      Number(field(record, 'number')),
      field(record, 'title'),
      field(record, 'description'),
      field(record, 'course')
    ]);
  }
  for (const record of records.filter(r => r.kind === 'question')) {
    tables.items.push([
      record.id,
      field(record, 'quiz_id'),
      Number(field(record, 'position')),
      field(record, 'type'),
      field(record, 'title'),
      field(record, 'description'),
      field(record, 'required') || 'true',
      field(record, 'context'),
      field(record, 'language'),
      field(record, 'reference_editable') || 'false'
    ]);
    const options = field(record, 'options');
    if (options) options.split('\n').forEach((value, index) => {
      if (value !== '') tables.options.push([record.id, index + 1, value]);
    });
  }
  for (const record of records.filter(r => r.kind === 'grader')) {
    let config = field(record, 'config') || '{}';
    try { JSON.parse(config); } catch { throw new Error(`採点条件 ${record.id} のconfigを確認してください。`); }
    tables.graders.push([
      record.id,
      field(record, 'kind'),
      config,
      field(record, 'example'),
      field(record, 'feedback'),
      field(record, 'hint'),
      field(record, 'starter')
    ]);
  }
  for (const record of records.filter(r => r.kind === 'image')) {
    tables.images.push([
      field(record, 'quiz_id') || record.id,
      Number(field(record, 'position') || 1),
      field(record, 'path'),
      field(record, 'alt')
    ]);
  }
  return tables;
}

export function packRowsFromTables(tables, imageData = {}) {
  const read = name => {
    const [header, ...rows] = tables[name] || [[]];
    return rows.filter(row => row.some(value => String(value ?? '').trim())).map(row => Object.fromEntries(header.map((key, i) => [key, row[i] ?? ''])));
  };
  const rows = [PACK_HEADERS];
  const add = (kind, id, fieldName, value) => {
    chunk(value).forEach((part, index) => rows.push([kind, id, fieldName, String(index), part]));
  };
  for (const quiz of read('quizzes')) {
    add('lesson', quiz.id, 'course', quiz.course);
    add('lesson', quiz.id, 'number', quiz.number);
    add('lesson', quiz.id, 'title', quiz.title);
    add('lesson', quiz.id, 'description', quiz.description);
  }
  for (const item of read('items')) {
    add('question', item.id, 'quiz_id', item.quiz_id);
    add('question', item.id, 'position', item.position);
    add('question', item.id, 'type', item.type);
    add('question', item.id, 'title', item.title);
    add('question', item.id, 'description', item.description);
    add('question', item.id, 'required', item.required);
    add('question', item.id, 'context', item.context);
    add('question', item.id, 'language', item.language);
    add('question', item.id, 'reference_editable', item.reference_editable);
  }
  const optionsByItem = new Map();
  for (const option of read('options').sort((a, b) => Number(a.position) - Number(b.position))) {
    const list = optionsByItem.get(option.item_id) || [];
    list.push(option.value);
    optionsByItem.set(option.item_id, list);
  }
  for (const [itemId, values] of optionsByItem) add('question', itemId, 'options', values.join('\n'));
  for (const grader of read('graders')) {
    add('grader', grader.item_id, 'kind', grader.kind);
    add('grader', grader.item_id, 'config', grader.config);
    add('grader', grader.item_id, 'example', grader.example);
    add('grader', grader.item_id, 'feedback', grader.feedback);
    add('grader', grader.item_id, 'hint', grader.hint);
    add('grader', grader.item_id, 'starter', grader.starter);
  }
  for (const image of read('images')) {
    const id = `${image.quiz_id}:${image.path}`;
    add('image', id, 'quiz_id', image.quiz_id);
    add('image', id, 'position', image.position);
    add('image', id, 'path', image.path);
    add('image', id, 'alt', image.alt);
    const dataUrl = imageData[image.path];
    if (dataUrl) {
      const mime = dataUrl.match(/^data:([^;]+);base64,/)?.[1] || '';
      add('image', id, 'mime', mime);
      add('image', id, 'data', dataUrl.slice(dataUrl.indexOf(',') + 1));
    }
  }
  return rows;
}

export function imagesFromPack(rows, quizId) {
  const result = {};
  for (const record of collect(rows).filter(r => r.kind === 'image')) {
    if (quizId && field(record, 'quiz_id') !== quizId) continue;
    const path = field(record, 'path');
    const mime = field(record, 'mime') || 'application/octet-stream';
    const data = field(record, 'data');
    if (!path || !data) throw new Error(`画像 ${path || record.id} のデータがありません。CSVを取り込み直してください。`);
    result[path] = `data:${mime};base64,${data}`;
  }
  return result;
}
