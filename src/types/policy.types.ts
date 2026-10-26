import type { LockInfo } from './lock.types'

export type PolicyNoticeKind =
  'lock_required' | 'lock_held' | 'stale_base' | 'invalid_rules' | 'error'

/** One problem found in the policy text; `line` is 1-based and absent when not tied to a line. */
export interface PolicyProblem {
  line?: number
  message: string
}

/** Mirrors the server's `StrandedVersion`: a branch's shared version of a path that becomes exclusive. */
export interface StrandedVersion {
  path: string
  branch: string
  branch_owner: string
  revision: number
  commit: string
  author: string
  created_at: string
}

/** Mirrors the server's `PolicyPreview`. */
export interface PolicyPreview {
  to_shared: string[]
  to_exclusive: string[]
  released_locks: LockInfo[]
  stranded?: StrandedVersion[]
}
