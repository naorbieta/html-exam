export function lessonDescription(quiz) {
  return String(quiz?.description || '').trim();
}
