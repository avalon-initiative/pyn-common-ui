import { formatDate } from '../utils/datetime'
import type {
  RepositoryAccess,
  TokenExpiryChoice,
  TokenInfo,
  TokenLevel,
  TokenOwnerKind,
  TokenPermission,
  TokenResource,
} from '../types/token.types'

export const TOKEN_RESOURCES: TokenResource[] = [
  {
    resource: 'metadata',
    label: 'Metadata',
    description: 'Repository info and your own role. Always read, required with repository access.',
    scope: 'repository',
    levels: ['read'],
  },
  {
    resource: 'contents',
    label: 'Contents',
    description: 'Clone, fetch and read files and history; write checks in and restores.',
    scope: 'repository',
    levels: ['read', 'write'],
  },
  {
    resource: 'locks',
    label: 'Locks',
    description: 'List locks; write takes and releases your own; admin force-unlocks others.',
    scope: 'repository',
    levels: ['read', 'write', 'admin'],
  },
  {
    resource: 'policy',
    label: 'Policy',
    description: 'Edit the repository rules (.pyn/pyn.toml).',
    scope: 'repository',
    levels: ['write'],
  },
  {
    resource: 'members',
    label: 'Members',
    description: 'List roles; write manages members, teams, invitations and roles.',
    scope: 'repository',
    levels: ['read', 'write'],
  },
  {
    resource: 'administration',
    label: 'Administration',
    description: 'Rename, delete, define roles and read the usage breakdown.',
    scope: 'repository',
    levels: ['read', 'write'],
  },
  {
    resource: 'audit',
    label: 'Audit log',
    description: 'Read the repository audit log.',
    scope: 'repository',
    levels: ['read'],
  },
  {
    resource: 'org_members',
    label: 'Organization members',
    description: 'List members; write also invites, changes roles and removes members.',
    scope: 'org',
    levels: ['read', 'write'],
  },
  {
    resource: 'org_teams',
    label: 'Organization teams',
    description: 'List teams; write creates, edits and deletes teams and their members.',
    scope: 'org',
    levels: ['read', 'write'],
  },
  {
    resource: 'org_administration',
    label: 'Organization administration',
    description: 'Read the creation policy; write edits the profile and policy, or deletes it.',
    scope: 'org',
    levels: ['read', 'write'],
  },
  {
    resource: 'org_audit',
    label: 'Organization audit log',
    description: 'Read the organization audit log.',
    scope: 'org',
    levels: ['read'],
  },
  {
    resource: 'account_profile',
    label: 'Profile',
    description: 'Edit your profile and avatar.',
    scope: 'account',
    levels: ['write'],
  },
  {
    resource: 'account_ssh_keys',
    label: 'SSH keys',
    description: 'List your keys; write adds and removes them.',
    scope: 'account',
    levels: ['read', 'write'],
  },
  {
    resource: 'account_locks',
    label: 'Your locks',
    description: 'List your locks across repositories.',
    scope: 'account',
    levels: ['read'],
  },
]

export const TOKEN_EXPIRY_CHOICES: TokenExpiryChoice[] = [
  { value: '7', label: '7 days', days: 7 },
  { value: '30', label: '30 days', days: 30 },
  { value: '60', label: '60 days', days: 60 },
  { value: '90', label: '90 days', days: 90 },
  { value: 'custom', label: 'Custom' },
  { value: 'never', label: 'No expiration' },
]

export const DEFAULT_EXPIRY = '30'

export const LEVEL_LABELS: Record<TokenLevel, string> = {
  read: 'Read',
  write: 'Read and write',
  admin: 'Admin',
}

/** The resources a token can hold for this owner kind and repository access. */
export function availableResources(
  kind: TokenOwnerKind,
  mode: RepositoryAccess['mode'],
): TokenResource[] {
  return TOKEN_RESOURCES.filter((r) =>
    r.scope === 'repository' ? mode !== 'public' : r.scope === kind,
  )
}

/** Date `days` after `now`, as an ISO instant. */
export function expiryAfter(now: Date, days: number): string {
  return new Date(now.getTime() + days * 86_400_000).toISOString()
}

/** A date input value (`YYYY-MM-DD`) as the end of that day in UTC, or null. */
export function expiryFromDate(date: string): string | null {
  return date ? `${date}T23:59:59Z` : null
}

/** The computed expiry date shown beside a choice, or null for custom and never. */
export function expiryPreview(choice: TokenExpiryChoice, now: Date): string | null {
  return choice.days ? formatDate(expiryAfter(now, choice.days)) : null
}

function isRepositoryResource(resource: string): boolean {
  return TOKEN_RESOURCES.find((r) => r.resource === resource)?.scope === 'repository'
}

/** Chosen levels as permissions; metadata read is added once any repository permission is set. */
export function buildPermissions(
  levels: Record<string, TokenLevel | ''>,
  kind: TokenOwnerKind,
  mode: RepositoryAccess['mode'],
): TokenPermission[] {
  const out: TokenPermission[] = availableResources(kind, mode)
    .filter((r) => r.resource !== 'metadata' && levels[r.resource])
    .map((r) => ({ resource: r.resource, level: levels[r.resource] as TokenLevel }))
  if (out.some((p) => isRepositoryResource(p.resource))) {
    out.unshift({ resource: 'metadata', level: 'read' })
  }
  return out
}

/** Why the form cannot be submitted yet, or null. */
export function tokenFormProblem(f: {
  name: string
  expiry: string
  customDate: string
  now: Date
  mode: RepositoryAccess['mode']
  repos: string[]
  permissions: TokenPermission[]
}): string | null {
  if (!f.name.trim()) return 'Give the token a name.'
  if (f.expiry === 'custom') {
    const at = expiryFromDate(f.customDate)
    if (!at) return 'Pick an expiration date.'
    if (new Date(at) <= f.now) return 'The expiration date must be in the future.'
  }
  if (f.mode === 'selected' && !f.repos.length) return 'Select at least one repository.'
  if (!f.permissions.length) return 'Add at least one permission.'
  return null
}

/** Case-insensitive substring filter for the repository picker. */
export function filterRepos(repos: string[], query: string): string[] {
  const q = query.trim().toLowerCase()
  return q ? repos.filter((r) => r.toLowerCase().includes(q)) : repos
}

export function describeAccess(a: RepositoryAccess): string {
  if (a.mode === 'public') return 'public repositories only'
  if (a.mode === 'all') return 'all repositories'
  const n = a.repos?.length ?? 0
  return `${n} selected ${n === 1 ? 'repository' : 'repositories'}`
}

export function describeGrant(p: TokenPermission): string {
  return `${p.resource}: ${p.level}`
}

export function describeExpiry(t: Pick<TokenInfo, 'expires_at'>): string {
  return t.expires_at ? `expires ${formatDate(t.expires_at)}` : 'never expires'
}
