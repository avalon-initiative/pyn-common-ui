import type { AttentionNotice, RecentItem } from '../types/dashboard.types'
import type { MyLock } from '../types/lock.types'
import type { RepoInfo } from '../types/repo.types'
import type { OwnerOption } from '../types/top-bar.types'

export const now = new Date('2026-10-08T12:00:00Z')

export const owners: OwnerOption[] = [
  { name: 'alice', kind: 'user' },
  { name: 'studio', kind: 'org' },
  { name: 'modding-club', kind: 'org' },
]

const repo = (owner: string, name: string, visibility: 'public' | 'private', role: string) =>
  ({
    id: `repo-${owner}-${name}`,
    owner_id: `owner-${owner}`,
    owner,
    name,
    visibility,
    lease_hours: 8,
    created_at: '2026-10-01T09:00:00Z',
    role,
  }) satisfies RepoInfo

export const dashboardRepos: RepoInfo[] = [
  repo('alice', 'castle-quest', 'private', 'owner'),
  repo('studio', 'core-engine', 'private', 'writer'),
  repo('alice', 'notes', 'public', 'owner'),
]

const lock = (name: string, path: string, expires: string): MyLock => ({
  owner: 'alice',
  name,
  path,
  acquired_at: '2026-10-08T09:00:00Z',
  expires_at: expires,
})

export const heldLocks: MyLock[] = [
  lock('castle-quest', 'Content/Maps/Main.umap', '2026-10-08T15:42:00Z'),
  lock('castle-quest', 'Content/Art/Hero.psd', '2026-10-08T12:20:00Z'),
  lock('core-engine', 'Config/DefaultGame.ini', '2026-10-08T18:00:00Z'),
]

export const manyLocks: MyLock[] = Array.from({ length: 8 }, (_, i) =>
  lock('castle-quest', `Content/Art/Prop${i}.psd`, `2026-10-08T${14 + i}:00:00Z`),
)

export const notices: AttentionNotice[] = [
  { id: 'n1', text: 'Your repository storage is nearly full.', href: '/alice/-/usage' },
  { id: 'n2', text: 'Confirm your email address.' },
]

export const recent: RecentItem[] = [
  { label: 'alice/castle-quest', href: '/alice/castle-quest', kind: 'repository' },
  { label: 'studio', href: '/studio', kind: 'organization' },
  {
    label: 'Config/DefaultGame.ini',
    href: '/studio/core-engine/blob/Config/DefaultGame.ini',
    kind: 'file',
  },
]
