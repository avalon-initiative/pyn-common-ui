// Tests for the shared tab bar, settings layout, lock strip, branches panel and no-email note.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  NO_EMAIL_NOTE,
  PynAccountNotice,
  PynAccountSettings,
  PynAdminLayout,
  PynBranchBar,
  PynOrgHeader,
  PynOrgSettingsLayout,
  PynRepoBranches,
  PynRepoLanding,
  PynRepoSettings,
  PynRepoShell,
  PynSettingsLayout,
  PynSignIn,
  PynTabs,
  groupSections,
  orgSettingsNav,
  orgSettingsPath,
  railBranches,
} from '../src'
import { mockTabWidths } from './tab-observer'
import { repo, rootListing, summary } from '../src/stories/landing-data'

const items = ['Code', 'Locks', 'History', 'Audit', 'Settings'].map((label, i) => ({
  label,
  href: `/a/b/${i}`,
  current: label === 'Code',
}))

describe('PynTabs', () => {
  it('renders anchors, marks the current tab and gives a count hidden text', () => {
    const w = mount(PynTabs, {
      props: {
        label: 'Repository',
        items: [
          { label: 'Code', href: '/a', current: true },
          { label: 'Locks', href: '/b', count: 3, countLabel: '3 locked' },
          { label: 'Audit', href: '/c', count: 1 },
        ],
      },
    })
    expect(w.find('nav').attributes('aria-label')).toBe('Repository')
    expect(w.findAll('a').map((a) => a.attributes('href'))).toEqual(['/a', '/b', '/c'])
    expect(w.findAll('[aria-current=page]')).toHaveLength(1)
    const locks = w.findAll('a')[1]!
    expect(locks.find('[data-count]').attributes('aria-hidden')).toBe('true')
    expect(locks.text()).toContain('3 locked')
    expect(w.findAll('a')[2]!.text()).toContain('1 item')
    expect(w.find('[data-more]').exists()).toBe(false)
  })

  it('opens the More menu with aria state and closes on Escape and outside click', async () => {
    const layout = mockTabWidths({ avail: 260, tab: 60, more: 60 })
    const w = mount(PynTabs, {
      props: { label: 'Repository', items },
      attachTo: document.body,
    })
    await w.vm.$nextTick()
    expect(w.findAll('nav > ul > li > a')).toHaveLength(3)
    const button = w.find('[data-more] button')
    expect(button.attributes('aria-haspopup')).toBe('menu')
    expect(button.attributes('aria-expanded')).toBe('false')
    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(w.findAll('[role=menuitem]').map((a) => a.attributes('href'))).toEqual([
      '/a/b/3',
      '/a/b/4',
    ])
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await w.vm.$nextTick()
    expect(w.find('[role=menu]').exists()).toBe(false)
    await button.trigger('click')
    document.body.click()
    await w.vm.$nextTick()
    expect(w.find('[role=menu]').exists()).toBe(false)
    w.unmount()
    layout.restore()
  })
})

