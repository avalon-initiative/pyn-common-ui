// Component render tests for every exported component. Run with `make test`.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  PynAccountNotice,
  PynBreadcrumb,
  PynBranchBar,
  PynButton,
  PynIcon,
  PynLockBadge,
  PynLockIcon,
  PynMenu,
  PynModeChip,
  PynOrgHeader,
  PynPageNotFound,
  PynRepoHeader,
  PynRepoNav,
  PynRepoNotFound,
  PynResendForm,
  PynSearch,
  PynShell,
  PynSideNav,
  PynTopBar,
  formatAgo,
  mainNav,
  matchRepos,
  repoTabs,
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

describe('PynTopBar', () => {
  it('offers the theme choices, marks the current one and emits changes', async () => {
    const w = mount(PynTopBar, { props: { user: 'alice', repos: [], theme: 'light' } })
    await w.find('[aria-label="Account menu"]').trigger('click')
    const radios = w.findAll('[role=menuitemradio]')
    expect(radios.map((r) => r.text().replace('✓', ''))).toEqual([
      'System theme',
      'Light theme',
      'Dark theme',
    ])
    expect(radios.map((r) => r.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])
    await radios[2].trigger('click')
    expect(w.emitted('theme')?.[0]).toEqual(['dark'])
  })

  it('links to account settings and emits sign out', async () => {
    const w = mount(PynTopBar, { props: { user: 'alice', repos: [], theme: 'system' } })
    await w.find('[aria-label="Account menu"]').trigger('click')
    expect(w.find('a[href="/_/settings"]').exists()).toBe(true)
    await w
      .findAll('button')
      .find((b) => b.text() === 'Sign out')!
      .trigger('click')
    expect(w.emitted('signOut')).toHaveLength(1)
  })

  it('links Accounts in the account menu for administrators only', async () => {
    const open = async (admin?: boolean) => {
      const w = mount(PynTopBar, { props: { user: 'root', repos: [], theme: 'system', admin } })
      await w.find('[aria-label="Account menu"]').trigger('click')
      return w
    }
    expect((await open(true)).find('[href="/_/admin/accounts"]').exists()).toBe(true)
    expect((await open()).find('[href="/_/admin/accounts"]').exists()).toBe(false)
  })

  it('offers creating a repository and an organization', async () => {
    const bar = mount(PynTopBar, { props: { user: 'alice', repos: [], theme: 'system' } })
    await bar.find('[aria-label="Create"]').trigger('click')
    expect(bar.find('a[href="/_/new"]').exists()).toBe(true)
    expect(bar.find('a[href="/_/new-org"]').exists()).toBe(true)
  })
})

describe('PynSideNav', () => {
  const repos = [
    { owner: 'alice', name: 'castle-quest' },
    { owner: 'alice', name: 'core-engine' },
  ]

  it('lists the main items and the repositories, marking the current ones', () => {
    const w = mount(PynSideNav, {
      props: {
        account: 'alice',
        items: mainNav,
        current: 'home',
        repos,
        currentRepo: 'alice/core-engine',
      },
    })
    expect(w.findAll('a').map((a) => a.attributes('href'))).toContain('/alice/castle-quest')
    expect(w.text()).toContain('Home')
    expect(w.findAll('[aria-current]').map((a) => a.text())).toEqual(['Home', 'alice/core-engine'])
  })

  it('says when there are no repositories', () => {
    const w = mount(PynSideNav, { props: { account: 'alice', items: mainNav, current: '', repos: [] } })
    expect(w.text()).toContain('None yet')
  })

  it('lists organizations', () => {
    const w = mount(PynSideNav, {
      props: {
        account: 'alice',
        items: mainNav,
        current: '',
        repos,
        orgs: [{ name: 'studio' }],
        currentOrg: 'studio',
      },
    })
    expect(w.find('a[href="/studio"]').attributes('aria-current')).toBe('true')
  })
})

describe('repository and organization headers', () => {
  it('shows name, visibility and the permitted tabs', () => {
    const w = mount(PynRepoHeader, {
      props: {
        owner: 'alice',
        name: 'game',
        visibility: 'private',
        leaseHours: 24,
        tabs: repoTabs(['read'], false),
      },
    })
    expect(w.find('h1').text()).toContain('alice/game')
    expect(w.find('[data-visibility]').text()).toBe('private')
    expect(w.findAll('nav a').map((a) => a.text())).toEqual(['Code', 'Locks', 'History'])
  })

  it('omits the tab row without access', () => {
    const w = mount(PynRepoHeader, {
      props: { owner: 'a', name: 'b', visibility: 'public', leaseHours: 1 },
    })
    expect(w.find('nav').exists()).toBe(false)
  })

  it('shows the organization chip on a repository header', () => {
    const base = { owner: 'studio', name: 'game', visibility: 'private' as const, leaseHours: 8 }
    const org = mount(PynRepoHeader, { props: { ...base, orgOwned: true } })
    expect(org.find('[data-org]').exists()).toBe(true)
    expect(org.find('a[href="/studio"]').exists()).toBe(true)
    expect(mount(PynRepoHeader, { props: base }).find('[data-org]').exists()).toBe(false)
  })

  it('marks the current repository tab', () => {
    const w = mount(PynRepoNav, {
      props: { owner: 'alice', name: 'game', tabs: repoTabs(['read'], false), current: 'locks' },
    })
    expect(w.find('[aria-current=page]').text()).toBe('Locks')
    expect(w.findAll('a')[0].attributes('href')).toBe('/alice/game')
  })

  it('marks the organization and links only the tabs the role allows', () => {
    const w = mount(PynOrgHeader, {
      props: { name: 'studio', createdAt: '2026-09-02T08:00:00Z', role: 'member' },
    })
    expect(w.find('[data-kind]').text()).toBe('organization')
    expect(w.findAll('nav a').map((a) => a.attributes('href'))).toEqual([
      '/studio',
      '/studio/-/members',
      '/studio/-/teams',
    ])
  })
})

describe('PynBranchBar', () => {
  it('shows the file count and when there are no revisions', () => {
    const bar = mount(PynBranchBar, { props: { branch: 'main', files: 1, updatedAt: null } })
    expect(bar.text()).toContain('1 file')
    expect(bar.text()).toContain('No revisions yet')
  })

  it('shows the relative time of the last revision', () => {
    const bar = mount(PynBranchBar, {
      props: { branch: 'main', files: 2, updatedAt: '2026-10-08T10:00:00Z', now },
    })
    expect(bar.text()).toContain('2 files')
    expect(bar.text()).toContain('2 hours ago')
  })

  it('formats relative times', () => {
    const at = (ms: number) => new Date(now.getTime() - ms).toISOString()
    expect(formatAgo(at(5_000), now)).toBe('just now')
    expect(formatAgo(at(60_000), now)).toBe('1 minute ago')
    expect(formatAgo(at(2 * 3_600_000), now)).toBe('2 hours ago')
    expect(formatAgo(at(3 * 86_400_000), now)).toBe('3 days ago')
    expect(formatAgo(at(90 * 86_400_000), now)).toBe('Jul 10 2026')
  })
})

describe('PynShell', () => {
  it('toggles the sidebar and closes it after following a link', async () => {
    const w = mount(PynShell, { slots: { side: '<a href="#x">x</a>', default: 'body' } })
    const side = w.find('aside')
    expect(side.classes().length).toBe(1)
    await w.find('[aria-label="Toggle navigation"]').trigger('click')
    expect(side.classes().length).toBe(2)
    await side.find('a').trigger('click')
    expect(side.classes().length).toBe(1)
  })
})
