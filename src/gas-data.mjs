export const GAS_HTML_BYTE_LIMIT = 4_500_000;

export function jsonHtmlDocument(id, value) {
  const json = JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
  return `<script type="application/json" id="${id}">${json}</script>\n`;
}

export function parseJsonHtml(content) {
  const start = content.indexOf('>');
  const end = content.lastIndexOf('</script>');
  if (start < 0 || end < 0 || end <= start) throw new Error('埋め込みデータファイルの形式を確認してください。');
  return JSON.parse(content.slice(start + 1, end));
}

function fileName(index) {
  return 'Images' + String(index).padStart(2, '0');
}

export function packImageFiles(imageData, limit = GAS_HTML_BYTE_LIMIT) {
  const files = [];
  const index = {};
  let current = { name: fileName(1), records: {}, bytes: 0 };
  const flush = () => {
    if (!Object.keys(current.records).length) return;
    files.push(current);
    current = { name: fileName(files.length + 1), records: {}, bytes: 0 };
  };
  const recordSize = record => JSON.stringify({ [record.path + '#' + record.part]: record }).length;
  const emptyWrapper = jsonHtmlDocument('Images00', {}).length;
  const capacity = Math.max(256, limit - emptyWrapper);

  for (const [path, dataUrl] of Object.entries(imageData)) {
    const mime = String(dataUrl).match(/^data:([^;]+);base64,/)?.[1] || 'application/octet-stream';
    const base64 = String(dataUrl).slice(String(dataUrl).indexOf(',') + 1);
    const overhead = recordSize({ path, mime, part: 0, parts: 99, data: '' });
    const chunkChars = Math.max(32, capacity - overhead);
    if (chunkChars <= 32 && overhead >= capacity) throw new Error(`画像 ${path} をGASのファイルサイズ制限内に分割できません。`);
    const chunks = [];
    for (let i = 0; i < base64.length || chunks.length === 0; i += chunkChars) chunks.push(base64.slice(i, i + chunkChars));
    chunks.forEach((data, part) => {
      const record = { path, mime, part, parts: chunks.length, data };
      const size = recordSize(record);
      if (size > capacity) throw new Error(`画像 ${path} をGASのファイルサイズ制限内に分割できません。`);
      if (current.bytes + size > capacity && Object.keys(current.records).length) flush();
      current.records[`${path}#${part}`] = record;
      current.bytes += size;
      const names = index[path] ||= [];
      if (names[names.length - 1] !== current.name) names.push(current.name);
    });
  }
  flush();
  return {
    files: files.map(file => ({ name: file.name, html: jsonHtmlDocument(file.name, file.records) })),
    index
  };
}

export function assembleImages(payloads, paths) {
  const wanted = paths ? new Set(paths) : null;
  const pending = {};
  for (const records of payloads) {
    for (const record of Object.values(records || {})) {
      if (wanted && !wanted.has(record.path)) continue;
      const entry = pending[record.path] ||= { mime: record.mime, parts: record.parts, chunks: [] };
      entry.chunks[record.part] = record.data;
    }
  }
  const result = {};
  for (const [path, entry] of Object.entries(pending)) {
    if (entry.chunks.length !== entry.parts || entry.chunks.some(part => part == null || part === '')) {
      throw new Error(`画像 ${path} のデータが揃っていません。アプリをデプロイし直してください。`);
    }
    result[path] = `data:${entry.mime};base64,${entry.chunks.join('')}`;
  }
  return result;
}
