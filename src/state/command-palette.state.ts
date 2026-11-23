import type { CommandGroup, CommandItem } from '../types/command-palette.types'

function norm(s: string): string {
  return s.toLowerCase().trim()
}

/** Subsequence score: higher is tighter and earlier; 0 when the query is not a subsequence. */
function subsequence(query: string, target: string): number {
  let pos = 0
  let gaps = 0
  let last = -1
  for (const ch of query) {
    const at = target.indexOf(ch, pos)
    if (at < 0) return 0
    if (last >= 0) gaps += at - last - 1
    last = at
    pos = at + 1
  }
  return Math.max(1, 20 - gaps - Math.floor(last / 8))
}

function textScore(query: string, target: string): number {
  const t = norm(target)
  if (t === query) return 100
  if (t.startsWith(query)) return 80
  if (t.split(/[\s/_.:-]+/).some((w) => w.startsWith(query))) return 60
  if (t.includes(query)) return 40
  return subsequence(query, t)
}

/** Best score of an item for the query; 0 means no match. A label outranks a keyword. */
export function commandScore(item: CommandItem, query: string): number {
  const q = norm(query)
  if (!q) return 1
  const label = textScore(q, item.label)
  const keyword = Math.max(0, ...(item.keywords ?? []).map((k) => textScore(q, k) * 0.75))
  return Math.max(label, keyword)
}

/** Items matching the text, best score first; ties keep the input order. Empty text keeps everything. */
export function filterCommands(items: CommandItem[], text: string): CommandItem[] {
  const q = norm(text)
  if (!q) return [...items]
  return items
    .map((item, index) => ({ item, index, score: commandScore(item, q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((r) => r.item)
}

/** Groups in order of first appearance, items keeping their order inside each group. */
export function groupCommands(items: CommandItem[]): CommandGroup[] {
  const groups: CommandGroup[] = []
  for (const item of items) {
    const found = groups.find((g) => g.group === item.group)
    if (found) found.items.push(item)
    else groups.push({ group: item.group, items: [item] })
  }
  return groups
}

/** Text for the live region. */
export function resultsText(count: number, loading: boolean, emptyLabel: string): string {
  if (loading) return 'Loading…'
  if (count === 0) return emptyLabel
  return count === 1 ? '1 result' : `${count} results`
}

/** Next active index for an arrow key, wrapping; Home and End jump to the ends. */
export function moveActive(index: number, count: number, key: string): number {
  if (count === 0) return -1
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  if (key === 'ArrowDown') return index < 0 ? 0 : (index + 1) % count
  return index <= 0 ? count - 1 : index - 1
}
