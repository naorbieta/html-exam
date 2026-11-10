function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Web Practice').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include_(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function bundledTables_() {
  return JSON.parse(include_('Data'));
}

function getCatalog() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) return catalogFromTables(bundledTables_());
  const book = SpreadsheetApp.openById(id);
  const lessons = book.getSheetByName('レッスン'), questions = book.getSheetByName('設問');
  if (lessons && questions) {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      assignRowIds_(lessons,'レッスンID','lesson');
      assignRowIds_(questions,'設問ID','item');
      const rules = { ...bundledTables_().rules };
      const savedRules = book.getSheetByName('_採点ルール');
      if (savedRules) for (const [key, kind, config] of savedRules.getDataRange().getValues().slice(1)) {
        if (key) rules[key] = { kind, config: JSON.parse(config) };
      }
      return catalogFromTables({ lessons: lessons.getDataRange().getValues(), questions: questions.getDataRange().getValues(), rules });
    } finally { lock.releaseLock(); }
  }
  if (lessons || questions) throw new Error('「レッスン」と「設問」の両方のシートが必要です。setup_を実行してください。');
  return catalogFromTables(legacyTables_(book));
}

function legacyTables_(book) {
  const tables = {};
  for (const name of ['quizzes', 'items', 'options', 'images', 'graders']) {
    const sheet = book.getSheetByName(name);
    if (!sheet) throw new Error(`問題データの ${name} シートがありません。CSVを取り込んでください。`);
    tables[name] = sheet.getDataRange().getValues();
  }
  return tables;
}

function assignRowIds_(sheet, name, prefix) {
  const rows = sheet.getDataRange().getValues();
  const column = rows[0].indexOf(name);
  if (column < 0) throw new Error(`${sheet.getName()}シートに「${name}」列を追加してください。値は自動入力されます。`);
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][column] || !rows[i].some(value => String(value).trim())) continue;
    sheet.getRange(i + 1, column + 1).setNumberFormat('@').setValue(prefix + '-' + Utilities.getUuid());
  }
}

function getQuizImages(quizId) {
  const quiz = getCatalog().find(q => q.id === quizId);
  if (!quiz) throw new Error('問題が見つかりません。ページを読み直してください。');
  const images = JSON.parse(include_('Images'));
  const result = {};
  for (const image of quiz.images) {
    if (!images[image.path]) throw new Error(`画像 ${image.path} がありません。画像を追加してビルドし直してください。`);
    result[image.path] = images[image.path];
  }
  return result;
}

function setup_() {
  const properties = PropertiesService.getScriptProperties();
  let book;
  const id = properties.getProperty('SPREADSHEET_ID');
  if (id) book = SpreadsheetApp.openById(id);
  else {
    book = SpreadsheetApp.create('Web Practice');
    properties.setProperty('SPREADSHEET_ID', book.getId());
  }
  const hasLessons = Boolean(book.getSheetByName('レッスン')), hasQuestions = Boolean(book.getSheetByName('設問'));
  if (hasLessons !== hasQuestions) throw new Error('「レッスン」と「設問」の片方だけがあります。既存の内容を確認し、欠けているシートをCSVから取り込んでください。');
  if (!hasLessons) {
    // Existing deployed spreadsheets take precedence over the bundled snapshot.
    const tables = book.getSheetByName('quizzes') ? authoringFromTables(legacyTables_(book)) : bundledTables_();
    catalogFromTables(tables);
    for (const [name, rows] of [['レッスン',tables.lessons],['設問',tables.questions]]) {
      const sheet = book.insertSheet(name);
      sheet.getRange(1, 1, rows.length, rows[0].length).setNumberFormat('@').setValues(rows.map(row => row.map(sheetText)));
      formatAuthoringSheet_(sheet, name);
    }
    if (book.getSheetByName('quizzes')) {
      const rows = [['ルールID','採点方法','設定'], ...Object.entries(tables.rules).map(([key, rule]) => [key,rule.kind,JSON.stringify(rule.config)])];
      const sheet = book.getSheetByName('_採点ルール') || book.insertSheet('_採点ルール');
      sheet.getRange(1,1,rows.length,3).setNumberFormat('@').setValues(rows.map(row=>row.map(sheetText)));
      sheet.hideSheet();
      for (const name of ['quizzes','items','options','images','graders']) book.getSheetByName(name).hideSheet();
    }
  }
  if (!book.getSheetByName('answers')) {
    const sheet = book.insertSheet('answers');
    sheet.appendRow(['attempt_id', 'submitted_at', 'session_id', 'quiz_id', 'item_id', 'answer', 'browser_result']);
    sheet.setFrozenRows(1);
  }
  console.log(book.getUrl());
  return book.getUrl();
}

