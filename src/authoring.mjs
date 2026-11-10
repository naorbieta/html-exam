export const lessonColumns = ['分野','レッスン番号','レッスン名','導入文','参考画像','画像の説明','レッスンID'];
export const questionColumns = ['分野','レッスン番号','設問','回答形式','選択肢','正解','初期コード','解答例','補足','不正解時のメッセージ','ヒント','言語','採点方法','採点コード','参照HTML','採点ルール','設問ID','設問番号','必須','参照コードの編集','設問の説明'];
export const answerTypes = { '短文':'short_text', '長文':'paragraph', '単一選択':'multiple_choice', '複数選択':'checkboxes', 'コード':'code', 'ページ編集':'dom_task', 'CSS調査':'inspection', 'ファイル':'file' };
export const gradingMethods = ['正解と照合','コンソール出力','JavaScript実行','HTML・CSS表示','ファイル拡張子','登録済み'];

function authorRows(table, label, required) {
  const [header, ...rows] = table || [];
  if (!header) throw new Error(`${label}シートがありません。`);
  for (const key of required) if (!header.includes(key)) throw new Error(`${label}シートに「${key}」列を追加してください。`);
  const keys = header.map(key => String(key).trim());
  if (new Set(keys.filter(Boolean)).size !== keys.filter(Boolean).length) throw new Error(`${label}シートの列名が重複しています。`);
  return rows.flatMap((values, index) => {
    if (!values.some(value => String(value ?? '').trim())) return [];
    if (values.some((value, i) => !keys[i] && String(value ?? '').trim())) throw new Error(`${label}シート ${index + 2}行目: 列名のないセルに値があります。`);
    return [{ row: index + 2, ...Object.fromEntries(keys.filter(Boolean).map(key => [key, String(values[keys.indexOf(key)] ?? '')])) }];
  });
}

