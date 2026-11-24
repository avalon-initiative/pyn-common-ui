import { diffFiles, lockedBinary } from './diff-data'
import { lock, now } from './landing-data'
import type {
  PullCommit,
  PullEvent,
  PullRequest,
  PullRequestSummary,
} from '../types/pull-request.types'

const ago = (hours: number) => new Date(now.getTime() - hours * 3_600_000).toISOString()

export const jamie = { user: 'jamie', display_name: 'Jamie Park' }
export const sam = { user: 'sam', display_name: 'Sam Ortiz' }
export const riley = { user: 'riley', display_name: 'Riley Chen' }

export const openPull: PullRequest = {
  number: 42,
  title: 'Add level two and rebalance the tutorial',
  state: 'open',
  author: jamie,
  base: 'main',
  head: 'feature/level-two',
  opened_at: ago(12),
  comments: 3,
  review: 'requested',
  additions: 474,
  deletions: 468,
  commits: 3,
  changed_files: diffFiles.length,
  href: '/acme/castle-quest/pulls/42',
  outcome: 'merge',
  approvals: { approved: 0, required: 1 },
  threads: { resolved: 1, total: 2 },
  participants: [jamie, sam],
  body: `Adds **Level02** and trims the tutorial.

- New enemy waves in \`Source/\`
- Tutorial copy in \`docs/levels.md\`

| Level | Status |
| ----- | ------ |
| 01    | tuned  |
| 02    | new    |
`,
}

export const lockedPull: PullRequest = {
  ...openPull,
  locked: 1,
  locks: [
    lock('Content/Levels/Level01.umap', 'sam', 90),
    lock('Content/Levels/Level02.umap', 'jamie', 30),
  ],
}

export const conflictedPull: PullRequest = {
  ...openPull,
  outcome: 'conflicted',
  conflicts: [
    { path: 'Cargo.lock', kind: 'content' },
    { path: 'docs/levels.md', kind: 'both_added' },
  ],
}

export const mergedPull: PullRequest = {
  ...openPull,
  state: 'merged',
  merged_at: ago(2),
  merged_by: sam,
  review: 'approved',
}

export const closedPull: PullRequest = {
  ...openPull,
  state: 'closed',
  closed_at: ago(5),
  review: 'none',
}

export const emptyPull: PullRequest = {
  ...openPull,
  number: 43,
  title: 'Branch with no description',
  body: '',
  comments: 0,
  commits: 0,
  changed_files: 0,
  additions: 0,
  deletions: 0,
  review: 'none',
  approvals: undefined,
  threads: undefined,
  participants: [],
}

export const pullCommits: PullCommit[] = [
  {
    id: '210e2fe9a1b3c4d5e6f708192a3b4c5d6e7f8091',
    message: 'Add level two layout',
    author: jamie,
    committed_at: ago(12),
    href: '/acme/castle-quest/commit/210e2fe',
  },
  {
    id: '7a1c0d4e5f60718293a4b5c6d7e8f90a1b2c3d4e',
    message: 'Rebalance the tutorial waves',
    author: jamie,
    committed_at: ago(14),
  },
  {
    id: '9bb3a1c2d3e4f5061728394a5b6c7d8e9f0a1b2c',
    message: 'Notes for the level designers',
    author: sam,
    committed_at: ago(60),
  },
]

export const pullEvents: PullEvent[] = [
  {
    id: 'e1',
    kind: 'comment',
    actor: sam,
    at: ago(10),
    body: 'Level01 is locked on my side until tomorrow, please wait for the release.',
  },
  { id: 'e2', kind: 'closed', actor: riley, at: ago(6) },
  { id: 'e3', kind: 'reopened', actor: jamie, at: ago(5) },
]

export const mergedEvents: PullEvent[] = [
  ...pullEvents.slice(0, 1),
  { id: 'e4', kind: 'merged', actor: sam, at: ago(2) },
]

export const filesWithLock = diffFiles.map((f) =>
  f.path.endsWith('Level01.umap') ? lockedBinary('sam') : f,
)

const summary = (n: number, over: Partial<PullRequestSummary>): PullRequestSummary => ({
  ...openPull,
  number: n,
  href: `/acme/castle-quest/pulls/${n}`,
  ...over,
})

export const pullList: PullRequestSummary[] = [
  summary(42, {}),
  summary(41, {
    title: 'Fix the lease timer on slow connections',
    author: sam,
    opened_at: ago(30),
    comments: 0,
    review: 'approved',
    head: 'fix/lease-timer',
    additions: 12,
    deletions: 3,
  }),
  summary(40, {
    title: 'Lock the boss arena map',
    author: riley,
    opened_at: ago(70),
    comments: 7,
    review: 'changes_requested',
    locked: 2,
    head: 'feature/boss-arena',
  }),
  summary(39, {
    title: 'Update the README for contributors',
    state: 'merged',
    merged_at: ago(90),
    opened_at: ago(120),
    comments: 2,
    review: 'approved',
    head: 'docs/readme',
    additions: 30,
    deletions: 4,
  }),
  summary(38, {
    title: 'Try a different camera rig',
    state: 'closed',
    closed_at: ago(200),
    opened_at: ago(240),
    comments: 1,
    review: 'none',
    head: 'spike/camera',
  }),
]
