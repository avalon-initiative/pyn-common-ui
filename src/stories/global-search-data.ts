import type { SearchResult } from '../types/search.types'

export const searchResults: SearchResult[] = [
  { id: 'o1', kind: 'owner', label: 'studio', href: '/studio' },
  { id: 'o2', kind: 'owner', label: 'alice', href: '/alice' },
  { id: 'r1', kind: 'repository', label: 'studio/core-engine', href: '/studio/core-engine' },
  { id: 'r2', kind: 'repository', label: 'alice/castle-quest', href: '/alice/castle-quest' },
  {
    id: 's1',
    kind: 'suggestion',
    label: 'Search all repositories for "co"',
    href: '/_/explore?q=co',
    hint: 'Explore',
  },
]
