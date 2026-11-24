import type { ActivityEntry } from './tree.types'

export type RecentKind = 'repository' | 'organization' | 'person' | 'file'

/** An item the browser remembers having opened. */
export interface RecentItem {
  label: string
  href: string
  kind: RecentKind
}

/** A notice that needs the person's attention; `href` is where to act on it. */
export interface AttentionNotice {
  id: string
  text: string
  href?: string
}

/** An entry in the dashboard's instance notices panel. */
export interface InstanceNotice {
  id: string
  title: string
  /** ISO time the notice was posted. */
  at: string
  href?: string
}

/** A repository activity entry; `owner` and `name` identify the repository. */
export interface RepoActivityEntry extends ActivityEntry {
  owner: string
  name: string
}
