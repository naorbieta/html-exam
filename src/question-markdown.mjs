// 設問の説明（Markdown の小さな部分集合）をブロックに分けます。
// - ```html / ```css / ```js / ```php / ```text などはコードとして表示します。
// - ```preview はHTML/CSSの表示例として、スクリプトを動かさない iframe に描画します（`height=160` `label="見本"` を指定できます）。
// - ```svg は図として画像で表示します。
// - それ以外は段落・箇条書き（- ）・見出し（### ）・インラインの `コード` と **強調** です。
export function parseQuestionMarkdown(text) {
  const blocks = [];
  const lines = String(text ?? '').replace(/\r\n?/g, '\n').split('\n');
  let paragraph = [], list = null;
  const flush = () => {
    if (paragraph.length) { blocks.push({ type: 'paragraph', text: paragraph.join('\n') }); paragraph = []; }
    if (list) { blocks.push({ type: 'list', items: list }); list = null; }
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = line.match(/^\s*```\s*([\w-]*)\s*(.*)$/);
    if (fence) {
      flush();
      const body = [];
      for (i++; i < lines.length && !/^\s*```\s*$/.test(lines[i]); i++) body.push(lines[i]);
      const attrs = Object.fromEntries([...fence[2].matchAll(/([\w-]+)=(?:"([^"]*)"|(\S+))/g)].map(match => [match[1], match[2] ?? match[3]]));
      const source = body.join('\n');
      const lang = fence[1].toLowerCase();
      if (lang === 'preview') blocks.push({ type: 'preview', source, height: Math.min(600, Math.max(40, Number(attrs.height) || 160)), label: attrs.label || '' });
      else if (lang === 'svg') blocks.push({ type: 'figure', source, label: attrs.label || '' });
      else blocks.push({ type: 'code', lang, source, label: attrs.label || '' });
      continue;
    }
    if (!line.trim()) { flush(); continue; }
    const heading = line.match(/^###\s+(.*)$/);
    if (heading) { flush(); blocks.push({ type: 'heading', text: heading[1] }); continue; }
    const bullet = line.match(/^\s*[-・]\s+(.*)$/);
    if (bullet) {
      if (paragraph.length) { blocks.push({ type: 'paragraph', text: paragraph.join('\n') }); paragraph = []; }
      (list ||= []).push(bullet[1]); continue;
    }
    if (list) { blocks.push({ type: 'list', items: list }); list = null; }
    paragraph.push(line);
  }
  flush();
  return blocks;
}

// インラインの `コード` と **強調** を区切ります。
export function parseInline(text) {
  const parts = [];
  const pattern = /`([^`\n]+)`|\*\*([^*\n]+)\*\*/g;
  let last = 0, match;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push({ type: 'text', text: text.slice(last, match.index) });
    parts.push(match[1] !== undefined ? { type: 'code', text: match[1] } : { type: 'strong', text: match[2] });
    last = pattern.lastIndex;
  }
  if (last < text.length) parts.push({ type: 'text', text: text.slice(last) });
  return parts;
}

// 表示例は、スクリプト・通信を止めた文書として描画します。
export function previewFigureDocument(source) {
  return `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:"><style>html,body{margin:0;padding:12px;font-family:system-ui,-apple-system,"Hiragino Sans","Noto Sans JP",sans-serif;font-size:15px;line-height:1.6;color:#222;background:#fff;box-sizing:border-box}</style>${source}`;
}

export function svgDataUrl(source) {
  const svg = /xmlns=/.test(source) ? source : source.replace(/<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg"');
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
