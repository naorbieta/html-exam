export function isFileAnswer(value) {
  return value && typeof value === 'object' && !Array.isArray(value) && value.entry === 'index.html' &&
    value.files && typeof value.files === 'object' && !Array.isArray(value.files) &&
    typeof value.files['index.html'] === 'string' && Object.entries(value.files).every(([name, content]) =>
      /^(?:index\.html|style(?:-\d+)?\.css|script(?:-\d+)?\.js)$/.test(name) && typeof content === 'string');
}

export function splitEditorFiles(value) {
  const saved = isFileAnswer(value) ? value : null;
  const source = saved ? saved.files['index.html'] : value;
  if (typeof source !== 'string' || !/^\s*<(?:!doctype\s+html|html\b)/i.test(source)) return saved;
  const files = saved ? { ...saved.files } : {};
  let count = 0;
  let html = source.replace(/<style\b([^>]*)>([\s\S]*?)<\/style\s*>/gi, (_, attributes, css) => {
    let name; do { name = `style${count++ ? `-${count}` : ''}.css`; } while (Object.hasOwn(files, name));
    const lines = css.replace(/^\r?\n/, '').replace(/\r?\n\s*$/, '').split('\n');
    const indent = Math.min(...lines.filter(line => line.trim()).map(line => line.match(/^[\t ]*/)[0].length), 10000);
    files[name] = lines.map(line => line.slice(indent)).join('\n');
    return `<link rel="stylesheet" href="${name}"${attributes}>`;
  });
  let scripts = 0;
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi, (tag, attributes, script) => {
    const type = attributes.match(/\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    if (/\bsrc\s*=/i.test(attributes) || type && !/^(?:module|(?:text|application)\/javascript)$/i.test(type[1] ?? type[2] ?? type[3])) return tag;
    let name; do { name = `script${scripts++ ? `-${scripts}` : ''}.js`; } while (Object.hasOwn(files, name));
    files[name] = script.replace(/^\r?\n/, '').replace(/\r?\n\s*$/, '');
    return `<script src="${name}"${attributes}></script>`;
  });
  return { entry: 'index.html', files: { 'index.html': html, ...files } };
}

export function codeSource(value) {
  if (!isFileAnswer(value)) return typeof value === 'string' ? value : '';
  return value.files[value.entry].replace(/<link\b([^>]*)>/gi, (tag, attributes) => {
    const href = attributes.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const name = (href?.[1] ?? href?.[2] ?? href?.[3] ?? '').replace(/^\.\//, '');
    if (!/\brel\s*=\s*(?:"stylesheet"|'stylesheet'|stylesheet(?:\s|$))/i.test(attributes) || !/^style(?:-\d+)?\.css$/.test(name) || !Object.hasOwn(value.files, name)) return tag;
    const styleAttributes = attributes.replace(/\s*\b(?:href|rel)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    return `<style${styleAttributes}>\n${value.files[name]}\n</style>`;
  }).replace(/<script\b([^>]*)>\s*<\/script\s*>/gi, (tag, attributes) => {
    const src = attributes.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const name = (src?.[1] ?? src?.[2] ?? src?.[3] ?? '').replace(/^\.\//, '');
    if (!/^script(?:-\d+)?\.js$/.test(name) || !Object.hasOwn(value.files, name)) return tag;
    return `<script${attributes.replace(/\s*\bsrc\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')}>\n${value.files[name]}\n</script>`;
  });
}
