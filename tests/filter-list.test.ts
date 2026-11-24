// Tests for the filter bar and bordered list pattern.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PynFilterList, pageCount, pageWindow, rangeText, rowCountText } from '../src'

const controls = [
  {
    id: 'type',
    label: 'Type',
    value: 'all',
    options: [
      { value: 'all', label: 'All' },
      { value: 'public', label: 'Public' },
    ],
  },
]
const rows = '<li>one</li><li>two</li>'

describe('list helpers', () => {
  it('counts pages, ranges and names', () => {
    expect(pageCount(0, 10)).toBe(1)
    expect(pageCount(21, 10)).toBe(3)
    expect(rangeText(0, 1, 10)).toBe('0 of 0')
    expect(rangeText(75, 3, 30)).toBe('61–75 of 75')
    expect(rowCountText(1, 'team')).toBe('1 team')
    expect(rowCountText(75, 'repository', 'repositories')).toBe('75 repositories')
  })

  it('windows page numbers with gaps', () => {
    expect(pageWindow(1, 3)).toEqual([1, 2, 3])
    expect(pageWindow(1, 10)).toEqual([1, 2, null, 10])
    expect(pageWindow(5, 10)).toEqual([1, null, 4, 5, 6, null, 10])
    expect(pageWindow(10, 10)).toEqual([1, null, 9, 10])
  })
})

describe('PynFilterList', () => {
  it('renders the count header, rows slot and extra slots', () => {
    const w = mount(PynFilterList, {
      props: { count: 2, noun: 'team', searchLabel: 'Find a team', controls },
      slots: { default: rows, actions: '<button>New</button>', header: '<span>Sort</span>' },
    })
    expect(w.find('[data-count]').text()).toContain('2 teams')
    expect(w.find('[data-count]').text()).toContain('Sort')
    expect(w.findAll('ul > li')).toHaveLength(2)
    expect(w.find('input[type=search]').attributes('aria-label')).toBe('Find a team')
    expect(w.find('button').text()).toBe('New')
    expect(w.find('nav[aria-label=Pagination]').exists()).toBe(false)
  })

  it('puts the count, selects and search in one row under the tabs with bar inside', () => {
    const w = mount(PynFilterList, {
      props: { count: 2, noun: 'team', controls, bar: 'inside' },
      slots: { default: rows, tabs: '<button data-tab>Direct</button>' },
    })
    const box = w.find('section')
    const kids = box.findAll(':scope > *').map((e) => e.classes()[0])
    expect(kids).toHaveLength(3)
    expect(box.find(':scope > div:first-child [data-tab]').exists()).toBe(true)
    const bar = w.find('[data-count]')
    expect(bar.text()).toContain('2 teams')
    expect(bar.find('select').exists()).toBe(true)
    expect(bar.find('input[type=search]').exists()).toBe(true)
    expect(w.findAll('[data-count]')).toHaveLength(1)
  })

  it('keeps the tabs slot out of the above bar', () => {
    const w = mount(PynFilterList, {
      props: { count: 2 },
      slots: { default: rows, tabs: '<button data-tab>Direct</button>' },
    })
    expect(w.find('[data-tab]').exists()).toBe(false)
  })

  it('emits query, control and page changes', async () => {
    const w = mount(PynFilterList, {
      props: { count: 90, pageSize: 30, page: 2, controls },
      slots: { default: rows },
    })
    await w.find('input').setValue('ga')
    expect(w.emitted('update:query')?.[0]).toEqual(['ga'])
    await w.find('select').setValue('public')
    expect(w.emitted('control')?.[0]).toEqual(['type', 'public'])
    expect(w.find('[data-range]').text()).toBe('31–60 of 90')
    await w.find('[data-next]').trigger('click')
    expect(w.emitted('update:page')?.[0]).toEqual([3])
    await w.find('[data-prev]').trigger('click')
    expect(w.emitted('update:page')?.[1]).toEqual([1])
    await w.find('[aria-label="Page 2"]').trigger('click')
    expect(w.emitted('update:page')).toHaveLength(2)
    expect(w.find('[aria-current=page]').text()).toBe('2')
  })

  it('disables Previous on the first page and Next on the last', () => {
    const first = mount(PynFilterList, {
      props: { count: 90, pageSize: 30 },
      slots: { default: rows },
    })
    expect(first.find('[data-prev]').attributes('disabled')).toBeDefined()
    const last = mount(PynFilterList, {
      props: { count: 90, pageSize: 30, page: 3 },
      slots: { default: rows },
    })
    expect(last.find('[data-next]').attributes('disabled')).toBeDefined()
  })

  it('uses the shared empty states', () => {
    const empty = mount(PynFilterList, {
      props: { count: 0, emptyTitle: 'No teams yet', emptyDescription: 'Create one.' },
    })
    expect(empty.find('h2').text()).toBe('No teams yet')
    expect(empty.find('ul').exists()).toBe(false)
    const unsupported = mount(PynFilterList, { props: { count: 0, emptyKind: 'unsupported' } })
    expect(unsupported.find('h2').text()).toBe('Not supported yet')
    const none = mount(PynFilterList, { props: { count: 0, query: 'zzz' } })
    expect(none.find('[data-no-match]').exists()).toBe(true)
    expect(none.find('h2').text()).toBe('No matches')
    const forced = mount(PynFilterList, { props: { count: 0, filtered: true } })
    expect(forced.find('[data-no-match]').exists()).toBe(true)
    const custom = mount(PynFilterList, { props: { count: 0 }, slots: { empty: '<p>mine</p>' } })
    expect(custom.text()).toContain('mine')
  })

  it('shows loading and error in place of the rows and footer', () => {
    const loading = mount(PynFilterList, {
      props: { count: 90, pageSize: 30, loading: true },
      slots: { default: rows },
    })
    expect(loading.find('[role=status]').exists()).toBe(true)
    expect(loading.find('li').exists()).toBe(false)
    expect(loading.find('nav').exists()).toBe(false)
    const error = mount(PynFilterList, { props: { count: 0, error: 'Boom' } })
    expect(error.find('[role=alert]').text()).toBe('Boom')
  })
})
