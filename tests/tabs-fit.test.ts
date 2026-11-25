import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { PynRepoShell, PynSecurityNotice, PynTabs } from '../src/index'
import { fitTabs } from '../src/state/tabs.state'
import { mockTabWidths } from './tab-observer'

const items = ['A', 'B', 'C', 'D', 'E'].map((label, i) => ({
  label,
  href: `/${label}`,
  current: i === 0,
}))
const widths = [50, 50, 50, 50, 50]

describe('fitTabs', () => {
  it('shows everything that fits', () => {
    expect(fitTabs(items, widths, 300, 60, 8).more).toHaveLength(0)
  })

  it('moves what does not fit into More and keeps the current tab', () => {
    const cur = items.map((t, i) => ({ ...t, current: i === 4 }))
    const r = fitTabs(cur, widths, 240, 60, 8)
    expect(r.shown.map((t) => t.label)).toEqual(['A', 'B', 'E'])
    expect(r.more.map((t) => t.label)).toEqual(['C', 'D'])
  })

  it('never shows fewer than one tab', () => {
    expect(fitTabs(items, widths, 10, 60, 8).shown).toHaveLength(1)
  })
})

describe('PynTabs measurement', () => {
  it('renders every tab without a width, and a hidden probe that is not announced', () => {
    const w = mount(PynTabs, { props: { items, label: 'Repository' } })
    expect(w.findAll('a')).toHaveLength(5)
    expect(w.find('[data-probe]').attributes('aria-hidden')).toBe('true')
    expect(w.find('[data-probe] a').exists()).toBe(false)
  })

  it('shows every tab inline while they fit and moves the rest into More as the bar narrows', async () => {
    const layout = mockTabWidths({ avail: 400, tab: 50, more: 60 })
    const w = mount(PynTabs, { props: { items, label: 'Repository' }, attachTo: document.body })
    await nextTick()
    expect(layout.observers).toHaveLength(1)
    expect(w.findAll('nav > ul > li > a')).toHaveLength(5)
    expect(w.find('[data-more]').exists()).toBe(false)
    layout.resize(200)
    await nextTick()
    expect(w.findAll('nav > ul > li > a').map((a) => a.text())).toEqual(['A', 'B'])
    expect(w.find('[data-more]').exists()).toBe(true)
    layout.resize(400)
    await nextTick()
    expect(w.find('[data-more]').exists()).toBe(false)
    w.unmount()
    layout.restore()
  })
})

describe('PynRepoShell facts', () => {
  const base = { owner: 'studio', name: 'game', visibility: 'private' as const }

  it('shows owner and name as the title and hides it with hidePath', () => {
    const w = mount(PynRepoShell, { props: base })
    expect(w.find('h1').text()).toContain('game')
    const hidden = mount(PynRepoShell, { props: { ...base, hidePath: true } })
    expect(hidden.find('h1').exists()).toBe(false)
    expect(hidden.find('[data-visibility]').exists()).toBe(true)
  })

  it('renders facts as labelled pills with a tooltip', () => {
    const w = mount(PynRepoShell, {
      props: { ...base, facts: [{ label: 'role', value: 'admin', title: 'Your role' }] },
    })
    const fact = w.find('[data-fact]')
    expect(fact.find('span').text()).toBe('role')
    expect(fact.text()).toContain('admin')
    expect(fact.attributes('title')).toBe('Your role')
  })

  it('lets the labels slot replace the pills', () => {
    const w = mount(PynRepoShell, {
      props: { ...base, facts: [{ value: 'x' }] },
      slots: { labels: '<em data-custom>y</em>' },
    })
    expect(w.find('[data-fact]').exists()).toBe(false)
    expect(w.find('[data-custom]').exists()).toBe(true)
  })
})

describe('PynRepoShell hideLockStrip', () => {
  const props = { owner: 'o', name: 'n', visibility: 'private' as const, lockedCount: 2 }

  it('suppresses the strip but keeps the Locks count', () => {
    const tabs = [{ section: 'locks', label: 'Locks' }]
    const w = mount(PynRepoShell, { props: { ...props, tabs, hideLockStrip: true } })
    expect(w.find('[data-lock-strip]').exists()).toBe(false)
    expect(w.find('[data-count]').text()).toBe('2')
    expect(mount(PynRepoShell, { props }).find('[data-lock-strip]').exists()).toBe(true)
  })
})

describe('banner marker', () => {
  it('marks the security notice so the shell can space it', () => {
    const w = mount(PynSecurityNotice, { props: { message: 'm' } })
    expect(w.attributes('data-banner')).toBeDefined()
  })
})
