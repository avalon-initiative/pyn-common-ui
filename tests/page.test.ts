// Render tests for the page layout components. Run with `make test`.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PynPage, PynPageColumns, PynProfileLayout, PynRepoLanding, PynShell } from '../src'
import { activity, orgs, repos } from '../src/stories/profile-data'

describe('PynPage', () => {
  it('renders its slot and marks wide', () => {
    const w = mount(PynPage, { slots: { default: '<p id="x">hi</p>' } })
    expect(w.find('#x').exists()).toBe(true)
    expect(w.attributes('data-wide')).toBeUndefined()
    expect(mount(PynPage, { props: { wide: true } }).attributes('data-wide')).toBe('true')
  })
})

describe('PynPageColumns', () => {
  it('renders main and a labelled side landmark', () => {
    const w = mount(PynPageColumns, {
      props: { sideLabel: 'Summary' },
      slots: { default: '<p id="m">main</p>', side: '<p id="s">side</p>' },
    })
    expect(w.find('#m').exists()).toBe(true)
    const aside = w.find('aside')
    expect(aside.attributes('aria-label')).toBe('Summary')
    expect(aside.find('#s').exists()).toBe(true)
    expect(aside.classes().length).toBe(2)
  })

  it('drops sticky when off and the aside without a side slot', () => {
    const slots = { default: 'main', side: 'side' }
    const off = mount(PynPageColumns, { props: { sticky: false }, slots })
    expect(off.find('aside').classes().length).toBe(1)
    const single = mount(PynPageColumns, { slots: { default: 'main' } })
    expect(single.find('aside').exists()).toBe(false)
  })
})

describe('PynShell', () => {
  it('wraps content in a page container and honors wide', () => {
    const w = mount(PynShell, { slots: { default: '<p id="c">c</p>' } })
    expect(w.find('main #c').exists()).toBe(true)
    expect(w.find('main').findComponent(PynPage).props('wide')).toBeFalsy()
    const wide = mount(PynShell, { props: { wide: true }, slots: { default: 'c' } })
    expect(wide.findComponent(PynPage).props('wide')).toBe(true)
  })
})

describe('layouts on PynPageColumns', () => {
  it('profile layout puts organizations and activity in the side column', () => {
    const w = mount(PynProfileLayout, { props: { repos, orgs, activityEntries: activity } })
    expect(w.findComponent(PynPageColumns).find('aside').exists()).toBe(true)
  })

  it('repository landing has no side column without a summary', () => {
    const w = mount(PynRepoLanding, {
      props: {
        repo: {
          owner: 'a',
          name: 'b',
          visibility: 'private',
          lease_hours: 8,
          created_at: '2026-01-01T00:00:00Z',
        } as never,
        path: '',
      },
    })
    expect(w.find('[aria-label="Repository summary"]').exists()).toBe(false)
  })
})
