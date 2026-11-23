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
