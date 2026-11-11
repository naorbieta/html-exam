import { parse, stringify } from 'yaml';

export function parseFrontmatter(text) {
  const source = String(text).replace(/^\uFEFF/, '');
  const match = source.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: source };
  return { data: parse(match[1]) ?? {}, body: match[2].replace(/^\r?\n/, '').replace(/\s+$/, '') };
}

export function stringifyFrontmatter(data, body = '') {
  const yaml = stringify(data, { lineWidth: 0, defaultStringType: 'PLAIN', defaultKeyType: 'PLAIN' }).trimEnd();
  const content = String(body ?? '').replace(/^\r?\n/, '').replace(/\s+$/, '');
  return `---\n${yaml}\n---\n` + (content ? `\n${content}\n` : '');
}
