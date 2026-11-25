import { pluralize } from '../utils/plural'
import { branchCount } from './branch-list.state'
import type { BranchSummary } from '../types/branch.types'
import type { SettingsGroup, SettingsSection, TabItem } from '../types/tabs.types'

/**
 * Splits tabs by measured width: `widths[i]` is tab i, `more` the More trigger, `gap` the space between items.
 * The current tab always stays shown.
 */
export function fitTabs(
  items: TabItem[],
  widths: number[],
  avail: number,
  more: number,
  gap: number,
): { shown: TabItem[]; more: TabItem[] } {
  const total = widths.reduce((a, w) => a + w, 0) + gap * Math.max(0, items.length - 1)
  if (total <= avail) return { shown: items, more: [] }
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
    if (used + w > avail + gap) break
    keep.add(i)
    used += w
  }
  if (keep.size === 0 && items.length) keep.add(0)
  return {
    shown: items.filter((_, i) => keep.has(i)),
    more: items.filter((_, i) => !keep.has(i)),
  }
}

export const tabCountLabel = (t: TabItem): string => t.countLabel ?? pluralize(t.count ?? 0, 'item')

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
  if (b.ahead) parts.push(`${branchCount(b.ahead, b.countsCapped)} ahead`)
  if (b.behind) parts.push(`${branchCount(b.behind, b.countsCapped)} behind`)
  return parts.join(', ')
}
