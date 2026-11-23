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
