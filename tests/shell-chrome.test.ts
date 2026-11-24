import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { PynCommandPalette, PynDialog, PynDrawer, PynMenu, PynTopBar } from '../src/index'

const items = [
  { id: 'a', label: 'One', href: '#/one' },
  { id: 'sep', label: '', separator: true },
  { id: 'b', label: 'Two' },
]

describe('PynMenu chrome', () => {
  it('renders the footer slot inside the open menu only', async () => {
    const w = mount(PynMenu, {
      props: { label: 'Account', items },
      slots: { footer: '<span data-foot>Footer</span>' },
      attachTo: document.body,
    })
    expect(w.find('[data-foot]').exists()).toBe(false)
    await w.find('button').trigger('click')
    expect(w.find('[role=menu] [data-foot]').exists()).toBe(true)
    w.unmount()
  })

  it('moves focus with the arrow keys and closes on Escape back to the trigger', async () => {
    const w = mount(PynMenu, { props: { label: 'Account', items }, attachTo: document.body })
    await w.find('button').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const entries = w.findAll('[role^=menuitem]')
    expect(document.activeElement).toBe(entries[0].element)
    await w.find('[role=menu]').trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(entries[1].element)
    await w.find('[role=menu]').trigger('keydown', { key: 'Escape' })
    expect(w.find('[role=menu]').exists()).toBe(false)
    expect(document.activeElement).toBe(w.find('button').element)
    w.unmount()
  })
})

describe('PynCommandPalette chrome', () => {
  it('shows the keyboard hint footer hidden from assistive technology', () => {
    const w = mount(PynCommandPalette, {
      props: { open: true, label: 'Palette', items: [{ id: 'a', label: 'A', group: 'G' }] },
      attachTo: document.body,
    })
    const foot = w.find('[data-footer]')
    expect(foot.attributes('aria-hidden')).toBe('true')
    expect(foot.text()).toContain('esc')
    w.unmount()
  })
})

describe('PynDrawer chrome', () => {
  it('closes with an icon-only labelled button', async () => {
    const w = mount(PynDrawer, { props: { open: true, title: 'T' }, attachTo: document.body })
    const close = w.find('button[aria-label="Close"]')
    expect(close.find('svg').exists()).toBe(true)
    await close.trigger('click')
    expect(w.emitted('close')).toHaveLength(1)
    w.unmount()
  })
})

describe('PynTopBar account header', () => {
  it('names the signed-in person in the menu header', async () => {
    const w = mount(PynTopBar, {
      props: { user: 'alice', displayName: 'Alice Anders', theme: 'system' },
      attachTo: document.body,
    })
    await w.find('button[aria-label="Account menu"]').trigger('click')
    expect(w.find('[role=menu] strong').text()).toBe('Alice Anders (alice)')
    expect(w.find('[role=menu]').text()).toContain('Signed in as')
    w.unmount()
  })
})

describe('PynDialog', () => {
  const open = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
    mount(PynDialog, {
      props: { open: true, title: 'Delete branch', ...props },
      slots: { default: '<p>Body</p>', ...slots },
      attachTo: document.body,
    })

  it('is a labelled modal with a close button and an optional footer', async () => {
    const w = open({}, { footer: '<button>Delete</button>' })
    const dialog = w.get('[role="dialog"]')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-labelledby')).toBe(w.get('h2').attributes('id'))
    expect(w.get('h2').text()).toBe('Delete branch')
    expect(w.get('footer').text()).toBe('Delete')
    await w.get('button[aria-label="Close"]').trigger('click')
    expect(w.emitted('close')).toHaveLength(1)
    w.unmount()
    const bare = open()
    expect(bare.find('footer').exists()).toBe(false)
    bare.unmount()
  })

  it('sizes the panel and closes on Escape and the backdrop', async () => {
    const w = open({ size: 'sm' })
    expect(w.get('[role="dialog"]').classes().join(' ')).toMatch(/sm/)
    await w.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    await w.get('[data-test="backdrop"]').trigger('click')
    expect(w.emitted('close')).toHaveLength(2)
    w.unmount()
  })

  it('locks page scroll while open and restores it', async () => {
    const w = open()
    expect(document.body.style.overflow).toBe('hidden')
    await w.setProps({ open: false })
    expect(document.body.style.overflow).not.toBe('hidden')
    w.unmount()
  })
})

describe('PynTopBar navigation drawer and bell', () => {
  const bar = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
    mount(PynTopBar, {
      props: { user: 'alice', theme: 'system', ...props },
      slots,
      attachTo: document.body,
    })

  it('opens the drawer from the hamburger on every width and closes it after a link', async () => {
    const w = bar({}, { drawer: '<p data-extra>Extra</p>' })
    expect(w.find('[role=dialog]').exists()).toBe(false)
    await w.find('button[aria-label="Open navigation"]').trigger('click')
    const nav = w.find('nav[aria-label="Main"]')
    expect(nav.text()).toContain('Dashboard')
    expect(nav.text()).toContain('Organizations')
    expect(w.find('[data-extra]').exists()).toBe(true)
    await nav.find('a').trigger('click')
    expect(w.find('[role=dialog]').exists()).toBe(false)
    w.unmount()
  })

  it('emits from drawer buttons and closes', async () => {
    const w = bar()
    await w.find('button[aria-label="Open navigation"]').trigger('click')
    const shortcuts = w.findAll('nav button').find((b) => b.text().includes('Keyboard shortcuts'))!
    await shortcuts.trigger('click')
    expect(w.emitted('shortcuts')).toHaveLength(1)
    expect(w.find('[role=dialog]').exists()).toBe(false)
    w.unmount()
  })

  it('groups the account menu and keeps sign out last', async () => {
    const w = bar({ admin: true })
    await w.find('button[aria-label="Account menu"]').trigger('click')
    const labels = w.findAll('[role=menu] [role^=menuitem]').map((e) => e.text())
    expect(labels.slice(0, 4)).toEqual(['Profile', 'Repositories', 'Organizations', 'People'])
    expect(labels).toContain('Settings')
    expect(labels).toContain('Server administration')
    expect(labels.at(-1)).toBe('Sign out')
    expect(w.findAll('[role=menu] hr').length).toBeGreaterThanOrEqual(3)
    w.unmount()
  })

  it('shows owner and repository in the bar', () => {
    const w = bar({ currentOwner: 'studio', repo: 'castle' })
    expect(w.find('[data-owner]').text()).toBe('studio')
    expect(w.find('[data-repo]').attributes('href')).toBe('/studio/castle')
    w.unmount()
  })

  it('keeps the bell with a work-in-progress panel and a count badge', async () => {
    const w = bar({ notifications: 3 })
    expect(w.find('[data-badge]').text()).toBe('3')
    await w.find('button[data-bell]').trigger('click')
    const panel = w.find('[aria-label="Notifications"]')
    expect(panel.text()).toContain('Work in progress')
    expect(panel.find('[data-pending]').attributes('href')).toBe('/_/invitations')
    await panel.trigger('keydown', { key: 'Escape' })
    await document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(w.find('[aria-label="Notifications"]').exists()).toBe(false)
    w.unmount()
    const zero = bar({ notifications: 0 })
    expect(zero.find('button[data-bell]').exists()).toBe(true)
    expect(zero.find('[data-badge]').exists()).toBe(false)
    zero.unmount()
  })

  it('starts the drawer from the start side', async () => {
    const w = mount(PynDrawer, {
      props: { open: true, title: 'T', side: 'start' },
      attachTo: document.body,
    })
    expect(w.find('[role=dialog]').element.parentElement!.className).toMatch(/start/)
    w.unmount()
  })
})