describe('PynSettingsLayout', () => {
  const sections = [
    { id: 'a', label: 'Profile', href: '/s/a' },
    { id: 'b', label: 'Keys', group: 'Access', href: '/s/b' },
    { id: 'c', label: 'Tokens', group: 'Access', href: '/s/c' },
  ]

  it('groups sections, marks the current one and renders title and content', () => {
    expect(groupSections(sections).map((g) => [g.label, g.sections.length])).toEqual([
      [undefined, 1],
      ['Access', 2],
    ])
    const w = mount(PynSettingsLayout, {
      props: { sections, current: 'c', label: 'Account settings', title: 'Settings' },
      slots: { default: '<p>content</p>' },
    })
    expect(w.find('[data-head] h2').text()).toBe('Settings')
    expect(w.find('nav').attributes('aria-label')).toBe('Account settings')
    expect(w.find('nav h2').text()).toBe('Access')
    expect(w.find('[aria-current=page]').text()).toBe('Tokens')
    expect(w.text()).toContain('content')
  })

  it('has a top selector for narrow screens that toggles the navigation', async () => {
    const w = mount(PynSettingsLayout, { props: { sections, current: 'b', label: 'Settings' } })
    const toggle = w.find('button')
    expect(toggle.text()).toBe('Keys')
    expect(
      w
        .find(`#${toggle.attributes('aria-controls')}`)
        .find('nav')
        .exists(),
    ).toBe(true)
    expect(toggle.attributes('aria-expanded')).toBe('false')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(w.find(`#${toggle.attributes('aria-controls')}`).attributes('data-open')).toBeDefined()
  })

  it('has a banded header with actions in the administration variant', () => {
    const w = mount(PynAdminLayout, {
      props: { items: [{ id: 'x', label: 'X', href: '/x' }], current: 'x' },
      slots: { actions: '<a href="/">Leave administration</a>' },
    })
    expect(w.find('[data-head] h2').text()).toBe('Server administration')
    expect(w.find('[data-head]').text()).toContain('Leave administration')
    expect(w.find('[class*=admin]').exists()).toBe(true)
  })

  it('serves the repository, account and organization scopes', () => {
    const repoW = mount(PynRepoSettings, {
      props: {
        owner: 'a',
        name: 'b',
        items: [{ section: 'settings', label: 'General' }],
        current: 'settings',
        title: 'Settings',
      },
    })
    expect(repoW.find('a').attributes('href')).toBe('/a/b/settings')
    expect(repoW.find('h2').text()).toBe('Settings')
    const acct = mount(PynAccountSettings, {
      props: { items: [{ id: 'k', label: 'Keys', href: '/k' }], current: 'k' },
    })
    expect(acct.find('nav').attributes('aria-label')).toBe('Account settings')
    expect(acct.find('h2').exists()).toBe(false)
    const org = mount(PynOrgSettingsLayout, { props: { sections, current: 'a' } })
    expect(org.find('nav').attributes('aria-label')).toBe('Organization settings')
  })
})

describe('settings navigation data', () => {
  it('passes group and icon through to the grouped navigation', () => {
    const w = mount(PynRepoSettings, {
      props: {
        owner: 'a',
        name: 'b',
        items: [
          { section: 'settings', label: 'General', icon: 'settings' },
          { section: 'members', label: 'Collaborators', group: 'Access', icon: 'users' },
          { section: 'roles', label: 'Roles', group: 'Access', icon: 'shield' },
        ],
        current: 'roles',
      },
    })
    expect(w.findAll('nav h2').map((p) => p.text())).toEqual(['Access'])
    expect(w.findAll('nav ul')).toHaveLength(2)
    expect(w.findAll('nav a svg')).toHaveLength(3)
    expect(w.find('section:nth-of-type(2)').findAll('a')).toHaveLength(2)
  })

  it('offers organization settings to owners only, grouped with icons', () => {
    expect(orgSettingsNav('member')).toEqual([])
    expect(orgSettingsNav(null)).toEqual([])
    const nav = orgSettingsNav('owner')
    expect(nav.map((t) => t.section)).toEqual([
      'settings',
      'members',
      'teams',
      'policy',
      'usage',
      'audit',
    ])
    expect(nav.map((t) => t.group)).toEqual([
      undefined,
      'Access',
      'Access',
      'Access',
      'Storage and audit',
      'Storage and audit',
    ])
    expect(nav.every((t) => t.icon)).toBe(true)
    expect(orgSettingsPath('a b', 'settings')).toBe('/a%20b/-/settings')
    expect(orgSettingsPath('a', 'teams')).toBe('/a/-/settings/teams')
  })
})

