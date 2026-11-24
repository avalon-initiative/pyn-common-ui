import { formatDate } from '../utils/datetime'
import type { LockInfo } from '../types/lock.types'
import type { TabItem } from '../types/tabs.types'
import type {
  PullCommit,
  PullMergeMethod,
  PullRequest,
  PullRequestState,
  PullRequestSummary,
  PullReviewState,
  PullTab,
} from '../types/pull-request.types'

export const PULL_STATE_LABEL: Record<PullRequestState, string> = {
  open: 'Open',
  merged: 'Merged',
  closed: 'Closed',
}

export const MERGE_METHODS: { id: PullMergeMethod; label: string; hint: string }[] = [
  {
    id: 'allow',
    label: 'Merge',
    hint: 'Fast-forward when the branch allows it, else a merge commit',
  },
  { id: 'never', label: 'Create a merge commit', hint: 'Always write a merge commit' },
  { id: 'only', label: 'Fast-forward only', hint: 'Merge only when the branch can fast-forward' },
]

const TAB_PATH: Record<PullTab, string> = {
  overview: '',
  commits: '/commits',
  checks: '/checks',
  files: '/files',
}

/** The page's tabs; `base` is the pull request's own path, e.g. `/acme/game/pulls/12`. */
export function pullTabs(
  pr: Pick<PullRequest, 'commits' | 'changed_files'>,
  base: string,
  current: PullTab,
): TabItem[] {
  const item = (tab: PullTab, label: string, icon: string, count?: number): TabItem => ({
    label,
    icon,
    count,
    href: base + TAB_PATH[tab],
    current: tab === current,
  })
  return [
    item('overview', 'Overview', 'list'),
    item('commits', 'Commits', 'commit', pr.commits),
    item('checks', 'Checks', 'check-circle'),
    item('files', 'Files changed', 'file-diff', pr.changed_files),
  ]
}

/** Locks held by someone other than `me`; these block a merge. */
export const pullLocksByOthers = (locks: LockInfo[] | undefined, me?: string): LockInfo[] =>
  (locks ?? []).filter((l) => l.owner !== me)

export type MergeBlocker = 'conflicts' | 'locks'

export function mergeBlockers(pr: PullRequest, me?: string): MergeBlocker[] {
  const out: MergeBlocker[] = []
  if (pr.outcome === 'conflicted' || pr.conflicts?.length) out.push('conflicts')
  if (pullLocksByOthers(pr.locks, me).length) out.push('locks')
  return out
}

export interface MergeStatus {
  tone: 'success' | 'attention' | 'danger' | 'neutral' | 'merged'
  title: string
  text: string
}

/** The merge box heading for the pull request as it stands. */
export function mergeStatus(pr: PullRequest, me?: string): MergeStatus {
  if (pr.state === 'merged')
    return {
      tone: 'merged',
      title: 'Pull request merged',
      text: `${pr.head} was merged into ${pr.base}.`,
    }
  if (pr.state === 'closed')
    return { tone: 'neutral', title: 'Pull request closed', text: 'It was closed without merging.' }
  const blockers = mergeBlockers(pr, me)
  if (blockers.includes('conflicts'))
    return {
      tone: 'danger',
      title: 'This branch has conflicts',
      text: `Resolve them before merging into ${pr.base}.`,
    }
  if (blockers.includes('locks')) {
    const n = pullLocksByOthers(pr.locks, me).length
    return {
      tone: 'attention',
      title: 'Locked paths block this merge',
      text: `${n} changed ${n === 1 ? 'path is' : 'paths are'} locked by someone else.`,
    }
  }
  if (pr.outcome === 'up_to_date')
    return {
      tone: 'neutral',
      title: 'Nothing to merge',
      text: `${pr.base} already has these changes.`,
    }
  if (pr.review === 'requested')
    return { tone: 'attention', title: 'Review requested', text: 'A review has been requested.' }
  if (pr.review === 'changes_requested')
    return { tone: 'danger', title: 'Changes requested', text: 'A reviewer asked for changes.' }
  return {
    tone: 'success',
    title: 'Ready to merge',
    text: `This branch has no conflicts with ${pr.base}.`,
  }
}

export const REVIEW_LABEL: Record<PullReviewState, string> = {
  none: '',
  requested: 'Review required',
  approved: 'Approved',
  changes_requested: 'Changes requested',
}

/** "opened 2 hours ago", "merged ..." or "closed ...": the verb and time for the state. */
export function pullWhen(pr: PullRequestSummary): { verb: string; at: string } {
  if (pr.state === 'merged' && pr.merged_at) return { verb: 'merged', at: pr.merged_at }
  if (pr.state === 'closed' && pr.closed_at) return { verb: 'closed', at: pr.closed_at }
  return { verb: 'opened', at: pr.opened_at }
}

/** Open and closed (merged or closed) counts for the list tabs. */
export function pullCounts(prs: PullRequestSummary[]) {
  const open = prs.filter((p) => p.state === 'open').length
  return { open, closed: prs.length - open }
}

export const shortId = (id: string) => id.slice(0, 7)

export function segmentFill(done: number, total: number): number {
  return total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0
}

/** Commits grouped by calendar day (as dated in `formatDate`), keeping their order. */
export function commitDays(commits: PullCommit[]): { day: string; commits: PullCommit[] }[] {
  const out: { day: string; commits: PullCommit[] }[] = []
  for (const c of commits) {
    const day = formatDate(c.committed_at)
    const last = out.at(-1)
    if (last?.day === day) last.commits.push(c)
    else out.push({ day, commits: [c] })
  }
  return out
}
