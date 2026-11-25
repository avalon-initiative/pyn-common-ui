import type { RepoListItem } from '../types/repo.types'
import type { WatchedRepoItem } from '../types/repo-social.types'

export const watchingNow = new Date('2026-11-20T12:00:00Z')

const repo = (owner: string, name: string, extras: Partial<RepoListItem> = {}): RepoListItem => ({
  id: `repo-${owner}-${name}`,
  owner_id: `owner-${owner}`,
  owner,
  name,
  visibility: 'public',
  lease_hours: 8,
  created_at: '2026-10-01T09:00:00Z',
  updated_at: '2026-11-19T15:00:00Z',
  owner_avatar_url: null,
  ...extras,
})

export const watched: WatchedRepoItem[] = [
  {
    level: 'all',
    repo: repo('studio', 'game', {
      description: 'The main game project: levels, characters and build scripts.',
      language: 'C++',
      star_count: 12,
      fork_count: 2,
    }),
  },
  {
    level: 'locks',
    repo: repo('studio', 'art', {
      description: 'Source art. Binary files are exclusive.',
      star_count: 3,
    }),
  },
  { level: 'ignore', repo: repo('bob', 'tools', { visibility: 'private', role: 'reader' }) },
]
