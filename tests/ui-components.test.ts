// Component render tests for every exported component. Run with `make test`.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  PynAccountNotice,
  PynBreadcrumb,
  PynButton,
  PynIcon,
  PynLockBadge,
  PynLockIcon,
  PynMenu,
  PynModeChip,
  PynPageNotFound,
  PynRepoNotFound,
  PynResendForm,
  PynSearch,
  matchRepos,
} from '../src'

const now = new Date('2026-10-08T12:00:00Z')
const lock = (owner: string, minutesLeft: number) => ({
  path: 'Content/a.umap',
  owner,
  acquired_at: '2026-10-08T09:00:00Z',
  expires_at: new Date(now.getTime() + minutesLeft * 60_000).toISOString(),
})

describe('PynButton', () => {
  it('renders its label as a button', () => {
    const wrapper = mount(PynButton, { props: { label: 'Check out' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toBe('Check out')
  })

  it('applies the variant class', () => {
    const primary = mount(PynButton, { props: { label: 'a' } })
    const danger = mount(PynButton, { props: { label: 'a', variant: 'danger' } })
    expect(primary.classes().join(' ')).toContain('primary')
    expect(danger.classes().join(' ')).toContain('danger')
  })

  it('honours disabled', () => {
    const wrapper = mount(PynButton, { props: { label: 'a', disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})

describe('PynIcon and PynLockIcon', () => {
  it('draws a known icon and nothing for an unknown name', () => {
    expect(mount(PynIcon, { props: { name: 'repo' } }).find('path').attributes('d')).toBeTruthy()
    expect(mount(PynIcon, { props: { name: 'nope' } }).find('path').attributes('d')).toBe('')
  })

  it('opens the lock shackle', () => {
    expect(mount(PynLockIcon).attributes('data-open')).toBeUndefined()
    expect(mount(PynLockIcon, { props: { open: true } }).attributes('data-open')).toBe('')
  })
})

describe('PynModeChip', () => {
  it('names the mode', () => {
    expect(mount(PynModeChip, { props: { mode: 'shared' } }).text()).toBe('Shared')
    expect(mount(PynModeChip, { props: { mode: 'mixed' } }).text()).toBe('Mixed')
    const w = mount(PynModeChip, { props: { mode: 'exclusive' } })
    expect(w.text()).toBe('Exclusive')
    expect(w.attributes('data-mode')).toBe('exclusive')
  })
})

describe('PynLockBadge', () => {
  it('shows who holds the lock and for how long', () => {
    const w = mount(PynLockBadge, { props: { lock: lock('bob', 222), me: 'alice', now } })
    expect(w.text()).toContain('bob')
    expect(w.text()).toContain('3h 42m')
    expect(w.attributes('data-state')).toBe('locked')
  })

  it('says You for your own lock and Available when unlocked', () => {
    expect(
      mount(PynLockBadge, { props: { lock: lock('alice', 60), me: 'alice', now } }).text(),
    ).toContain('You')
    expect(mount(PynLockBadge, { props: { now } }).text()).toContain('Available')
  })
})

describe('PynMenu', () => {
  it('opens on click, emits a choice and closes', async () => {
    const w = mount(PynMenu, {
      props: { label: 'Theme', items: [{ id: 'dark', label: 'Dark', checked: false }] },
    })
    expect(w.find('[role=menu]').exists()).toBe(false)
    await w.find('button').trigger('click')
    await w.find('[role=menuitemradio]').trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['dark'])
    expect(w.find('[role=menu]').exists()).toBe(false)
  })
})

describe('PynSearch', () => {
  it('matches by substring', () => {
    expect(matchRepos(['alice/game', 'bob/tools'], ' BOB ')).toEqual(['bob/tools'])
    expect(matchRepos(['alice/game'], '')).toEqual([])
  })

  it('opens the matching repository on submit', async () => {
    const w = mount(PynSearch, { props: { options: ['alice/game', 'bob/tools'] } })
    await w.find('input').setValue('bob')
    await w.find('form').trigger('submit')
    expect(w.emitted('open')?.[0]).toEqual(['bob/tools'])
  })

  it('does nothing when nothing matches', async () => {
    const w = mount(PynSearch, { props: { options: ['alice/game'] } })
    await w.find('input').setValue('zzz')
    await w.find('form').trigger('submit')
    expect(w.emitted('open')).toBeUndefined()
  })
})

describe('PynBreadcrumb', () => {
  it('renders a labelled path with the current crumb unlinked', () => {
    const w = mount(PynBreadcrumb, {
      props: { crumbs: [{ label: 'game', href: '/alice/game' }, { label: 'a' }] },
    })
    expect(w.attributes('aria-label')).toBe('Path')
    expect(w.findAll('li')).toHaveLength(2)
    expect(w.findAll('a')).toHaveLength(1)
    expect(w.find('[aria-current=page]').text()).toBe('a')
  })
})

describe('not-found pages', () => {
  it('page not found is an alert', () => {
    expect(mount(PynPageNotFound).find('[role=alert]').text()).toContain('Page not found')
  })

  it('repository not found does not reveal whether it exists', () => {
    const w = mount(PynRepoNotFound, { props: { slug: 'bob/secret' } })
    expect(w.text()).toContain('bob/secret')
    expect(w.text()).toContain('no role')
  })
})

describe('PynAccountNotice', () => {
  it('emits the address to resend to and confirms without revealing the account', async () => {
    const w = mount(PynAccountNotice, { props: { status: 'pending_verification', sent: true } })
    await w.find('input').setValue('w@example.com')
    await w.find('form').trigger('submit')
    expect(w.emitted('resend')?.[0]).toEqual(['w@example.com'])
    expect(w.find('[role=status]').text()).toContain('If that address')
  })

  it.each([
    ['pending_approval', 'Waiting for approval'],
    ['account_disabled', 'Account disabled'],
  ] as const)('shows %s without the resend form and emits back', async (status, title) => {
    const w = mount(PynAccountNotice, { props: { status, user: 'wendy' } })
    expect(w.text()).toContain(title)
    expect(w.text()).toContain('wendy')
    expect(w.find('input').exists()).toBe(false)
    await w.find('button').trigger('click')
    expect(w.emitted('back')).toHaveLength(1)
  })

  it('renders the resend form states', () => {
    const w = mount(PynResendForm, { props: { sent: true, error: 'Too many attempts.' } })
    expect(w.find('[role=status]').exists()).toBe(true)
    expect(w.find('[role=alert]').text()).toContain('Too many')
  })
})
