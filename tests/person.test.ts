// Render tests for people in lists: PynPerson and the components that show one. Run with `make test`.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  PynActivity,
  PynAudit,
  PynFileBar,
  PynHistory,
  PynLockBadge,
  PynLocks,
  PynMembers,
  PynOrgMembers,
  PynPerson,
  PynSideNav,
  PynTopBar,
  mainNav,
  personGrantees,
} from '../src'
import { aliceIdentity, aliciaIdentity, carolIdentity } from '../src/stories/person-data'

const now = new Date('2026-10-08T12:00:00Z')
const lock = {
  path: 'a.umap',
  owner: 'alice',
  acquired_at: '2026-10-08T09:00:00Z',
  expires_at: '2026-10-08T15:00:00Z',
}
const rev = {
  id: 1,
  path: 'a.umap',
  author: 'alice',
  message: 'm',
  created_at: '2026-10-08T09:00:00Z',
}

describe('PynPerson', () => {
  it('renders only the name without an identity or rename', () => {
    const w = mount(PynPerson, { props: { name: 'alice' } })
    expect(w.html()).toBe('alice')
  })

  it('shows the avatar and display name beside the account name', () => {
    const w = mount(PynPerson, { props: { name: 'alice', identity: aliceIdentity } })
    expect(w.find('img').exists()).toBe(true)
    expect(w.find('[data-display]').text()).toBe('Alice Anders')
    expect(w.find('[data-account]').text()).toBe('alice')
    expect(w.find('[data-written]').exists()).toBe(false)
  })

  it('falls back to initials when the identity has no avatar or display name', () => {
    const w = mount(PynPerson, { props: { name: 'carol', identity: carolIdentity } })
    expect(w.find('[data-initials]').text()).toBe('C')
    expect(w.find('[data-display]').exists()).toBe(false)
  })

  it('shows the written name when the account was renamed', () => {
    const w = mount(PynPerson, { props: { name: 'alice', current: 'alicia' } })
    expect(w.text()).toBe('alicia (written as alice)')
    expect(w.find('img').exists()).toBe(false)
    const same = mount(PynPerson, { props: { name: 'alice', current: 'alice' } })
    expect(same.html()).toBe('alice')
  })

  it('combines display name, current name and written name, and can hide the avatar', () => {
    const w = mount(PynPerson, {
      props: { name: 'alice', current: 'alicia', identity: aliciaIdentity, avatar: false },
    })
    expect(w.text()).toBe('Alicia Anders alicia (written as alice)')
    expect(w.find('[data-initials]').exists()).toBe(false)
  })
})

