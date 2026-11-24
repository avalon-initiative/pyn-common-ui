import type { AccessRow } from '../types/team.types'

export const accessRoles = ['reader', 'writer', 'maintainer', 'admin']

export const directRows: AccessRow[] = [
  { kind: 'person', name: 'alice', role: 'admin', source: 'direct' },
  { kind: 'person', name: 'bob', role: 'writer', source: 'direct' },
  { kind: 'team', name: 'artists', role: 'writer', href: '/studio/-/teams/artists' },
  { kind: 'person', name: 'carol', role: 'reader', source: 'direct' },
]

export const orgRows: AccessRow[] = [
  { kind: 'person', name: 'dave', role: 'maintainer', source: 'org_owner' },
  { kind: 'team', name: 'engine', role: 'writer', href: '/studio/-/teams/engine' },
]