describe('PynRepoShell lock strip', () => {
  const props = { owner: 'a', name: 'b', visibility: 'public' as const }
  const tabs = [
    { section: '', label: 'Code' },
    { section: 'locks', label: 'Locks' },
  ]

  it('shows the count, the first holders and a link to the Locks tab', () => {
    const w = mount(PynRepoShell, {
      props: { ...props, tabs, lockedCount: 3, lockHolders: ['ann', 'bo', 'cy', 'di', 'ed'] },
    })
    const strip = w.find('[data-lock-strip]')
    expect(strip.text()).toContain('3 exclusive files locked now by ann, bo, cy and 2 more')
    expect(strip.find('a').attributes('href')).toBe('/a/b/locks')
    expect(w.findAll('nav[aria-label=Repository] a')[1]!.find('[data-count]').text()).toBe('3')
    expect(w.findAll('nav[aria-label=Repository] a')[1]!.text()).toContain('3 locked')
  })

  it('uses the singular, keeps an explicit tab count and renders nothing at 0 or absent', () => {
    const one = mount(PynRepoShell, { props: { ...props, tabs, lockedCount: 1 } })
    expect(one.find('[data-lock-strip]').text()).toContain('1 exclusive file locked now')
    expect(one.find('[data-lock-strip]').text()).not.toContain(' by ')
    const own = mount(PynRepoShell, {
      props: { ...props, tabs: [{ section: 'locks', label: 'Locks', count: 9 }], lockedCount: 2 },
    })
    expect(own.find('[data-count]').text()).toBe('9')
    for (const lockedCount of [0, undefined]) {
      const w = mount(PynRepoShell, { props: { ...props, tabs, lockedCount } })
      expect(w.find('[data-lock-strip]').exists()).toBe(false)
      expect(w.find('[data-count]').exists()).toBe(false)
    }
  })

  it('keeps hidePath working with the strip', () => {
    const w = mount(PynRepoShell, { props: { ...props, tabs, hidePath: true, lockedCount: 1 } })
    expect(w.find('h1').exists()).toBe(false)
    expect(w.find('[data-lock-strip]').exists()).toBe(true)
  })

  it('moves tabs into More only when they do not fit', async () => {
    const more = { ...props, tabs: [...tabs, { section: 'history', label: 'History' }] }
    const layout = mockTabWidths({ avail: 1000, tab: 60, more: 60 })
    const w = mount(PynRepoShell, { props: more, attachTo: document.body })
    await w.vm.$nextTick()
    expect(w.find('[data-more]').exists()).toBe(false)
    layout.resize(100)
    await w.vm.$nextTick()
    expect(w.find('[data-more]').exists()).toBe(true)
    w.unmount()
    layout.restore()
  })
})

describe('PynRepoBranches and the landing rail', () => {
  const branches = [
    { name: 'feature/x', ahead: 4, behind: 1 },
    { name: 'main', isDefault: true },
    { name: 'old', updatedAt: '2026-08-01T10:00:00Z' },
  ]

  it('lists the default branch first and caps the list', () => {
    expect(railBranches(branches).map((b) => b.name)).toEqual(['main', 'feature/x', 'old'])
    expect(railBranches([], 'main')).toEqual([{ name: 'main', isDefault: true }])
    const many = Array.from({ length: 9 }, (_, i) => ({ name: `b${i}` }))
    expect(railBranches(many, 'main')).toHaveLength(5)
  })

  it('shows ahead and behind and a link to all branches', () => {
    const w = mount(PynRepoBranches, { props: { branches, href: '/a/b/branches' } })
    expect(w.find('[data-default]').exists()).toBe(true)
    expect(w.find('[data-ahead-behind]').text()).toBe('4 ahead, 1 behind')
    expect(w.find('a').attributes('href')).toBe('/a/b/branches')
  })

  it('appears in the rail only when branches or a link are given', () => {
    const base = { repo, path: '', listing: rootListing, summary }
    expect(mount(PynRepoLanding, { props: base }).find('#branches-title').exists()).toBe(false)
    const w = mount(PynRepoLanding, { props: { ...base, branches, branchesHref: '/x' } })
    expect(w.find('aside #branches-title').exists()).toBe(true)
    const link = mount(PynRepoLanding, { props: { ...base, branchesHref: '/x' } })
    expect(link.find('aside [data-default]').text()).toBe('default')
  })

  it('feeds the rail from railBranches and the toolbar picker from branches', () => {
    const base = { repo, path: '', listing: rootListing, summary, branchesHref: '/x' }
    const many = Array.from({ length: 8 }, (_, i) => ({ name: `b${i}` }))
    const same = mount(PynRepoLanding, { props: { ...base, branches: many } })
    expect(same.findAll('aside section[aria-labelledby=branches-title] li')).toHaveLength(5)
    const split = mount(PynRepoLanding, {
      props: { ...base, branches: many, railBranches: [{ name: 'only', isDefault: true }] },
    })
    expect(split.findAll('aside section[aria-labelledby=branches-title] li')).toHaveLength(1)
    expect(split.findAllComponents(PynBranchBar)[0].props('branches')).toHaveLength(8)
  })
})

