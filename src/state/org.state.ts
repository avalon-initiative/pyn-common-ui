import type { OrgRole } from '../types/org.types'

/** The app route of an organization page; `section` is empty for the profile. */
export function orgPath(name: string, section = ''): string {
  const base = `/${encodeURIComponent(name)}`
  return section ? `${base}/-/${section}` : base
}

export interface OrgTab {
  section: string
  label: string
}

/** Tabs the viewer may use; the server enforces the same rules. */
export function orgTabs(role: OrgRole | null | undefined): OrgTab[] {
  const tabs: OrgTab[] = [{ section: '', label: 'Repositories' }]
  if (role)
    tabs.push({ section: 'members', label: 'Members' }, { section: 'teams', label: 'Teams' })
  if (role === 'owner')
    tabs.push({ section: 'audit', label: 'Audit' }, { section: 'settings', label: 'Settings' })
  return tabs
}
