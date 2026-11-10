import { tablesFromAuthoring } from './authoring.mjs';

export function catalogFromTables(tables) {
  if (tables.questions) tables = tablesFromAuthoring(tables);
  const read = name => {
    const [header, ...rows] = tables[name] || [];
    if (!header) throw new Error(`${name}のデータがありません。`);
    return rows.filter(row => row.some(value => String(value).trim())).map(row => {
      if (row.length !== header.length) throw new Error(`${name}の列数を確認してください。`);
      return Object.fromEntries(header.map((key, i) => [key, String(row[i] ?? '')]));
    });
  };
  const quizzes = read('quizzes').map(row => ({
    id: row.id, number: Number(row.number), title: row.title, description: row.description, course: row.course || 'JavaScript / 初級',
    items: [], images: []
  }));
  const byQuiz = new Map(quizzes.map(q => [q.id, q]));
  if (byQuiz.size !== quizzes.length) throw new Error('問題IDが重複しています。');
  const byItem = new Map();
  const types = ['short_text', 'paragraph', 'multiple_choice', 'checkboxes', 'code', 'dom_task', 'inspection', 'file'];
  for (const row of read('items')) {
    if (!byQuiz.has(row.quiz_id) || !types.includes(row.type) || byItem.has(row.id)) {
      throw new Error(`解答欄 ${row.id} の問題ID・形式・IDを確認してください。`);
    }
    const item = {
      id: row.id, position: Number(row.position), type: row.type,
      title: row.title, description: row.description, context: row.context || '', language: row.language || '', required: row.required.toLowerCase() === 'true',
      referenceEditable: row.reference_editable?.toLowerCase() === 'true', options: []
    };
    byItem.set(item.id, item);
    byQuiz.get(row.quiz_id).items.push(item);
  }
  for (const row of read('options').sort((a, b) => Number(a.position) - Number(b.position))) {
    if (!byItem.has(row.item_id)) throw new Error(`選択肢の解答欄 ${row.item_id} がありません。`);
    byItem.get(row.item_id).options.push(row.value);
  }
  for (const row of read('images')) {
    if (!byQuiz.has(row.quiz_id)) throw new Error(`画像の問題 ${row.quiz_id} がありません。`);
    byQuiz.get(row.quiz_id).images.push({ position: Number(row.position), path: row.path, alt: row.alt });
  }
  if (tables.graders) for (const row of read('graders')) {
    if (!byItem.has(row.item_id)) throw new Error(`採点条件の解答欄 ${row.item_id} がありません。`);
    const item = byItem.get(row.item_id);
    if (item.grading || !['text', 'code', 'render', 'manual', 'dom', 'file'].includes(row.kind)) throw new Error(`採点条件 ${row.item_id} の重複・形式を確認してください。`);
    let config;
    try { config = JSON.parse(row.config); } catch { throw new Error(`採点条件 ${row.item_id} のconfigを確認してください。`); }
    if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error(`採点条件 ${row.item_id} のconfigを確認してください。`);
    item.grading = { kind: row.kind, config, example: row.example, feedback: row.feedback, hint: row.hint, starter: row.starter };
  }
  for (const quiz of quizzes) {
    if (!quiz.id || !quiz.title || !Number.isInteger(quiz.number) || !quiz.items.length) {
      throw new Error(`問題 ${quiz.id} の番号・タイトル・解答欄を確認してください。`);
    }
    quiz.items.sort((a, b) => a.position - b.position);
    quiz.images.sort((a, b) => a.position - b.position);
    for (const item of quiz.items) {
      if (tables.graders && !item.grading) throw new Error(`採点条件がありません: ${item.id}`);
      if (!item.id || !item.title || !Number.isInteger(item.position) || item.position < 1) {
        throw new Error(`解答欄 ${item.id} のID・位置・質問文を確認してください。`);
      }
      if (['multiple_choice', 'checkboxes'].includes(item.type) && !item.options.length) {
        throw new Error(`解答欄 ${item.id} に選択肢がありません。`);
      }
    }
  }
  const courses = [...new Set(quizzes.map(quiz => quiz.course))];
  return quizzes.sort((a, b) => courses.indexOf(a.course) - courses.indexOf(b.course) || a.number - b.number);
}
