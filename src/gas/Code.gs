function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Web Practice').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include_(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function readJsonFile_(name) {
  return parseJsonHtml(HtmlService.createHtmlOutputFromFile(name).getContent());
}

function practiceData_() {
  return readJsonFile_('Catalog');
}

function getCatalog() {
  return practiceData_().catalog;
}

function getQuizImages(quizId) {
  const data = practiceData_();
  const quiz = data.catalog.find(q => q.id === quizId);
  if (!quiz) throw new Error('問題が見つかりません。ページを読み直してください。');
  const names = new Set();
  const paths = [];
  for (const image of quiz.images) {
    const files = data.imageFiles && data.imageFiles[image.path];
    if (!files || !files.length) throw new Error('画像 ' + image.path + ' がありません。アプリをデプロイし直してください。');
    paths.push(image.path);
    for (const name of files) names.add(name);
  }
  const payloads = [];
  for (const name of names) payloads.push(readJsonFile_(name));
  const images = assembleImages(payloads, paths);
  const result = {};
  for (const image of quiz.images) {
    if (!images[image.path]) throw new Error('画像 ' + image.path + ' がありません。アプリをデプロイし直してください。');
    result[image.path] = images[image.path];
  }
  return result;
}

var ANSWER_SHEET_NAME = 'answers';
var ANSWER_HEADERS = ['記録ID', 'タイムスタンプ', 'ユーザー', 'セッションID', 'レッスンID', '問題ID', '回答内容', '正誤', 'フィードバック'];

function currentUserEmail_() {
  try {
    return Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail() || '';
  } catch (error) {
    return '';
  }
}

function logSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    if (!properties.getProperty('SPREADSHEET_ID')) properties.setProperty('SPREADSHEET_ID', active.getId());
    return active;
  }
  const id = properties.getProperty('SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  const book = SpreadsheetApp.create('Web Practice 回答ログ');
  properties.setProperty('SPREADSHEET_ID', book.getId());
  return book;
}

function ensureAnswerLog_(book) {
  let sheet = book.getSheetByName(ANSWER_SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(ANSWER_SHEET_NAME);
    sheet.appendRow(ANSWER_HEADERS);
    sheet.setFrozenRows(1);
    return sheet;
  }
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const header = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(value => String(value ?? '').trim());
  if (header[0] === 'attempt_id') {
    if (header[2] !== 'ユーザー' && header[2] !== 'user_email') sheet.insertColumnAfter(2);
    sheet.getRange(1, 1, 1, ANSWER_HEADERS.length).setValues([ANSWER_HEADERS]);
    sheet.setFrozenRows(1);
    return sheet;
  }
  if (header[0] !== ANSWER_HEADERS[0] && sheet.getLastRow() <= 1) {
    sheet.getRange(1, 1, 1, ANSWER_HEADERS.length).setValues([ANSWER_HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function setup_() {
  const book = logSpreadsheet_();
  ensureAnswerLog_(book);
  console.log(book.getUrl());
  return book.getUrl();
}

function submitQuiz(payload) {
  const { quiz, answers, results } = validateSubmission(payload, getCatalog());
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = ensureAnswerLog_(logSpreadsheet_());
    const lastRow = sheet.getLastRow();
    if (lastRow > 1 && sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(payload.attemptId).matchEntireCell(true).findNext()) {
      return { saved: true, attemptId: payload.attemptId };
    }
    const now = new Date().toISOString();
    const user = currentUserEmail_();
    const rows = answers.map(({ item, value }) => {
      const text = value && typeof value === 'object' ? JSON.stringify(value) : value;
      const result = results.find(result => result.itemId === item.id);
      const passed = result.reviewRequired ? '要確認' : (result.passed ? '正解' : '不正解');
      return [payload.attemptId, now, user, payload.sessionId, quiz.id, item.id, sheetText(text), passed, result.feedback || ''];
    });
    const range = sheet.getRange(lastRow + 1, 1, rows.length, ANSWER_HEADERS.length).setNumberFormat('@');
    range.setValues(rows);
    SpreadsheetApp.flush();
    return { saved: true, attemptId: payload.attemptId };
  } finally { lock.releaseLock(); }
}
