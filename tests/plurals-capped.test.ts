import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  BRANCH_COUNT_CAP,
  PynAccountDelete,
  PynBranchList,
  PynBranchesPage,
  PynDiffStat,
  PynOwnerUsage,
  PynRepoBranches,
  PynRepoDetails,
  PynTeamList,
  branchCount,
  branchCounts,
  pluralWord,
  pluralize,
} from '../src'
import { teams } from '../src/stories/org-data'
import { ownerUsage } from '../src/stories/usage-data'

describe('pluralize', () => {
  it('uses the singular for exactly one and the plural otherwise', () => {
    expect(pluralize(1, 'member')).toBe('1 member')
    expect(pluralize(0, 'member')).toBe('0 members')
    expect(pluralize(2, 'repository', 'repositories')).toBe('2 repositories')
    expect(pluralWord(1, 'person', 'people')).toBe('person')
    expect(pluralWord(3, 'person', 'people')).toBe('people')
  })
})

describe('count labels', () => {
  it('pluralises team members and repositories', () => {
    const one = {
      ...teams[0]!,
      members: ['bob'],
      repos: [{ repo: 'studio/game', role: 'writer' as const }],
    }
    const w = mount(PynTeamList, { props: { org: 'studio', teams: [one, teams[0]!] } })
    expect(w.findAll('[data-members]').map((m) => m.text())).toEqual(['1 member', '2 members'])
    expect(w.findAll('[data-repos]').map((r) => r.text())).toEqual([
      '1 repository',
      '2 repositories',
    ])
  })

  it('pluralises repository files, revisions and lease hours', () => {
    const repo = { ...ownerUsage.repositories[0]!, files: 1, revisions: 1 }
    const usage = mount(PynOwnerUsage, {
      props: { usage: { ...ownerUsage, repositories: [repo] } },
    })
    expect(usage.text()).toContain('1 file · 1 revision')
    const details = mount(PynRepoDetails, {
      props: {
        owner: 'alice',
        visibility: 'public',
        leaseHours: 1,
        createdAt: '2026-11-01T00:00:00Z',
        files: 1,
        exclusiveFiles: 0,
        sharedFiles: 1,
      },
    })
    expect(details.text()).toContain('1 file')
    expect(details.text()).not.toContain('1 files')
    expect(details.text()).toContain('1 hour lease')
  })

  it('pluralises diff stats and recovery days', () => {
    const stat = mount(PynDiffStat, { props: { additions: 1, deletions: 2 } })
    expect(stat.find('span').attributes('title')).toBe('1 addition, 2 deletions')
    const del = mount(PynAccountDelete, { props: { recoveryDays: 1 } })
    expect(del.text()).toContain('after 1 day;')
  })
})

describe('capped branch counts', () => {
  it('reads a count at the cap as "1000+" only when capped', () => {
    expect(branchCount(BRANCH_COUNT_CAP, true)).toBe('1000+')
    expect(branchCount(BRANCH_COUNT_CAP)).toBe('1000')
    expect(branchCount(7, true)).toBe('7')
    expect(branchCounts({ ahead: 1000, behind: 7, countsCapped: true })).toBe(
      '1000+ ahead, 7 behind',
    )
    expect(branchCounts({ ahead: 1000, behind: 7 })).toBe('1000 ahead, 7 behind')
  })

  it('shows "1000+" in the branch list, the branches page and the rail', () => {
    const b = { name: 'rewrite', ahead: 3, behind: 1000, countsCapped: true }
    const list = mount(PynBranchList, { props: { branches: [b] } })
    expect(list.find('[data-ahead-behind]').text()).toBe('3 ahead, 1000+ behind')
    const page = mount(PynBranchesPage, { props: { branches: [b] } })
    expect(page.find('[data-behind]').text()).toBe('1000+')
    expect(page.find('[data-ahead]').text()).toBe('3')
    const rail = mount(PynRepoBranches, { props: { branches: [b] } })
    expect(rail.find('[data-ahead-behind]').text()).toBe('3 ahead, 1000+ behind')
  })
})
