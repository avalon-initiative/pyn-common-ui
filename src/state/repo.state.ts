export const PERMISSIONS = [
  'read',
  'lock',
  'checkin',
  'restore',
  'force_unlock',
  'edit_policy',
  'manage_users',
  'manage_roles',
  'view_audit',
] as const

export const AUDIT_ACTIONS = [
  'checkout',
  'release',
  'checkin',
  'restore',
  'force_unlock',
  'member_added',
  'role_changed',
  'role_permissions_changed',
  'token_created',
  'token_revoked',
  'repo_created',
  'repo_updated',
  'repo_deleted',
] as const

export const repoSlug = (r: { owner: string; name: string }) => `${r.owner}/${r.name}`

/** The app route of a repository page; `section` is empty for the files page. */
export function repoPath(r: { owner: string; name: string }, section = ''): string {
  const base = `/${encodeURIComponent(r.owner)}/${encodeURIComponent(r.name)}`
  return section ? `${base}/${section}` : base
}

export interface RepoTab {
  section: string
  label: string
}

/** Tabs the viewer may use; the server enforces the same permissions. */
export function repoTabs(permissions: string[], isOwner: boolean): RepoTab[] {
  const has = (p: string) => permissions.includes(p)
  const tabs: RepoTab[] = [
    { section: '', label: 'Code' },
    { section: 'locks', label: 'Locks' },
    { section: 'history', label: 'History' },
  ]
  if (has('view_audit')) tabs.push({ section: 'audit', label: 'Audit' })
  if (has('manage_users')) tabs.push({ section: 'members', label: 'Members' })
  if (has('manage_roles')) tabs.push({ section: 'roles', label: 'Roles' })
  if (has('manage_users')) tabs.push({ section: 'invites', label: 'Invites' })
  if (isOwner && has('manage_roles')) tabs.push({ section: 'settings', label: 'Settings' })
  return tabs
}

export interface RepoShellTab extends RepoTab {
  /** A count shown as a badge beside the label. */
  count?: number
}

/** Settings sub-pages the viewer may open; `settings` is General and the rest live under it. */
export function repoSettingsNav(permissions: string[], isOwner: boolean): RepoTab[] {
  const has = (p: string) => permissions.includes(p)
  const items: RepoTab[] = []
  if (isOwner && has('manage_roles')) items.push({ section: 'settings', label: 'General' })
  if (has('manage_users')) items.push({ section: 'members', label: 'Members' })
  if (has('manage_roles')) items.push({ section: 'roles', label: 'Roles' })
  if (has('manage_users')) items.push({ section: 'invites', label: 'Invitations' })
  if (has('view_audit')) items.push({ section: 'audit', label: 'Audit log' })
  return items
}

/** The repository tab bar; Insights only when its page exists, Settings when any settings page is visible. */
export function repoShellTabs(
  permissions: string[],
  isOwner: boolean,
  options: { insights?: boolean } = {},
): RepoShellTab[] {
  const tabs: RepoShellTab[] = [
    { section: '', label: 'Code' },
    { section: 'locks', label: 'Locks' },
    { section: 'history', label: 'History' },
  ]
  if (options.insights) tabs.push({ section: 'insights', label: 'Insights' })
  if (repoSettingsNav(permissions, isOwner).length > 0) {
    tabs.push({ section: 'settings', label: 'Settings' })
  }
  return tabs
}

/** The route of a settings sub-page; General is `settings` itself. */
export function repoSettingsPath(r: { owner: string; name: string }, section: string): string {
  return repoPath(r, section === 'settings' ? 'settings' : `settings/${section}`)
}

export const MAX_LOCKS_MIN = 1
export const MAX_LOCKS_MAX = 10000

/** A lock-limit input as a number; null when empty, NaN when not a whole number. */
export function parseLockLimit(text: string | number | null): number | null {
  const t = String(text ?? '').trim()
  if (t === '') return null
  return /^\d+$/.test(t) ? Number(t) : NaN
}
