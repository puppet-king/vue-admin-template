import pinyin from 'pinyin'

/**
 * 将中文文本转换为拼音标识 (中划线连接的小写字母)
 * 例如: "英语单词" -> "ying-yu-dan-ci", "法考" -> "fa-kao"
 * 若已是英文字符或中划线，则直接规范化输出
 */
export function toPinyinSlug(text: string): string {
  if (!text) return ''
  const trimmed = text.trim()
  if (!trimmed) return ''

  // 如果全是英文字符、数字和中划线，直接返回小写
  if (/^[a-zA-Z0-9_\-\s]+$/.test(trimmed)) {
    return trimmed
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const pyArray = pinyin(trimmed, {
    style: pinyin.STYLE_NORMAL,
  })

  return pyArray
    .map((item) => (Array.isArray(item) ? item[0] : item))
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}
