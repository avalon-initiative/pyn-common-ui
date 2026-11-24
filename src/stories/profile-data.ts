import type { RepoListItem } from '../types/repo.types'
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

const repo = (name: string, over: Partial<RepoListItem> = {}): RepoListItem => ({
  id: `repo-alice-${name}`,
  owner_id: 'user-alice',
  owner: 'alice',
  name,
  visibility: 'public',
  lease_hours: 8,
  created_at: '2026-10-01T09:00:00Z',
  role: null,
  ...over,
})

export const repos: RepoListItem[] = [
  repo('maps', {
    role: 'owner',
    description: 'Level layouts and blockouts for the castle project.',
    language: 'Unreal',
    topics: ['levels', 'unreal'],
    updated_at: '2026-11-15T09:00:00Z',
  }),
  repo('notes', {
    lease_hours: 4,
    created_at: '2026-10-05T09:00:00Z',
    updated_at: '2026-11-10T09:00:00Z',
  }),
  repo('textures', {
    visibility: 'private',
    role: 'owner',
    description: 'Source art, kept exclusive so nobody overwrites a painting.',
    updated_at: '2026-11-14T09:00:00Z',
  }),
]

export const starred: RepoListItem[] = [
  { ...repo('castle-quest'), owner: 'studio', description: 'A castle crawler.', language: 'Godot' },
  { ...repo('lock-etiquette'), owner: 'bob', topics: ['docs'] },
]

export const readme = {
  name: 'README.md',
  path: 'README.md',
  text: '# Alice Anders\n\nLevel designer. I keep the castle maps tidy.\n\n## Working on\n\n- Castle Quest levels\n- Lock etiquette notes\n',
}

export const people = ['alice', 'bob', 'carol', 'dave', 'erin'].map((user) => ({
  identity: { user, display_name: user[0].toUpperCase() + user.slice(1), avatar_url: null },
}))

export const activity = [
  { id: 3, at: '2026-11-14T10:00:00Z', actor: 'alice', action: 'checkout', path: 'Level01.umap' },
  { id: 2, at: '2026-11-13T09:00:00Z', actor: 'alice', action: 'checkin', path: 'Level01.umap' },
]
