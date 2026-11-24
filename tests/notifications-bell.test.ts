import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { PynNotificationsBell, PynTopBar } from '../src'
import type { BellEntry } from '../src'

const now = new Date('2026-11-20T12:00:00Z')
const entries: BellEntry[] = [
  { id: 'n1', title: 'Two-factor reset', at: '2026-11-20T09:00:00Z', href: '/_/settings' },
  { id: 'i1', kind: 'invitation', title: 'Join acme', at: '2026-11-19T12:00:00Z' },
]
const mounted: ReturnType<typeof mount>[] = []
const make = (props: Record<string, unknown> = {}) => {
  const w = mount(PynNotificationsBell, { props: { now, ...props }, attachTo: document.body })
  mounted.push(w)
  return w
}
const opened = async (props: Record<string, unknown> = {}) => {
  const w = make(props)
  await w.find('[data-bell]').trigger('click')
  return w
}
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()))

describe('PynNotificationsBell entries', () => {
  it('drives the badge from the entries and ignores count', () => {
    const w = make({ entries, count: 9 })
    expect(w.find('[data-badge]').text()).toBe('2')
    expect(w.find('[data-bell]').text()).toContain('2 notifications')
    expect(make({ entries: [], count: 9 }).find('[data-badge]').exists()).toBe(false)
  })

  it('keeps the count behaviour without entries', () => {
    expect(make({ count: 4 }).find('[data-badge]').text()).toBe('4')
  })

  it('lists entries with time and link, without the Work in progress state or footer', async () => {
    const w = await opened({ entries })
    const items = w.findAll('[data-entry]')
    expect(items).toHaveLength(2)
    expect(items[0]!.find('a').attributes('href')).toBe('/_/settings')
    expect(items[0]!.text()).toContain('3 hours ago')
    expect(items[1]!.find('a').exists()).toBe(false)
    expect(w.text()).not.toContain('Work in progress')
    expect(w.find('[data-pending]').exists()).toBe(false)
  })

  it('shows dismiss on a notice and Accept and Decline on an invitation, and emits ids', async () => {
    const w = await opened({ entries })
    const [notice, invite] = w.findAll('[data-entry]')
    expect(notice!.find('[data-dismiss]').exists()).toBe(true)
    expect(notice!.find('[data-accept]').exists()).toBe(false)
    expect(invite!.find('[data-dismiss]').exists()).toBe(false)
    await notice!.find('[data-dismiss]').trigger('click')
    await invite!.find('[data-accept]').trigger('click')
    await invite!.find('[data-decline]').trigger('click')
    expect(w.emitted('dismiss')).toEqual([['n1']])
    expect(w.emitted('accept')).toEqual([['i1']])
    expect(w.emitted('decline')).toEqual([['i1']])
  })

  it('names the actions by entry and disables a busy invitation', async () => {
    const w = await opened({ entries: [{ ...entries[1]!, busy: true }] })
    expect(w.find('[data-accept]').attributes('aria-label')).toBe('Accept Join acme')
    expect(w.find('[data-accept]').attributes('disabled')).toBeDefined()
    expect(w.find('[data-decline]').attributes('disabled')).toBeDefined()
  })

  it('shows only the Work in progress state when the list is empty', async () => {
    const w = await opened({ entries: [] })
    expect(w.find('[data-entry]').exists()).toBe(false)
    expect(w.text()).toContain('Work in progress')
  })
})

describe('PynNotificationsBell count only', () => {
  it('keeps the Work in progress state and the waiting link without entries', async () => {
    const w = await opened({ count: 3, href: '/_/invitations' })
    expect(w.text()).toContain('Work in progress')
    expect(w.find('[data-pending]').text()).toContain('3 notifications waiting')
  })
})

describe('PynTopBar bell entries', () => {
  it('passes entries to the bell and forwards its events', async () => {
    const w = mount(PynTopBar, {
      props: { user: 'alice', theme: 'system', notificationEntries: entries, now },
      attachTo: document.body,
    })
    mounted.push(w)
    expect(w.find('[data-badge]').text()).toBe('2')
    await w.find('[data-bell]').trigger('click')
    await w.find('[data-accept]').trigger('click')
    await w.find('[data-dismiss]').trigger('click')
    await w.find('[data-decline]').trigger('click')
    expect(w.emitted('acceptNotification')).toEqual([['i1']])
    expect(w.emitted('dismissNotification')).toEqual([['n1']])
    expect(w.emitted('declineNotification')).toEqual([['i1']])
  })
})
