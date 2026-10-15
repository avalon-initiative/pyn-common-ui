import type { LockInfo } from './lock.types'
import type { Revision } from './repo.types'

export type TreeMode = 'shared' | 'exclusive' | 'mixed'

export interface Crumb {
  label: string
  /** Absent on the current location. */
  href?: string
}

export type TreeEntryKind = 'file' | 'folder'

/** One path in a folder listing, with its newest revision and live lock if any. */
export interface TreeEntry {
  kind: TreeEntryKind
  /** The last path segment. */
  name: string
  /** Repo-relative path. */
  path: string
  mode: TreeMode
  last_change?: Revision | null
  lock?: LockInfo | null
}

export interface TreeListing {
  /** The listed folder; empty for the root. */
  path: string
  entries: TreeEntry[]
}

export interface ActivityEntry {
  id: number
  at: string
  actor: string
  /** checkout, release, checkin, restore or force_unlock. */
  action: string
  path?: string | null
}

export interface RepoSummary {
  default_branch: string
  files: number
  exclusive_files: number
  shared_files: number
  updated_at?: string | null
  locks: LockInfo[]
  /** Newest first. */
  activity: ActivityEntry[]
}
