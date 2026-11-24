import type { FilterListControl } from '../types/filter-list.types'

export interface ListRow {
  id: string
  name: string
  note: string
  kind: string
  updated: number
}

const kinds = ['public', 'private', 'archived']
const names = [
  'game',
  'tools',
  'assets',
  'audio',
  'levels',
  'shaders',
  'docs',
  'website',
  'launcher',
]

export const rows: ListRow[] = Array.from({ length: 74 }, (_, i) => ({
  id: `r${i}`,
  name: `${names[i % names.length]}${i >= names.length ? `-${Math.floor(i / names.length)}` : ''}`,
  note: `Updated ${i + 1} day${i ? 's' : ''} ago`,
  kind: kinds[i % kinds.length]!,
  updated: i,
}))

export const typeControl = (value = 'all'): FilterListControl => ({
  id: 'type',
  label: 'Type',
  value,
  options: [
    { value: 'all', label: 'Type: all' },
    ...kinds.map((k) => ({ value: k, label: `Type: ${k}` })),
  ],
})

export const sortControl = (value = 'updated'): FilterListControl => ({
  id: 'sort',
  label: 'Sort',
  value,
  options: [
    { value: 'updated', label: 'Last updated' },
    { value: 'name', label: 'Name' },
  ],
})