describe('PynOrgHeader details', () => {
  const props = { name: 'studio', createdAt: '2026-09-02T08:00:00Z', role: 'owner' as const }

  it('shows display name, description, avatar and link when given', () => {
    const w = mount(PynOrgHeader, {
      props: {
        ...props,
        displayName: 'Studio Games',
        description: 'We make levels.',
        url: 'https://studio.example',
      },
      slots: { actions: '<button>Follow</button>' },
    })
    expect(w.find('h1').text()).toContain('Studio Games')
    expect(w.find('h1').text()).toContain('studio')
    expect(w.find('[data-description]').text()).toBe('We make levels.')
    expect(w.find('[data-link]').attributes('href')).toBe('https://studio.example')
    expect(w.find('button').text()).toBe('Follow')
    expect(w.find('nav[aria-label=Organization]').exists()).toBe(true)
  })

  it('renders nothing extra without the props and ignores a non-web link', () => {
    const w = mount(PynOrgHeader, { props: { ...props, url: 'javascript:alert(1)' } })
    expect(w.find('[data-description]').exists()).toBe(false)
    expect(w.find('[data-link]').exists()).toBe(false)
    expect(w.find('h1 [data-kind]').text()).toBe('organization')
  })
})

describe('no confirmation email note', () => {
  it('shows the default note on the register view when no email is sent', async () => {
    const w = mount(PynSignIn, { props: { registration: 'open', emailVerification: false } })
    expect(w.find('[data-no-email]').exists()).toBe(false)
    await w
      .findAll('button')
      .find((b) => b.text() === 'Create an account')!
      .trigger('click')
    expect(w.find('[data-no-email]').text()).toBe(NO_EMAIL_NOTE)
  })

  it('takes the app text and stays hidden when verification is on or absent', async () => {
    const custom = mount(PynSignIn, {
      props: { registration: 'open', emailVerification: false, noEmailNote: 'Custom.' },
    })
    await custom
      .findAll('button')
      .find((b) => b.text() === 'Create an account')!
      .trigger('click')
    expect(custom.find('[data-no-email]').text()).toBe('Custom.')
    for (const emailVerification of [true, undefined]) {
      const w = mount(PynSignIn, { props: { registration: 'open', emailVerification } })
      await w
        .findAll('button')
        .find((b) => b.text() === 'Create an account')!
        .trigger('click')
      expect(w.find('[data-no-email]').exists()).toBe(false)
    }
    const invite = mount(PynSignIn, { props: { registration: 'invite', emailVerification: false } })
    await invite
      .findAll('button')
      .find((b) => b.text() === 'I have an invitation')!
      .trigger('click')
    expect(invite.find('[data-no-email]').exists()).toBe(false)
  })

  it('shows the note in the notice after sign-up, except when disabled or verification is on', () => {
    const shown = (status: 'pending_approval' | 'account_disabled', emailVerification?: boolean) =>
      mount(PynAccountNotice, { props: { status, emailVerification } })
        .find('[data-no-email]')
        .exists()
    expect(shown('pending_approval', false)).toBe(true)
    expect(shown('pending_approval', true)).toBe(false)
    expect(shown('pending_approval')).toBe(false)
    expect(shown('account_disabled', false)).toBe(false)
  })
})
