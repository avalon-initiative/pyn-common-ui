import type { BranchOption } from '../types/branch.types'
import type { TagItem } from '../types/tag.types'

export const tagsPageTags: TagItem[] = [
  {
    name: 'v0.2.0',
    commit: 'd7d76b0c41e2a9f3b5c8e1d2f4a6b8c0e2f4a6b8',
    message: 'Second playable build: level 3 and the new audio pass.',
    createdAt: '2026-11-20T09:00:00Z',
    createdBy: 'alice',
    creator: { name: 'Alice Rivera' },
    committedAt: '2026-11-19T17:30:00Z',
    href: '#',
    commitHref: '#',
  },
  {
    name: 'v0.1.1',
    commit: 'fac51e6a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e',
    message: null,
    createdAt: '2026-10-02T12:00:00Z',
    createdBy: 'bob',
    href: '#',
    commitHref: '#',
  },
  {
    name: 'release/first-playable-milestone-with-a-very-long-tag-name',
    commit: '0a1b2c3d4e5f60718293a4b5c6d7e8f901234567',
    message: 'First playable.\nShown at the October review.',
    createdAt: '2026-09-28T08:00:00Z',
    createdBy: 'alice',
    creator: { name: 'Alice Rivera' },
  },
]

export const tagsPageBranches: BranchOption[] = [
  { name: 'main', isDefault: true },
  { name: 'level-3-rework' },
  { name: 'audio-pass' },
]
