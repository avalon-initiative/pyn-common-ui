import type { SearchResult, SearchResultGroup, SearchResultKind } from '../types/search.types'

const GROUPS: [SearchResultKind, string][] = [
  ['owner', 'Owners'],
  ['repository', 'Repositories'],
  ['suggestion', 'Suggestions'],
]

/** Results in the fixed order Owners, Repositories, Suggestions; empty groups are dropped. */
export const groupSearchResults = (results: SearchResult[]): SearchResultGroup[] =>
  GROUPS.map(([kind, title]) => ({
    kind,
    title,
    items: results.filter((r) => r.kind === kind),
  })).filter((g) => g.items.length > 0)

export const searchHint = (r: SearchResult): string =>
  r.hint ?? (r.kind === 'suggestion' ? '' : 'Jump to')

export const searchResultsText = (count: number): string =>
  count === 0 ? 'No results' : `${count} ${count === 1 ? 'result' : 'results'}`
