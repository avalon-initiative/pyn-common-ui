import type { BranchListItem } from '../types/branch.types'

const alice = { username: 'alice', name: 'Alice Rivera' }
const bot = { username: 'dependabot' }

export const branchesPageBranches: BranchListItem[] = [
  {
    name: 'main',
    isDefault: true,
    updatedAt: '2026-11-22T10:00:00Z',
    updatedBy: alice,
    href: '/alice/game',
  },
  {
    name: 'level-3-rework',
    ahead: 4,
    behind: 1,
    updatedAt: '2026-11-20T09:00:00Z',
    updatedBy: alice,
    href: '#',
    compareHref: '#',
  },
  {
    name: 'audio-pass',
    ahead: 1,
    behind: 12,
    updatedAt: '2026-10-01T09:00:00Z',
    updatedBy: alice,
    href: '#',
    compareHref: '#',
  },
  {
    name: 'dependabot/npm/vite-5',
    ahead: 1,
    behind: 0,
    updatedAt: '2026-11-22T00:00:00Z',
    updatedBy: bot,
    href: '#',
    compareHref: '#',
  },
  {
    name: 'feature/an-extraordinarily-long-branch-name-that-keeps-going-and-going',
    ahead: 2,
    behind: 3,
    updatedAt: '2026-11-21T09:00:00Z',
    href: '#',
  },
  {
    name: 'old-experiment',
    ahead: 3,
    behind: 1000,
    countsCapped: true,
    updatedAt: '2026-06-01T09:00:00Z',
    updatedBy: alice,
    href: '#',
  },
]
