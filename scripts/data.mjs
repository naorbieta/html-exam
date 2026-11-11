import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLessons } from './read-lessons.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function readAuthoringData(projectRoot = root) {
  const { tables, imageFiles } = await loadLessons(projectRoot);
  return { ...tables, imageFiles };
}
