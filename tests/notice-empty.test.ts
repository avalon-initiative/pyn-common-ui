import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PynEmptyState, PynSecurityNotice } from '../src'

describe('PynSecurityNotice', () => {
  const base = { message: 'Add a second factor.', actionLabel: 'Set up', actionHref: '/s' }

  it('renders a status with a hidden label, the message and a link', async () => {
    const w = mount(PynSecurityNotice, { props: base })
    expect(w.attributes('role')).toBe('status')
    expect(w.text()).toContain('Security notice:')
    expect(w.text()).toContain('Add a second factor.')
    const a = w.find('a')
    expect(a.attributes('href')).toBe('/s')
    await a.trigger('click')
    expect(w.emitted('action')).toHaveLength(1)
    expect(w.text()).not.toContain('Required')
  })

  it('marks the required variant with text, the deadline and no dismiss button', () => {
    const w = mount(PynSecurityNotice, {
      props: { ...base, required: true, deadline: 'From 1 Dec', dismissible: true },
    })
    expect(w.text()).toContain('Security requirement:')
    expect(w.text()).toContain('Required')
    expect(w.text()).toContain('From 1 Dec')
    expect(w.find('button[aria-label="Dismiss"]').exists()).toBe(false)
  })

  it('hides the deadline when not required and emits dismiss', async () => {
    const w = mount(PynSecurityNotice, { props: { ...base, deadline: 'x', dismissible: true } })
    expect(w.text()).not.toContain('x ')
    await w.find('button[aria-label="Dismiss"]').trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
  })

  it('uses a button without a link, supports the action slot and the compact class', async () => {
    const w = mount(PynSecurityNotice, {
      props: { message: 'm', actionLabel: 'Go', compact: true },
    })
    expect(w.find('a').exists()).toBe(false)
    await w.find('button').trigger('click')
    expect(w.emitted('action')).toHaveLength(1)
    expect(w.classes().join(' ')).toContain('compact')
    const slotted = mount(PynSecurityNotice, {
      props: base,
      slots: { action: '<a class="custom" href="/x">Custom</a>' },
    })
    expect(slotted.find('.custom').exists()).toBe(true)
    expect(slotted.findAll('a')).toHaveLength(1)
  })
})

describe('PynEmptyState', () => {
  it('renders the title as an h2 by default with a description and no actions', () => {
    const w = mount(PynEmptyState, { props: { title: 'Nothing', description: 'Why.' } })
    expect(w.find('h2').text()).toBe('Nothing')
    expect(w.text()).toContain('Why.')
    expect(w.find('a, button').exists()).toBe(false)
  })

  it('honours the heading level', () => {
    const w = mount(PynEmptyState, { props: { title: 'T', headingLevel: 4 } })
    expect(w.find('h4').exists()).toBe(true)
    expect(w.find('h2').exists()).toBe(false)
  })

  it('renders link actions and emits events on click', async () => {
    const w = mount(PynEmptyState, {
      props: {
        title: 'T',
        primaryLabel: 'New',
        primaryHref: '/new',
        secondaryLabel: 'Guide',
        secondaryHref: '/guide',
      },
    })
    const links = w.findAll('a')
    expect(links.map((l) => l.attributes('href'))).toEqual(['/new', '/guide'])
    await links[0]!.trigger('click')
    await links[1]!.trigger('click')
    expect(w.emitted('primary')).toHaveLength(1)
    expect(w.emitted('secondary')).toHaveLength(1)
  })

  it('renders buttons without hrefs, the icon slot and the compact class', async () => {
    const w = mount(PynEmptyState, {
      props: { title: 'T', primaryLabel: 'Add', secondaryLabel: 'More', compact: true },
      slots: { icon: '<i class="ic" />' },
    })
    const buttons = w.findAll('button')
    expect(buttons).toHaveLength(2)
    await buttons[0]!.trigger('click')
    expect(w.emitted('primary')).toHaveLength(1)
    expect(w.find('.ic').exists()).toBe(true)
    expect(w.find('[aria-hidden="true"] .ic').exists()).toBe(true)
    expect(w.classes().join(' ')).toContain('compact')
  })
})

describe('PynEmptyState kinds', () => {
  it.each([
    ['empty', 'Nothing here yet'],
    ['unsupported', 'Not supported yet'],
    ['wip', 'Work in progress'],
  ] as const)('shows the %s defaults', (kind, title) => {
    const w = mount(PynEmptyState, { props: { kind } })
    expect(w.find('h2').text()).toBe(title)
    expect(w.find('p').text().length).toBeGreaterThan(10)
    expect(w.find('svg').exists()).toBe(true)
    expect(w.find('a, button').exists()).toBe(false)
  })

  it('overrides the title, text and icon', () => {
    const w = mount(PynEmptyState, {
      props: { kind: 'wip', title: 'Tags', description: 'Soon.', icon: 'bell' },
    })
    expect(w.find('h2').text()).toBe('Tags')
    expect(w.find('p').text()).toBe('Soon.')
    expect(w.find('path').exists()).toBe(true)
  })

  it('takes an icon slot over the default and renders an optional action', async () => {
    const w = mount(PynEmptyState, {
      props: { kind: 'empty', primaryLabel: 'Add' },
      slots: { icon: '<i class="mine" />' },
    })
    expect(w.find('.mine').exists()).toBe(true)
    expect(w.find('svg').exists()).toBe(false)
    await w.find('button').trigger('click')
    expect(w.emitted('primary')).toHaveLength(1)
  })

  it('keeps the old behaviour without a kind', () => {
    const w = mount(PynEmptyState, { props: { title: 'Only title' } })
    expect(w.find('h2').text()).toBe('Only title')
    expect(w.find('p').exists()).toBe(false)
    expect(w.find('svg').exists()).toBe(false)
  })
})
