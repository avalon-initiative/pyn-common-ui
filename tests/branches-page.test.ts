import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { PynBranchesPage, availableViews, branchGroups } from '../src'
import { branchesPageBranches as branches } from '../src/stories/branches-page-data'

const now = new Date('2026-11-22T12:00:00Z')
const make = (props: Record<string, unknown> = {}) =>
  mount(PynBranchesPage, { props: { branches, now, ...props }, attachTo: document.body })

describe('branches page state', () => {
  it('offers only the views it can compute', () => {
    expect(availableViews({})).toEqual(['branches', 'all'])
    expect(availableViews({ yours: [], stale: [] })).toEqual(['branches', 'yours', 'stale', 'all'])
  })

  it('puts the default branch alone in its own group', () => {
    const g = branchGroups(branches, 'branches', '', {}, 'main')
    expect(g.map((x) => x.id)).toEqual(['default', 'other'])
    expect(g[0].rows.map((b) => b.name)).toEqual(['main'])
  })

  it('splits yours and active, without repeating a branch', () => {
    const g = branchGroups(
      branches,
      'branches',
      '',
      { yours: ['audio-pass'], active: ['audio-pass', 'level-3-rework'] },
      'main',
    )
    expect(g.map((x) => [x.id, x.rows.map((b) => b.name)])).toEqual([
      ['default', ['main']],
      ['yours', ['audio-pass']],
      ['active', ['level-3-rework']],
    ])
  })

  it('filters by name, case-insensitively', () => {
    const g = branchGroups(branches, 'all', ' LEVEL ', {}, 'main')
    expect(g[0].rows.map((b) => b.name)).toEqual(['level-3-rework'])
  })
})

describe('PynBranchesPage', () => {
  it('shows only Branches and All without server metadata', () => {
    const links = make().findAll('nav a')
    expect(links.map((l) => l.text())).toEqual(['Branches', 'All'])
  })

  it('adds the filter views when their lists are given and marks the open one', () => {
    const w = make({ yours: ['audio-pass'], active: [], stale: [], view: 'yours' })
    expect(w.findAll('nav a').map((l) => l.text())).toEqual([
      'Branches',
      'Yours',
      'Active',
      'Stale',
      'All',
    ])
    expect(w.find('nav a[aria-current=page]').text()).toBe('Yours')
    expect(w.findAll('tbody tr')).toHaveLength(1)
  })

  it('renders columns, the default marker and counts', () => {
    const w = make({ defaultBranch: 'main' })
    expect(w.findAll('th').map((h) => h.text())).toContain('Behind')
    const rows = w.findAll('tbody tr')
    expect(rows[0].text()).toContain('Default')
    expect(rows[1].find('[data-behind]').text()).toBe('1')
    expect(rows[1].find('[data-ahead]').text()).toBe('4')
    expect(rows[1].text()).toContain('2 days ago')
  })

  it('emits newBranch, delete and copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const w = make({ canDelete: true })
    await w.find('button[class*=create]').trigger('click')
    expect(w.emitted('newBranch')).toHaveLength(1)
    await w.find('button[aria-label="Delete branch audio-pass"]').trigger('click')
    expect(w.emitted('delete')).toEqual([['audio-pass']])
    await w.find('button[aria-label="Copy branch name audio-pass"]').trigger('click')
    await new Promise((r) => setTimeout(r))
    expect(writeText).toHaveBeenCalledWith('audio-pass')
    expect(w.emitted('copy')).toEqual([['audio-pass']])
    vi.unstubAllGlobals()
  })

  it('hides delete without permission and never offers it for the default branch', () => {
    expect(make().find('button[aria-label^="Delete branch"]').exists()).toBe(false)
    expect(make({ canDelete: true }).find('button[aria-label="Delete branch main"]').exists()).toBe(
      false,
    )
    expect(make({ canCreate: false }).find('button[class*=create]').exists()).toBe(false)
  })

  it('searches and explains an empty result', async () => {
    const w = make()
    await w.find('input[type=search]').setValue('audio')
    expect(w.findAll('tbody tr').map((r) => r.text())).toHaveLength(1)
    await w.find('input[type=search]').setValue('zzz')
    expect(w.text()).toContain('No matching branches')
  })

  it('shows loading and error states', () => {
    expect(make({ loading: true }).find('[role=status]').exists()).toBe(true)
    expect(make({ error: 'boom' }).find('[role=alert]').text()).toBe('boom')
  })
})
