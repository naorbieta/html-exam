/** 選択肢がコードや値（単位・パス・識別子など）に見えるかどうか。 */
export function looksLikeCode(option) {
  const text = String(option ?? '').trim();
  if (!text) return false;
  if (/[{};<>`]/.test(text)) return true;
  if (/^[@!]/.test(text)) return true;
  if (/^[\w-]+\s*:\s/.test(text)) return true;
  if (/\(.*\)/.test(text)) return true;
  if (/^#(?:[a-fA-F\d]{3}|[a-fA-F\d]{6}|[a-fA-F\d]{8})$/.test(text)) return true;
  if (/\d+(?:\.\d+)?\s*:\s*\d/.test(text)) return true;
  if (/(?:^|[\s,])\d+(?:\.\d+)?(?:px|em|rem|%|fr|vh|vw|svh|lvh|ch|ex|s|ms|deg)\b/.test(text)) return true;
  if (/^(?:\d+(?:\.\d+)?(?:px|em|rem|%|fr|vh|vw|s|ms)\s*)+$/.test(text)) return true;
  if (/^\$/.test(text) || /\$_[A-Z]+/.test(text)) return true;
  if (/^(?:\.?\.?\/)?[\w./-]+\.(?:png|jpe?g|gif|svg|webp|css|js|html)$/i.test(text)) return true;
  if (/^[A-Za-z][\w-]*$/.test(text)) return true;
  return false;
}

/** 1問の選択肢は、すべてコード表記か、すべて通常表記か、どちらかにそろえる。 */
export function choicesUseCodeStyle(options) {
  const list = (options || []).map(value => String(value ?? '').trim()).filter(Boolean);
  return list.length > 0 && list.every(looksLikeCode);
}
