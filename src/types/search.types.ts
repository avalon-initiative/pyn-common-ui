export type SearchResultKind = 'owner' | 'repository' | 'suggestion'

export interface SearchResult {
  id: string
  kind: SearchResultKind
  label: string
  href: string
  /** Muted text at the end of the row; owners and repositories default to "Jump to". */
  hint?: string
  /** Image of an owner. */
  avatarUrl?: string | null
}

export interface SearchResultGroup {
  kind: SearchResultKind
  title: string
  items: SearchResult[]
}
