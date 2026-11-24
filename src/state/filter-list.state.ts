export const pageCount = (count: number, pageSize: number): number =>
  pageSize > 0 ? Math.max(1, Math.ceil(count / pageSize)) : 1

/** "31–60 of 75"; "0 of 0" when empty. */
export function rangeText(count: number, page: number, pageSize: number): string {
  if (count <= 0) return '0 of 0'
  const from = (page - 1) * pageSize + 1
  return `${from}–${Math.min(count, page * pageSize)} of ${count}`
}

/** Page numbers around the current page, with `null` standing for a gap. */
export function pageWindow(page: number, pages: number, around = 1): (number | null)[] {
  const keep = new Set([1, pages])
  for (let p = page - around; p <= page + around; p++) if (p >= 1 && p <= pages) keep.add(p)
  const out: (number | null)[] = []
  let last = 0
  for (const p of [...keep].sort((a, b) => a - b)) {
    if (p - last === 2) out.push(last + 1)
    else if (p - last > 2) out.push(null)
    out.push(p)
    last = p
  }
  return out
}

/** "1 repository" or "75 repositories". */
export const rowCountText = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`