describe('people in lists', () => {
  it('PynActivity keeps the letter circle without an identity and uses the avatar with one', () => {
    const entry = { id: 1, at: '2026-10-08T11:00:00Z', actor: 'alice', action: 'checkout' }
    const plain = mount(PynActivity, { props: { entries: [entry], now } })
    expect(plain.find('strong').text()).toBe('alice')
    expect(plain.find('[role="img"]').exists()).toBe(false)
    const rich = mount(PynActivity, {
      props: {
        entries: [{ ...entry, actor_public: aliceIdentity, actor_current: 'alicia' }],
        now,
      },
    })
    expect(rich.find('[role="img"] img').exists()).toBe(true)
    expect(rich.find('strong').text()).toBe('Alice Anders alicia (written as alice)')
  })

  it('PynHistory shows the author identity and rename', () => {
    const plain = mount(PynHistory, { props: { revisions: [rev] } })
    expect(plain.find('[data-account]').exists()).toBe(false)
    expect(plain.text()).toContain('alice authored')
    const rich = mount(PynHistory, {
      props: { revisions: [{ ...rev, author_public: aliciaIdentity, author_current: 'alicia' }] },
    })
    expect(rich.find('[data-display]').text()).toBe('Alicia Anders')
    expect(rich.find('[data-written]').text()).toBe('(written as alice)')
    expect(rich.find('img').exists()).toBe(true)
  })

  it('PynAudit shows the actor identity and rename', () => {
    const e = { id: 1, at: '2026-10-08T11:00:00Z', actor: 'alice', action: 'x', detail: '' }
    expect(mount(PynAudit, { props: { entries: [e] } }).text()).toContain('alice ·')
    const rich = mount(PynAudit, {
      props: { entries: [{ ...e, actor_public: aliciaIdentity, actor_current: 'alicia' }] },
    })
    expect(rich.find('[data-display]').text()).toBe('Alicia Anders')
    expect(rich.find('[data-written]').exists()).toBe(true)
  })

  it('PynLocks and PynLockBadge show the holder identity', () => {
    const withId = { ...lock, identity: aliceIdentity }
    expect(mount(PynLocks, { props: { locks: [lock], now } }).text()).toContain('alice ·')
    const locks = mount(PynLocks, { props: { locks: [withId], now } })
    expect(locks.find('[data-display]').text()).toBe('Alice Anders')
    const badge = mount(PynLockBadge, { props: { lock: withId, me: 'bob', now } })
    expect(badge.find('[data-display]').text()).toBe('Alice Anders')
    const mine = mount(PynLockBadge, { props: { lock: withId, me: 'alice', now } })
    expect(mine.text()).toContain('You')
    expect(mount(PynLockBadge, { props: { lock, me: 'bob', now } }).text()).toContain('alice')
  })

  it('PynLocks offers a line break after each path slash and keeps the text intact', () => {
    const w = mount(PynLocks, {
      props: { locks: [{ ...lock, path: 'Content/Maps/Main.umap' }], now, canForce: true },
    })
    const path = w.find('li span')
    expect(path.findAll('wbr')).toHaveLength(3)
    expect(path.text()).toBe('Content/Maps/Main.umap')
    expect(w.find('li button').text()).toBe('Force unlock')
  })

  it('PynMembers and PynOrgMembers show the member identity', () => {
    const members = [{ user: 'alice', role: 'admin', source: 'direct' as const }]
    const plain = mount(PynMembers, { props: { grantees: personGrantees(members), roles: [] } })
    expect(plain.find('strong').html()).toBe('<strong>alice</strong>')
    const rich = mount(PynMembers, {
      props: {
        grantees: personGrantees([{ ...members[0], identity: aliceIdentity }]),
        roles: [],
      },
    })
    expect(rich.find('[data-display]').text()).toBe('Alice Anders')
    const org = mount(PynOrgMembers, {
      props: {
        members: [{ user: 'alice', role: 'owner' as const, identity: aliceIdentity }],
        self: 'bob',
        owner: false,
      },
    })
    expect(org.find('[data-display]').text()).toBe('Alice Anders')
    expect(org.find('img').exists()).toBe(true)
  })

  it('PynFileBar shows the last change author identity', () => {
    const entry = {
      path: 'a.umap',
      name: 'a.umap',
      kind: 'file' as const,
      mode: 'shared' as const,
      last_change: { ...rev, author_public: aliceIdentity },
    }
    const w = mount(PynFileBar, { props: { entry, owner: 'o', name: 'n', now } })
    expect(w.find('[data-display]').text()).toBe('Alice Anders')
  })
})

describe('account in the shell', () => {
  it('PynTopBar and PynSideNav use the avatar and display name when given', () => {
    const top = mount(PynTopBar, { props: { user: 'alice', repos: [], theme: 'light' } })
    expect(top.find('[role="img"]').exists()).toBe(false)
    const topRich = mount(PynTopBar, {
      props: { user: 'alice', displayName: 'Alice Anders', repos: [], theme: 'light' },
    })
    expect(topRich.find('[data-initials]').text()).toBe('AA')
    const side = mount(PynSideNav, {
      props: { account: 'alice', items: mainNav, current: 'home', repos: [] },
    })
    expect(side.text()).toContain('alice')
    expect(side.find('[role="img"]').exists()).toBe(false)
    const sideRich = mount(PynSideNav, {
      props: {
        account: 'alice',
        displayName: 'Alice Anders',
        avatarUrl: '/a.png',
        items: mainNav,
        current: 'home',
        repos: [],
      },
    })
    expect(sideRich.find('img').attributes('src')).toBe('/a.png')
    expect(sideRich.text()).toContain('Alice Anders')
  })
})
