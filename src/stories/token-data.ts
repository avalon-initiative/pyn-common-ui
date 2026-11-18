import type { TokenInfo, TokenOwnerOption } from '../types/token.types'

export const tokenOwners: TokenOwnerOption[] = [
  { name: 'alice', kind: 'account' },
  { name: 'acme', kind: 'org' },
]

export const tokenRepos = ['acme/game', 'acme/tools', 'acme/website', 'acme/docs', 'acme/assets']

export const tokenNow = '2026-11-18T12:00:00Z'

export const tokenList: TokenInfo[] = [
  {
    id: 'aaaaaaaaaaaa',
    user: 'alice',
    name: 'ci',
    description: 'Build agents',
    owner: 'acme',
    repository_access: { mode: 'selected', repos: ['acme/game'] },
    permissions: [
      { resource: 'metadata', level: 'read' },
      { resource: 'contents', level: 'write' },
      { resource: 'locks', level: 'write' },
    ],
    sign_in: false,
    created_at: '2026-10-08T09:00:00Z',
    expires_at: '2027-01-01T00:00:00Z',
    last_used_at: '2026-10-09T14:30:00Z',
  },
  {
    id: 'bbbbbbbbbbbb',
    user: 'alice',
    name: 'old script',
    owner: 'alice',
    repository_access: { mode: 'all' },
    permissions: [{ resource: 'account_ssh_keys', level: 'read' }],
    sign_in: false,
    created_at: '2026-09-01T09:00:00Z',
    revoked_at: '2026-10-01T09:00:00Z',
  },
]
