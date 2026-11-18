/** 画面に出す試験名。コース名の「試験 / 」は、アプリ名が Web試験のため付けない。 */
export function examLabel(quiz) {
  const fromCourse = String(quiz?.course || '').replace(/^試験\s*\/\s*/, '').trim();
  return fromCourse || String(quiz?.title || '').trim();
}
