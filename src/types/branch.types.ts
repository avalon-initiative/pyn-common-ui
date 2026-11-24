export interface BranchOption {
  name: string
  isDefault?: boolean
  updatedAt?: string | null
}

export type BranchCompareStatus = 'identical' | 'ahead' | 'behind' | 'diverged'
export type BranchChangeKind = 'added' | 'modified' | 'deleted'

export interface BranchChange {
  path: string
  kind: BranchChangeKind
}

/** A branch in the overview rail; ahead and behind count commits against the default branch. */
export interface BranchSummary {
  name: string
  isDefault?: boolean
  ahead?: number
  behind?: number
  updatedAt?: string | null
}

/** A row of the branches list; `compareHref` opens the comparison with the default branch. */
export interface BranchListItem extends BranchSummary {
  href?: string
  compareHref?: string
  /** Who made the last change, shown beside the updated time. */
  updatedBy?: { username: string; name?: string | null; avatarUrl?: string | null }
}

/** Views of the branches page; the first and last always show, the others need their name list. */
export type BranchView = 'branches' | 'yours' | 'active' | 'stale' | 'all'
