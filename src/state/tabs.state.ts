import type { BranchSummary } from '../types/branch.types'
import type { SettingsGroup, SettingsSection, TabItem } from '../types/tabs.types'

/** Splits tabs into those shown and those in the More menu; the current tab stays shown. */
export function splitTabs(items: TabItem[], max?: number): { shown: TabItem[]; more: TabItem[] } {
  if (!max || max < 1 || items.length <= max) return { shown: items, more: [] }
  const at = items.findIndex((t) => t.current)
  const keep = new Set(items.slice(0, at >= max ? max - 1 : max))
  if (at >= max) keep.add(items[at]!)
  return { shown: items.filter((t) => keep.has(t)), more: items.filter((t) => !keep.has(t)) }
}

/**
 * Splits tabs by measured width: `widths[i]` is tab i, `more` the More trigger, `gap` the space between items.
 * The current tab always stays shown; `max` still caps the shown count.
 */
export function fitTabs(
  items: TabItem[],
  widths: number[],
  avail: number,
  more: number,
  gap: number,
  max?: number,
): { shown: TabItem[]; more: TabItem[] } {
  const cap = max && max >= 1 ? max : items.length
  const total = widths.reduce((a, w) => a + w, 0) + gap * Math.max(0, items.length - 1)
  if (items.length <= cap && total <= avail) return { shown: items, more: [] }
  const cur = items.findIndex((t) => t.current)
  const keep = new Set<number>()
  let used = more + gap
  if (cur >= 0) {
    keep.add(cur)
    used += (widths[cur] ?? 0) + gap
  }
  for (let i = 0; i < items.length; i++) {
    if (i === cur) continue
    const w = (widths[i] ?? 0) + gap
    if (keep.size >= cap || used + w > avail + gap) break
    keep.add(i)
    used += w
  }
  if (keep.size === 0 && items.length) keep.add(0)
  return {
    shown: items.filter((_, i) => keep.has(i)),
    more: items.filter((_, i) => !keep.has(i)),
  }
}

export const tabCountLabel = (t: TabItem): string => t.countLabel ?? `${t.count} items`

/** Groups consecutive sections that share a `group` label. */
export function groupSections(sections: SettingsSection[]): SettingsGroup[] {
  const groups: SettingsGroup[] = []
  for (const s of sections) {
    const last = groups.at(-1)
    if (last && last.label === s.group) last.sections.push(s)
    else groups.push({ label: s.group, sections: [s] })
  }
  return groups
}

export const BRANCHES_SHOWN = 5

/** The default branch first, then the others in the given order, at most `BRANCHES_SHOWN`. */
export function railBranches(branches: BranchSummary[], defaultBranch?: string): BranchSummary[] {
  const isDefault = (b: BranchSummary) => b.isDefault || b.name === defaultBranch
  const def = branches.find(isDefault) ?? (defaultBranch ? { name: defaultBranch } : undefined)
  const rest = branches.filter((b) => !isDefault(b))
  return [...(def ? [{ ...def, isDefault: true }] : []), ...rest].slice(0, BRANCHES_SHOWN)
}

export function aheadBehind(b: BranchSummary): string {
  const parts: string[] = []
  if (b.ahead) parts.push(`${b.ahead} ahead`)
  if (b.behind) parts.push(`${b.behind} behind`)
  return parts.join(', ')
}
