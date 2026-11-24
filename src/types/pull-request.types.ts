import type { LockInfo } from './lock.types'
import type { PublicIdentity } from './profile.types'

// Provisional: pull requests are server issue pyn#696 and not built yet. The shapes follow the
// reference layout and the server's merge types (`MergeOutcome`, `MergeFastForward`).

export type PullRequestState = 'open' | 'merged' | 'closed'

export type PullReviewState = 'none' | 'requested' | 'approved' | 'changes_requested'

/** What a merge preview reports (`MergeOutcome`). */
export type PullMergeOutcome = 'up_to_date' | 'fast_forward' | 'merge' | 'conflicted'

/** How the merge is written (`MergeFastForward`): fast-forward when possible, never, or only. */
export type PullMergeMethod = 'allow' | 'never' | 'only'

export interface PullRequestSummary {
  number: number
  title: string
  state: PullRequestState
  author: PublicIdentity
  /** Target branch. */
  base: string
  /** Source branch. */
  head: string
  opened_at: string
  closed_at?: string | null
  merged_at?: string | null
  /** Who merged it. */
  merged_by?: PublicIdentity | null
  comments: number
  review: PullReviewState
  additions: number
  deletions: number
  /** Opens the pull request; the list rows link here. */
  href?: string
  /** Locks other people hold on the changed paths. */
  locked?: number
  /** Not ready for review; it cannot be merged until marked ready. */
  draft?: boolean
}

export interface PullConflict {
  path: string
  /** `MergeConflictKind`. */
  kind: string
}

export interface PullRequest extends PullRequestSummary {
  body: string
  commits: number
  changed_files: number
  outcome?: PullMergeOutcome
  conflicts?: PullConflict[]
  /** Locks on the changed paths, whoever holds them; those held by others block the merge. */
  locks?: LockInfo[]
  approvals?: { approved: number; required: number }
  threads?: { resolved: number; total: number }
  participants?: PublicIdentity[]
}

export interface PullCommit {
  id: string
  message: string
  author: PublicIdentity
  committed_at: string
  href?: string
}

export type PullEventKind = 'comment' | 'merged' | 'closed' | 'reopened'

export interface PullEvent {
  id: string
  kind: PullEventKind
  actor: PublicIdentity
  at: string
  /** Markdown of a comment. */
  body?: string
}

/** What `PynPullRequestForm` submits. */
export interface NewPullRequest {
  title: string
  body: string
  draft: boolean
  base: string
  head: string
}

export type PullTab = 'overview' | 'commits' | 'checks' | 'files'
