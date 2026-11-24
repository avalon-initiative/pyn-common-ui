import { ancestorFolders } from './tree.state'
import type { DiffFile, DiffHunk, DiffLine, SplitRow, TextSegment } from '../types/diff.types'
import type { TreeEntry } from '../types/tree.types'

const TOKEN = /\w+|\s+|[^\w\s]/g

/** Changed ranges in `from` and `to` after trimming their shared leading and trailing tokens. */
export function wordMarks(from: string, to: string): [[number, number][], [number, number][]] {
  const a = from.match(TOKEN) ?? []
  const b = to.match(TOKEN) ?? []
  let head = 0
  while (head < a.length && head < b.length && a[head] === b[head]) head++
  let tail = 0
  while (
    tail < a.length - head &&
    tail < b.length - head &&
    a[a.length - 1 - tail] === b[b.length - 1 - tail]
  )
    tail++
  const span = (t: string[]): [number, number] => [
    t.slice(0, head).join('').length,
    t.slice(0, t.length - tail).join('').length,
  ]
  const [sa, ea] = span(a)
  const [sb, eb] = span(b)
  return [ea > sa ? [[sa, ea]] : [], eb > sb ? [[sb, eb]] : []]
}

/** Side-by-side rows: a run of deletions pairs line by line with the additions that follow it. */
export function splitRows(hunk: DiffHunk): SplitRow[] {
  const rows: SplitRow[] = []
  const lines = hunk.lines
  for (let i = 0; i < lines.length;) {
    const line = lines[i]!
    if (line.kind === 'context') {
      rows.push({ left: line, right: line })
      i++
      continue
    }
    const dels: DiffLine[] = []
    const adds: DiffLine[] = []
    while (i < lines.length && lines[i]!.kind === 'delete') dels.push(lines[i++]!)
    while (i < lines.length && lines[i]!.kind === 'add') adds.push(lines[i++]!)
    for (let k = 0; k < Math.max(dels.length, adds.length); k++)
      rows.push({ left: dels[k] ?? null, right: adds[k] ?? null })
  }
  return rows
}

/** Lines with their character marks: given marks win, else a delete/add pair is compared by word. */
export function markedLines(hunk: DiffHunk): DiffLine[] {
  const out = hunk.lines.map((l) => ({ ...l }))
  for (const row of splitRows({ ...hunk, lines: out })) {
    const { left, right } = row
    if (!left || !right || left === right) continue
    if (left.marks || right.marks) continue
    const [l, r] = wordMarks(left.text, right.text)
    left.marks = l
    right.marks = r
  }
  return out
}

/** Splits a line's text at its marked ranges. */
export function segments(text: string, marks?: [number, number][]): TextSegment[] {
  if (!marks?.length) return [{ text, marked: false }]
  const out: TextSegment[] = []
  let at = 0
  for (const [s, e] of [...marks].sort((x, y) => x[0] - y[0])) {
    if (s > at) out.push({ text: text.slice(at, s), marked: false })
    if (e > s) out.push({ text: text.slice(s, e), marked: true })
    at = Math.max(at, e)
  }
  if (at < text.length) out.push({ text: text.slice(at), marked: false })
  return out
}

export const diffTotals = (files: DiffFile[]) => ({
  files: files.length,
  additions: files.reduce((n, f) => n + f.additions, 0),
  deletions: files.reduce((n, f) => n + f.deletions, 0),
})

/** Five-square bar: the share of additions, rounded to squares; empty when nothing changed. */
export function statSquares(additions: number, deletions: number): ('add' | 'delete' | 'none')[] {
  const total = additions + deletions
  if (!total) return Array(5).fill('none')
  let add = Math.round((additions / total) * 5)
  if (additions > 0 && add === 0) add = 1
  if (deletions > 0 && add === 5) add = 4
  return Array.from({ length: 5 }, (_, i) => (i < add ? 'add' : 'delete'))
}

/** An element id for a file's block, so the tree can link to it. */
export const diffAnchor = (path: string) => `diff-${path.replace(/[^A-Za-z0-9_-]/g, '-')}`

/** Files whose path contains the query, case-insensitive; an empty query keeps all. */
export function filterDiffFiles(files: DiffFile[], query: string): DiffFile[] {
  const q = query.trim().toLowerCase()
  return q ? files.filter((f) => f.path.toLowerCase().includes(q)) : files
}

export function diffTreeEntries(files: DiffFile[]): TreeEntry[] {
  const seen = new Set<string>()
  const out: TreeEntry[] = []
  for (const f of files) {
    for (const folder of ancestorFolders(f.path)) {
      if (seen.has(folder)) continue
      seen.add(folder)
      out.push({
        kind: 'folder',
        name: folder.split('/').pop()!,
        path: folder,
        mode: 'shared',
      })
    }
    out.push({
      kind: 'file',
      name: f.path.split('/').pop()!,
      path: f.path,
      mode: f.mode ?? 'shared',
      lock: f.lock,
    })
  }
  return out
}

export const viewedText = (viewed: number, total: number) => `${viewed} / ${total} viewed`

/** Locks on the diff's files that someone other than `me` holds. */
export function locksHeldByOthers(files: DiffFile[], me?: string) {
  return files.flatMap((f) => (f.lock && f.lock.owner !== me ? [f.lock] : []))
}
