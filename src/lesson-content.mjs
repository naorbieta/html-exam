export function referenceSource(quiz, item) {
  if (item.type === 'code') return '';
  const source = (item.description?.match(/(?:<!doctype\s+html>\s*)?<html\b[\s\S]*?<\/html>/i) || quiz.description?.match(/(?:<!doctype\s+html>\s*)?<html\b[\s\S]*?<\/html>/i))?.[0];
  if (!source) return '';
  const css = item.description?.trim();
  return (css && /^[.#][\w-]+\s*\{[\s\S]*\}$/.test(css)
    ? source.replace(/<\/html>/i, `<style>\n${css}\n</style>\n</html>`) : source).replace(/[\u00a0\u3000]/g, ' ');
}

export function lessonDescription(quiz, item) {
  const original = quiz.description || '';
  const source = item.type === 'code' ? item.grading?.starter : referenceSource(quiz, item);
  if (!source) return original;
  const normalize = value => value.replace(/[\u00a0\u3000]/g, ' ');
  const starter = normalize(source).trim();
  let description = normalize(original);
  const pattern = starter.split(/\s+/).map(token => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*');
  description = description.replace(new RegExp(pattern, 'g'), '');
  if (/^\s*<(?:!doctype\s+html|html\b)/i.test(starter)) {
    description = description.replace(/(?:<!doctype\s+html>\s*)?<html\b[\s\S]*?<\/html>/gi, '');
    description = description.replace(/<([a-z][\w-]*)\b[^>]*>[\s\S]*?<\/\1>/gi, source => starter.replace(/\s/g, '').includes(source.replace(/\s/g, '')) ? '' : source);
  }
  if (description !== normalize(original)) {
    description = description.replace(/^[\t \u3000]*(?:コード|HTML|CSS|■プログラム)[\t \u3000]*$/gm, '')
      .replace(/(?:下記|以下)の(コード|HTML(?:文)?|CSS)/g, '$1');
  }
  return description.trim().replace(/\n{3,}/g, '\n\n');
}
