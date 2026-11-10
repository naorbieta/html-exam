export function parseCsv(text) {
  const rows = [], row = [];
  let cell = '', quoted = false, closedQuote = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else if (quoted) { quoted = false; closedQuote = true; }
      else if (cell === '' && !closedQuote) quoted = true;
      else throw new Error('CSVの引用符が正しくありません。');
    } else if (ch === ',' && !quoted) { row.push(cell); cell = ''; closedQuote = false; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push([...row]); row.length = 0; cell = ''; closedQuote = false;
    } else {
      if (closedQuote && !quoted) throw new Error('CSVの引用符の後に余分な文字があります。');
      cell += ch;
    }
  }
  if (quoted) throw new Error('CSVの引用符が閉じられていません。');
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

export function stringifyCsv(rows) {
  return rows.map(row => row.map(value => {
    const text = String(value ?? '');
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }).join(',')).join('\n') + (rows.length ? '\n' : '');
}
