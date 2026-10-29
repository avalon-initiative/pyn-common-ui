import type { OwnerUsage, RepoUsage, RepoUsageBreakdown } from '../types/usage.types'

const GB = 1024 ** 3
const MB = 1024 ** 2

export const repoUsages: RepoUsage[] = [
  {
    repository: 'studio/game',
    repo_id: 'r1',
    stored_bytes: 9 * GB,
    files: 1240,
    revisions: 5310,
    storage_cap: 10 * GB,
  },
  {
    repository: 'studio/assets',
    repo_id: 'r2',
    stored_bytes: 4 * GB,
    files: 380,
    revisions: 902,
    storage_cap: null,
  },
  {
    repository: 'studio/tools',
    repo_id: 'r3',
    stored_bytes: 12 * MB,
    files: 41,
    revisions: 120,
    storage_cap: 10 * MB,
  },
]

export const ownerUsage: OwnerUsage = {
  owner: 'studio',
  owner_id: 'o1',
  limits: {
    owner_id: 'o1',
    kind: 'org',
    effective: { repositories: 10, members: 25, storage_bytes: 20 * GB },
    own: { repositories: null, members: 25, storage_bytes: 20 * GB },
  },
  usage: { repositories: 3, members: 12, stored_bytes: 13 * GB },
  repositories: repoUsages,
}

export const unlimitedOwnerUsage: OwnerUsage = {
  owner: 'alice',
  owner_id: 'u1',
  limits: {
    owner_id: 'u1',
    kind: 'user',
    effective: { repositories: null, members: null, storage_bytes: null },
    own: { repositories: null, members: null, storage_bytes: null },
  },
  usage: { repositories: 1, members: null, stored_bytes: 300 * MB },
  repositories: [
    {
      repository: 'alice/notes',
      repo_id: 'r9',
      stored_bytes: 300 * MB,
      files: 12,
      revisions: 30,
      storage_cap: null,
    },
  ],
}

export const breakdown: RepoUsageBreakdown = {
  repository: 'studio/game',
  repo_id: 'r1',
  stored_bytes: 9 * GB,
  storage_cap: 10 * GB,
  folders: [
    { folder: 'art', stored_bytes: 6 * GB, files: 700 },
    { folder: 'audio', stored_bytes: 3.5 * GB, files: 300 },
    { folder: '', stored_bytes: 2 * MB, files: 4 },
  ],
  largest_paths: [
    { path: 'art/hero.psd', stored_bytes: 1.2 * GB, revisions: 14 },
    { path: 'audio/theme.wav', stored_bytes: 800 * MB, revisions: 3 },
  ],
}

export const emptyBreakdown: RepoUsageBreakdown = {
  ...breakdown,
  stored_bytes: 0,
  storage_cap: null,
  folders: [],
  largest_paths: [],
}
