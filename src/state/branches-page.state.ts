import type { BranchListItem, BranchView } from '../types/branch.types'

export interface BranchGroup {
  id: string
  title: string
  rows: BranchListItem[]
}

export interface BranchFilters {
  yours?: string[]
  active?: string[]
  stale?: string[]
}

const norm = (s: string) => s.trim().toLowerCase()

/** The default branch first, then the rest in the order given. */
export function defaultFirst(branches: BranchListItem[], defaultBranch?: string): BranchListItem[] {
  const isDef = (b: BranchListItem) => b.isDefault || b.name === defaultBranch
  return [...branches.filter(isDef), ...branches.filter((b) => !isDef(b))].map((b) =>
    isDef(b) ? { ...b, isDefault: true } : b,
  )
}

/** Names of the views that can be computed: the two always-on views plus each given name list. */
export function availableViews(f: BranchFilters): BranchView[] {
  const views: BranchView[] = ['branches']
  if (f.yours) views.push('yours')
  if (f.active) views.push('active')
  if (f.stale) views.push('stale')
  views.push('all')
  return views
}

/** Tables for a view: the default branch alone first, then the others grouped by what is known. */
export function branchGroups(
  branches: BranchListItem[],
  view: BranchView,
  query: string,
  filters: BranchFilters,
  defaultBranch?: string,
): BranchGroup[] {
  const q = norm(query)
  const rows = defaultFirst(branches, defaultBranch).filter((b) => norm(b.name).includes(q))
  const named = (names?: string[]) => rows.filter((b) => !b.isDefault && names?.includes(b.name))
  const others = rows.filter((b) => !b.isDefault)
  const only = (id: string, title: string, list: BranchListItem[]) =>
    list.length ? [{ id, title, rows: list }] : []
  const def = only(
    'default',
    'Default',
    rows.filter((b) => b.isDefault),
  )

  if (view === 'all') return only('all', 'All branches', rows)
  if (view === 'yours') return only('yours', 'Your branches', named(filters.yours))
  if (view === 'active') return only('active', 'Active branches', named(filters.active))
  if (view === 'stale') return only('stale', 'Stale branches', named(filters.stale))
  const yours = named(filters.yours)
  const active = named(filters.active).filter((b) => !yours.includes(b))
  if (!filters.yours && !filters.active) return [...def, ...only('other', 'Branches', others)]
  return [
    ...def,
    ...only('yours', 'Your branches', yours),
    ...only('active', 'Active branches', active),
  ]
}
