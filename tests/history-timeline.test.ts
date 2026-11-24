import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PynHistory } from '../src'
import { groupByDay } from '../src/state/history.state'

const rev = (id: number, created_at: string, author = 'alice') => ({
  id,
  path: `f${id}.ts`,
  author,
  message: `m${id}`,
  created_at,
})
const revs = [
  rev(4, '2026-10-08T14:00:00Z'),
  rev(3, '2026-10-08T10:00:00Z', 'bob'),
  rev(2, '2026-10-06T12:00:00Z'),
  rev(1, '2026-10-08T12:00:00Z'),
]
const now = new Date('2026-10-09T12:00:00Z')
const branches = [{ name: 'main', isDefault: true }, { name: 'dev' }]

afterEach(() => vi.restoreAllMocks())

describe('groupByDay', () => {
  it('groups consecutive revisions by calendar day, keeping order', () => {
    const days = groupByDay(revs)
    expect(days.map((d) => d.revisions.map((r) => r.id))).toEqual([[4, 3], [2], [1]])
    expect(days[0]!.day).toBe('Oct 08 2026')
    expect(groupByDay([])).toEqual([])
  })
})

describe('PynHistory timeline', () => {
  it('renders a heading per day with a bordered list of rows', () => {
    const w = mount(PynHistory, { props: { revisions: revs, now } })
    expect(w.findAll('h3').map((h) => h.text())).toEqual([
      'Changes on Oct 08 2026',
      'Changes on Oct 06 2026',
      'Changes on Oct 08 2026',
    ])
    expect(w.findAll('li')).toHaveLength(4)
    expect(w.text()).toContain('r4')
  })

  it('shows the title and toolbar only when given', async () => {
    const plain = mount(PynHistory, { props: { revisions: revs } })
    expect(plain.find('h2').exists()).toBe(false)
    expect(plain.find('select').exists()).toBe(false)
    const w = mount(PynHistory, {
      props: {
        revisions: revs,
        title: 'History',
        branch: 'main',
        branches,
        users: ['alice', 'bob'],
        user: '',
        range: 'all',
      },
    })
    expect(w.find('h2').text()).toBe('History')
    expect(w.find('button[aria-haspopup=listbox]').text()).toContain('main')
    const [users, range] = w.findAll('select')
    await users!.setValue('bob')
    await range!.setValue('week')
    expect(w.emitted('selectUser')).toEqual([['bob']])
    expect(w.emitted('selectRange')).toEqual([['week']])
    expect(users!.findAll('option').map((o) => o.text())).toEqual(['All users', 'alice', 'bob'])
  })

  it('emits selectBranch from the picker', async () => {
    const w = mount(PynHistory, { props: { revisions: revs, branch: 'main', branches } })
    await w.find('button[aria-haspopup=listbox]').trigger('click')
    await w.findAll('[role=option]')[1]!.trigger('click')
    expect(w.emitted('selectBranch')).toEqual([['dev']])
  })

  it('copies the short revision and links to browse at it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const w = mount(PynHistory, {
      props: { revisions: [revs[0]!], browseHref: (r: { id: number }) => `/o/n?rev=${r.id}` },
    })
    await w.find('button[aria-label="Copy r4"]').trigger('click')
    await vi.waitFor(() => expect(w.emitted('copy')).toHaveLength(1))
    expect(writeText).toHaveBeenCalledWith('r4')
    expect(w.find('a[aria-label^="Browse"]').attributes('href')).toBe('/o/n?rev=4')
    const bare = mount(PynHistory, { props: { revisions: [revs[0]!] } })
    expect(bare.find('a[aria-label^="Browse"]').exists()).toBe(false)
    vi.unstubAllGlobals()
  })

  it('shows a Verified badge only for the listed revisions', () => {
    const w = mount(PynHistory, { props: { revisions: revs, verified: [3] } })
    const badges = w.findAll('[data-verified]')
    expect(badges).toHaveLength(1)
    expect(badges[0]!.element.closest('li')!.textContent).toContain('r3')
    expect(
      mount(PynHistory, { props: { revisions: revs } })
        .find('[data-verified]')
        .exists(),
    ).toBe(false)
  })
})
