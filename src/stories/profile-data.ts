import type { RepoInfo } from '../types/repo.types'
import { orgs } from './org-data'

export { orgs }

export const profile = {
  username: 'alice',
  displayName: 'Alice Anders',
  bio: 'Level designer. Mostly Unreal, sometimes Godot.\nAsk me about lock etiquette.',
  location: 'Lisbon',
  company: 'Studio',
  links: ['https://alice.example.com/', 'https://github.com/alice'],
  createdAt: '2026-09-02T08:00:00Z',
}

export const repos: RepoInfo[] = [
  {
    id: 'repo-alice-maps',
    owner_id: 'user-alice',
    owner: 'alice',
    name: 'maps',
    visibility: 'public',
    lease_hours: 8,
    created_at: '2026-10-01T09:00:00Z',
    role: 'owner',
  },
  {
    id: 'repo-alice-notes',
    owner_id: 'user-alice',
    owner: 'alice',
    name: 'notes',
    visibility: 'public',
    lease_hours: 4,
    created_at: '2026-10-05T09:00:00Z',
    role: null,
  },
]

export const activity = [
  { id: 3, at: '2026-11-14T10:00:00Z', actor: 'alice', action: 'checkout', path: 'Level01.umap' },
  { id: 2, at: '2026-11-13T09:00:00Z', actor: 'alice', action: 'checkin', path: 'Level01.umap' },
]
