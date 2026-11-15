/** Up to two uppercase initials: first and last word of the name; "?" when empty. */
export function initials(name: string): string {
  const words = name
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
  if (!words.length) return '?'
  const first = Array.from(words[0])[0]
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : ''
  return (first + last).toUpperCase()
}

/** The link without its scheme and trailing slash, for display. */
export function linkLabel(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

export function isWebLink(url: string): boolean {
  return /^https?:\/\/\S+$/i.test(url)
}