function formatAuthoringSheet_(sheet, name) {
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.setFrozenRows(1); sheet.setFrozenColumns(2);
  const inputRange = sheet.getRange(1, 1, sheet.getMaxRows(), header.length);
  inputRange.setNumberFormat('@').setVerticalAlignment('top').setWrap(true);
  sheet.getRange(1, 1, 1, header.length).setFontWeight('bold').setBackground('#e8eef4');
  sheet.setColumnWidths(1, header.length, 160);
  const column = (title, width) => { const index = header.indexOf(title); if (index >= 0) sheet.setColumnWidth(index + 1, width); };
  column('設問',360); column('導入文',480); column('選択肢',280); column('正解',240); column('初期コード',360);
  sheet.setRowHeights(2, sheet.getMaxRows() - 1, 48);
  inputRange.createFilter();
  const dropdown = (title, values) => {
    const index = header.indexOf(title);
    if (index >= 0 && values.length) sheet.getRange(2, index + 1, sheet.getMaxRows() - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build());
  };
  const courses = [...new Set(bundledTables_().lessons.slice(1).map(row => row[0]))];
  // New course names remain editable; other enums must match the loader.
  const courseColumn = header.indexOf('分野');
  sheet.getRange(2, courseColumn + 1, sheet.getMaxRows() - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(courses, true).setAllowInvalid(true).build());
  if (name === '設問') {
    dropdown('回答形式',Object.keys(answerTypes)); dropdown('採点方法',gradingMethods);
    dropdown('必須',['はい','いいえ']); dropdown('参照コードの編集',['はい','いいえ']);
    // Keep optional authoring fields available without a 21-column main view.
    sheet.getRange(1, 8, sheet.getMaxRows(), header.length - 7).shiftColumnGroupDepth(1);
    sheet.getColumnGroup(8,1).collapse();
  } else sheet.hideColumns(header.indexOf('レッスンID') + 1);
}

function submitQuiz(payload) {
  const properties = PropertiesService.getScriptProperties();
  const id = properties.getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('回答の保存先が未設定です。管理者がsetup_を実行してください。');
  const { quiz, answers, results } = validateSubmission(payload, getCatalog());
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = SpreadsheetApp.openById(id).getSheetByName('answers');
    if (!sheet) throw new Error('answersシートがありません。管理者がsetup_を実行してください。');
    const lastRow = sheet.getLastRow();
    if (lastRow > 1 && sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(payload.attemptId).matchEntireCell(true).findNext()) {
      return { saved: true, attemptId: payload.attemptId };
    }
    const now = new Date().toISOString();
    const rows = answers.map(({ item, value }) => {
      const text = value && typeof value === 'object' ? JSON.stringify(value) : value;
      const result = results.find(result => result.itemId === item.id);
      return [payload.attemptId, now, payload.sessionId, quiz.id, item.id, sheetText(text), JSON.stringify({ passed: result.passed, feedback: result.feedback, ...(result.reviewRequired ? { reviewRequired: true } : {}) })];
    });
    const range = sheet.getRange(lastRow + 1, 1, rows.length, 7).setNumberFormat('@');
    range.setValues(rows);
    SpreadsheetApp.flush();
    return { saved: true, attemptId: payload.attemptId };
  } finally { lock.releaseLock(); }
}

