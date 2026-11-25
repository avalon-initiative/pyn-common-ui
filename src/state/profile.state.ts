import { orgPath } from './org.state'
import type { TabItem } from '../types/tabs.types'

/** Up to two uppercase initials: first and last word of the name; "?" when empty. */
export function initials(name: string): string {
  const words = name
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
  if (!words.length) return '?'
  const first = Array.from(words[0])[0]
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : ''
  return (first + last).toUpperCase()
}

/** The link without its scheme and trailing slash, for display. */
export function linkLabel(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

export function isWebLink(url: string): boolean {
  return /^https?:\/\/\S+$/i.test(url)
}

export type ProfileView = '' | 'repositories' | 'stars' | 'usage'

/** Profile tabs; Stars shows when `stars` is given (null: no count), Usage only on the viewer's own profile. */
export function profileTabs(
  user: string,
  o: { current?: ProfileView; repos?: number; stars?: number | null; self?: boolean } = {},
): TabItem[] {
  const tab = (section: ProfileView, label: string, icon: string, count?: number): TabItem => ({
    label,
    icon,
    count,
    href: orgPath(user, section),
    current: section === (o.current ?? ''),
  })
  const tabs = [tab('', 'Overview', 'book'), tab('repositories', 'Repositories', 'repo', o.repos)]
  if (o.stars !== undefined) tabs.push(tab('stars', 'Stars', 'star', o.stars ?? undefined))
  if (o.self) tabs.push(tab('usage', 'Usage', 'insights'))
  return tabs
}
