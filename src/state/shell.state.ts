export interface NavItem {
  id: string
  label: string
  href: string
  icon?: string
  /** A count shown beside the label; hidden when 0 or empty. */
  badge?: number | string
}

export const mainNav: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: 'home' },
  { id: 'locks', label: 'Your locks', href: '/_/locks', icon: 'lock' },
  { id: 'orgs', label: 'Organizations', href: '/_/orgs', icon: 'user' },
]

const adminNav: NavItem = {
  id: 'admin',
  label: 'Server administration',
  href: '/_/admin',
  icon: 'user',
}

/** The sidebar items; server administration shows only for administrators. */
export const navItems = (admin: boolean): NavItem[] => (admin ? [...mainNav, adminNav] : mainNav)

export const accountNav = [
  { id: 'password', label: 'Password', href: '/_/settings/password' },
  { id: 'keys', label: 'SSH keys', href: '/_/settings/keys' },
  { id: 'tokens', label: 'Access tokens', href: '/_/settings/tokens' },
]

/** The administration pages; add an item only when its page exists. */
export const adminNavItems = () => [
  { id: 'accounts', label: 'Accounts', href: '/_/admin/accounts' },
  { id: 'audit', label: 'Audit log', href: '/_/admin/audit' },
  { id: 'webhooks', label: 'Webhooks', href: '/_/admin/webhooks' },
]

const identitiesNav = {
  id: 'identities',
  label: 'Linked sign-in',
  href: '/_/settings/identities',
}

/** The settings pages; linked sign-in shows only when the server offers a provider. */
export const accountNavItems = (hasProvider: boolean) =>
  hasProvider ? [...accountNav, identitiesNav] : accountNav

/** Which repositories match what the user typed, by owner/name substring. */
export function matchRepos(slugs: string[], query: string): string[] {
  const q = query.trim().toLowerCase()
  return q ? slugs.filter((s) => s.toLowerCase().includes(q)) : []
}
