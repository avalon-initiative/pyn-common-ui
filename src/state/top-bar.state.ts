import { pluralize } from '../utils/plural'
import type { MenuItem } from '../types/shell.types'
import type { OwnerOption, TopBarHrefs } from '../types/top-bar.types'

/** Id of the shell's main content, the target of the skip link. */
export const MAIN_ID = 'pyn-main'

export const defaultHrefs = (user?: string): TopBarHrefs => ({
  home: '/',
  profile: user ? `/${user}` : '/',
  settings: '/_/settings',
  admin: '/_/admin',
  people: '/_/people',
  orgs: '/_/orgs',
  repositories: '/_/repos',
  explore: '/_/explore',
  locks: '/_/locks',
  notifications: '/_/invitations',
  newRepo: '/_/new',
  newOrg: '/_/new-org',
})

/** The visible count: nothing at zero, `99+` past 99. */
export function countText(n: number | undefined): string {
  if (!n || n < 1) return ''
  return n > 99 ? '99+' : String(n)
}

export const locksText = (n: number, expiring?: boolean) =>
  `${pluralize(n, 'lock')} held${expiring ? ', one expires soon' : ''}`

export const notificationsText = (n: number | undefined) =>
  n && n > 0 ? pluralize(n, 'notification') : 'Notifications'

/** Owner switcher entries: the person first, then organizations, then create. */
export function ownerItems(owners: OwnerOption[], current: string, newOrg: string): MenuItem[] {
  const entry = (o: OwnerOption): MenuItem => ({
    id: `owner:${o.name}`,
    label: o.name,
    href: o.href ?? `/${o.name}`,
    checked: o.name === current,
  })
  const people = owners.filter((o) => o.kind === 'user')
  const orgs = owners.filter((o) => o.kind === 'org')
  return [
    ...(people.length ? [{ id: 'h-user', label: 'Your account', heading: true }] : []),
    ...people.map(entry),
    ...(orgs.length ? [{ id: 'h-orgs', label: 'Organizations', heading: true }] : []),
    ...orgs.map(entry),
    { id: 'sep-new-org', label: '', separator: true },
    { id: 'new-org', label: 'Create an organization', href: newOrg },
  ]
}

/** Entries with an href the named destinations already show. */
export const withoutNamed = (items: MenuItem[], named: MenuItem[]): MenuItem[] =>
  items.filter((i) => !i.href || !named.some((n) => n.href === i.href))
