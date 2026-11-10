function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Web Practice').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include_(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function dataSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('問題データのスプレッドシートが未設定です。dist/sheets/practice.csv をスプレッドシートに取り込み、スクリプトプロパティ SPREADSHEET_ID を設定してから setup_ を実行してください。');
  const book = SpreadsheetApp.openById(id);
  const sheet = book.getSheetByName(PACK_SHEET_NAME);
  if (!sheet) throw new Error('「' + PACK_SHEET_NAME + '」シートがありません。ビルドした dist/sheets/practice.csv をこのスプレッドシートへ取り込み、シート名を「' + PACK_SHEET_NAME + '」にしてから setup_ を実行してください。スプレッドシート: ' + book.getUrl());
  return { book, sheet };
}

function getCatalog() {
  const { sheet } = dataSheet_();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return catalogFromTables(tablesFromPack(sheet.getDataRange().getValues()));
  } finally { lock.releaseLock(); }
}

function getQuizImages(quizId) {
  const { sheet } = dataSheet_();
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const rows = sheet.getDataRange().getValues();
    const catalog = catalogFromTables(tablesFromPack(rows));
    const quiz = catalog.find(q => q.id === quizId);
    if (!quiz) throw new Error('問題が見つかりません。ページを読み直してください。');
    const images = imagesFromPack(rows, quizId);
    const result = {};
    for (const image of quiz.images) {
      if (!images[image.path]) throw new Error(`画像 ${image.path} がありません。CSVを取り込み直してください。`);
      result[image.path] = images[image.path];
    }
    return result;
  } finally { lock.releaseLock(); }
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
  const sheet = book.getSheetByName(PACK_SHEET_NAME);
  if (!sheet) {
    throw new Error('「' + PACK_SHEET_NAME + '」シートがありません。ビルドした dist/sheets/practice.csv をこのスプレッドシートに取り込み、シート名を「' + PACK_SHEET_NAME + '」にしてから、もう一度 setup_ を実行してください。スプレッドシート: ' + book.getUrl());
  }
  catalogFromTables(tablesFromPack(sheet.getDataRange().getValues()));
  if (!book.getSheetByName('answers')) {
    const answers = book.insertSheet('answers');
    answers.appendRow(['attempt_id', 'submitted_at', 'session_id', 'quiz_id', 'item_id', 'answer', 'browser_result']);
    answers.setFrozenRows(1);
  }
  console.log(book.getUrl());
  return book.getUrl();
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
