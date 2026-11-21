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