const cellLines = value => String(value || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
const enabled = (value, fallback = false) => value === '' || value == null ? fallback : ['はい','true'].includes(String(value).toLowerCase());
const lessonKey = row => `${row['分野'].trim()}\t${Number(row['レッスン番号'])}`;

export function tablesFromAuthoring(source) {
  const tables = {
    quizzes: [['id','number','title','description','course']],
    items: [['id','quiz_id','position','type','title','description','required','context','language','reference_editable']],
    options: [['item_id','position','value']], images: [['quiz_id','position','path','alt']],
    graders: [['item_id','kind','config','example','feedback','hint','starter']]
  };
  const lessons = new Map(), ids = new Set(), positions = new Map();
  for (const row of authorRows(source.lessons, 'レッスン', ['分野','レッスン番号','レッスン名','導入文'])) {
    const fail = message => { throw new Error(`レッスンシート ${row.row}行目: ${message}`); };
    const number = Number(row['レッスン番号']), key = lessonKey(row);
    if (!row['分野'].trim() || !row['レッスン名'].trim() || !Number.isInteger(number) || number < 1) fail('分野・レッスン番号・レッスン名を入力してください。');
    const id = row['レッスンID'] || `lesson-${encodeURIComponent(row['分野'].trim())}-${number}`;
    if (lessons.has(key) || ids.has(id)) fail('分野とレッスン番号、またはレッスンIDが重複しています。');
    lessons.set(key, id); ids.add(id);
    tables.quizzes.push([id,number,row['レッスン名'],row['導入文'],row['分野'].trim()]);
    const paths = cellLines(row['参考画像']), alts = cellLines(row['画像の説明']);
    paths.forEach((path, index) => tables.images.push([id,index + 1,path,alts[index] || row['レッスン名']]));
  }
  const itemIds = new Set();
  for (const row of authorRows(source.questions, '設問', ['分野','レッスン番号','設問','回答形式','選択肢','正解'])) {
    const fail = message => { throw new Error(`設問シート ${row.row}行目: ${message}`); };
    const quizId = lessons.get(lessonKey(row));
    if (!quizId) fail('分野とレッスン番号に対応する行を「レッスン」シートに追加してください。');
    const count = (positions.get(quizId) || 0) + 1;
    const position = row['設問番号'] ? Number(row['設問番号']) : count;
    positions.set(quizId, Math.max(count, position));
    const id = row['設問ID'] || `${quizId}-answer-${position}`;
    if (itemIds.has(id)) fail('設問IDが重複しています。追加した行の設問IDを空にしてください。');
    itemIds.add(id);
    const type = answerTypes[row['回答形式']];
    if (!type) fail(`回答形式は ${Object.keys(answerTypes).join('・')} から選んでください。`);
    if (!row['設問'].trim() || !Number.isInteger(position) || position < 1) fail('設問を入力し、設問番号には1以上の整数を指定してください。');
    const options = cellLines(row['選択肢']), correct = cellLines(row['正解']);
    const isChoice = ['multiple_choice','checkboxes'].includes(type);
    if (isChoice) {
      if (options.length < 2 || new Set(options.map(value => value.normalize('NFKC').replace(/\s/g,'').toLowerCase())).size !== options.length) fail('選択肢を重複なしで2つ以上入力してください。');
      if (!correct.length || correct.some(value => !options.includes(value)) || type === 'multiple_choice' && correct.length !== 1) fail('正解には選択肢の文言をそのまま入力してください。単一選択の正解は1つです。');
    }
    for (const name of ['必須','参照コードの編集']) if (row[name] && !['はい','いいえ','true','false'].includes(row[name].toLowerCase())) fail(`${name}は「はい」か「いいえ」を入力してください。`);
    const method = row['採点方法'] || (row['採点ルール'] ? '登録済み' : type === 'file' ? 'ファイル拡張子' : '正解と照合');
    if (!gradingMethods.includes(method)) fail(`採点方法は ${gradingMethods.join('・')} から選んでください。`);
    let kind = 'text', config;
    if (method === '登録済み') {
      const rule = source.rules?.[row['採点ルール']];
      if (!rule) fail('採点ルールが見つかりません。登録済みのルールを選んでください。');
      kind = rule.kind; config = JSON.parse(JSON.stringify(rule.config));
    } else if (method === 'ファイル拡張子') {
      if (type !== 'file' || correct.length !== 1 || !/^\.[a-z\d]+$/i.test(correct[0])) fail('回答形式を「ファイル」にし、正解に「.js」のような拡張子を1つ入力してください。');
      kind='file'; config={extension:correct[0]};
    } else if (method === '正解と照合') {
      if (!correct.length) fail('正解を入力してください。');
      if (type === 'code') fail('コードの採点方法を選んでください。');
      config = type === 'checkboxes' ? { acceptSets: [correct] } : { accept: correct };
    } else if (method === 'コンソール出力') {
      if (!correct.length || type !== 'code') fail('回答形式を「コード」にし、正解に期待する出力を1行ずつ入力してください。');
      kind = 'code'; config = { check: `h.assert(JSON.stringify(h.logText()) === ${JSON.stringify(JSON.stringify(correct))}, 'コンソールの出力を確認してください。');` };
    } else {
      if (type !== 'code' || !row['採点コード']?.trim()) fail('回答形式を「コード」にし、採点コードを入力してください。');
      kind = method === 'JavaScript実行' ? 'code' : 'render'; config = {};
    }
    if (row['採点コード']) {
      config.check = row['採点コード'];
      if (config.cases) fail('複数ケースの採点ルールを使う場合、採点コードはプログラム側のルールで編集してください。');
    }
    if (row['参照HTML']) config.html = row['参照HTML'];
    const starter = row['初期コード'] || '';
    if (method !== '登録済み' && type === 'code' && /^\s*<(?:!doctype\s+html|html\b)/i.test(starter)) config.documentAnswer = true;
    if (['dom_task','inspection'].includes(type) && method !== '登録済み') fail('この回答形式では対応する採点ルールを選んでください。');
    const example = method === 'ファイル拡張子' ? JSON.stringify({name:'example'+correct[0],content:''}) : method === '正解と照合' ? (type === 'checkboxes' ? JSON.stringify(correct) : correct[0]) : row['解答例'] || '';
    tables.items.push([id,quizId,position,type,row['設問'],row['設問の説明'] || '',String(enabled(row['必須'],true)),row['補足'] || '',row['言語'] || '',String(enabled(row['参照コードの編集']))]);
    options.forEach((value, index) => tables.options.push([id,index + 1,value]));
    tables.graders.push([id,kind,JSON.stringify(config),example,row['不正解時のメッセージ'] || '回答をもう一度確認してください。',row['ヒント'] || '',starter]);
  }
  for (const [key, id] of lessons) if (!positions.has(id)) throw new Error(`レッスン「${key.replace('\t',' / ')}」に設問がありません。「設問」シートに追加してください。`);
  return tables;
}

export function authoringFromTables(tables) {
  const objects = name => {
    const [keys, ...rows] = tables[name];
    return rows.map(row => Object.fromEntries(keys.map((key,i) => [key,String(row[i] ?? '')])));
  };
  const quizzes = objects('quizzes'), items = objects('items'), graders = objects('graders');
  const options = objects('options'), images = objects('images');
  const source = { lessons: [lessonColumns], questions: [questionColumns], rules: {} };
  for (const quiz of quizzes) {
    const pictures = images.filter(image => image.quiz_id === quiz.id).sort((a,b) => a.position-b.position);
    source.lessons.push([quiz.course,quiz.number,quiz.title,quiz.description,pictures.map(image=>image.path).join('\n'),pictures.map(image=>image.alt).join('\n'),quiz.id]);
    for (const item of items.filter(item => item.quiz_id === quiz.id).sort((a,b) => a.position-b.position)) {
      const grader = graders.find(grader => grader.item_id === item.id), config = JSON.parse(grader.config);
      const simple = grader.kind === 'text' && Object.keys(config).length === 1 && (config.accept || config.acceptSets?.length === 1);
      if (!simple) source.rules[item.id] = { kind: grader.kind, config };
      // A separate cell preserves multiline CSS observations without mixing them into the prompt.
      const row = {
        '分野':quiz.course,'レッスン番号':quiz.number,'設問':item.title,'回答形式':Object.keys(answerTypes).find(key=>answerTypes[key] === item.type),
        '選択肢':options.filter(option=>option.item_id === item.id).sort((a,b)=>a.position-b.position).map(option=>option.value).join('\n'),
        '正解':simple ? (config.accept || config.acceptSets[0]).join('\n') : '', '初期コード':grader.starter,'解答例':simple ? '' : grader.example,
        '補足':item.context,'不正解時のメッセージ':grader.feedback,'ヒント':grader.hint,'言語':item.language,
        '採点方法':simple ? '正解と照合' : '登録済み','採点ルール':simple ? '' : item.id,'設問ID':item.id,'設問番号':item.position,
        '必須':enabled(item.required) ? 'はい' : 'いいえ','参照コードの編集':enabled(item.reference_editable) ? 'はい' : 'いいえ',
        '設問の説明':item.description
      };
      source.questions.push(questionColumns.map(key=>row[key] || ''));
    }
  }
  return source;
}
