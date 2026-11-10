import { readFile } from 'node:fs/promises';
import { parseCsv } from './csv.mjs';

export async function readAuthoringData(directory = new URL('../data/', import.meta.url)) {
  const [lessons, questions, rules] = await Promise.all([
    readFile(new URL('lessons.csv',directory),'utf8'),
    readFile(new URL('questions.csv',directory),'utf8'),
    readFile(new URL('../src/grading-rules.json',import.meta.url),'utf8')
  ]);
  return { lessons: parseCsv(lessons), questions: parseCsv(questions), rules: JSON.parse(rules) };
}
