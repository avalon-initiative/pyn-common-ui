/** Mirrors the server's `Lock`. */
export interface LockInfo {
  path: string
  owner: string
  acquired_at: string
  expires_at: string
}

export type LockState = 'available' | 'locked' | 'mine' | 'expiring'

export type Mode = 'shared' | 'exclusive'

/** A path in a repository's file list. */
export interface FileRow {
  path: string
  mode: Mode
  /** Head revision; absent when the path is locked but has no revision yet. */
  revision?: number | null
  lock?: LockInfo | null
}
