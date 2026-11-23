import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  PynAttention,
  PynDashboard,
  PynDashboardCard,
  PynDashboardFirstRun,
  PynDashboardOrganizations,
  PynDashboardRepositories,
  PynRecentItems,
} from '../src'
import {
  dashboardRepos,
  heldLocks,
  manyLocks,
  notices,
  now,
  recent,
} from '../src/stories/dashboard-data'
import { orgInvitations, orgs } from '../src/stories/org-data'

describe('PynDashboard', () => {
  it('renders header, main and side areas, and omits an empty side', () => {
    const w = mount(PynDashboard, {
      slots: { header: '<h1>Home</h1>', main: '<p id="m">m</p>', side: '<p id="s">s</p>' },
    })
    expect(w.find('header h1').exists()).toBe(true)
    expect(w.find('div > #m').exists()).toBe(true)
    expect(w.find('aside #s').exists()).toBe(true)
    expect(
      mount(PynDashboard, { slots: { main: 'x' } })
        .find('aside')
        .exists(),
    ).toBe(false)
  })
})

describe('PynDashboardCard', () => {
  it('names the section by its heading and adds a see-all link with a full name', () => {
    const w = mount(PynDashboardCard, {
      props: { heading: 'Repositories', seeAllHref: '/_/repos' },
      slots: { default: '<p>body</p>' },
    })
    const heading = w.find('h2')
    expect(w.find('section').attributes('aria-labelledby')).toBe(heading.attributes('id'))
    const link = w.find('a')
    expect(link.attributes('href')).toBe('/_/repos')
    expect(link.text()).toBe('See all Repositories')
    expect(w.text()).toContain('body')
  })

  it('marks a flush body so a list can fill the card', () => {
    const slots = { default: '<p>body</p>' }
    const flush = mount(PynDashboardCard, { props: { heading: 'X', flush: true }, slots })
    expect(flush.find('[data-flush]').exists()).toBe(true)
    expect(
      mount(PynDashboardCard, { props: { heading: 'X' }, slots })
        .find('[data-flush]')
        .exists(),
    ).toBe(false)
  })

  it('shows a loading status instead of the content', () => {
    const w = mount(PynDashboardCard, {
      props: { heading: 'X', loading: true },
      slots: { default: '<p>body</p>' },
    })
    expect(w.find('[role=status]').text()).toBe('Loading…')
    expect(w.attributes('aria-busy')).toBe('true')
    expect(w.text()).not.toContain('body')
  })

  it('shows an announced error with an optional retry', async () => {
    const w = mount(PynDashboardCard, {
      props: { heading: 'X', error: 'Broke', retryable: true },
      slots: { default: '<p>body</p>' },
    })
    expect(w.find('[role=alert]').text()).toBe('Broke')
    await w.find('button').trigger('click')
    expect(w.emitted('retry')).toHaveLength(1)
    expect(w.text()).not.toContain('body')
    expect(
      mount(PynDashboardCard, { props: { heading: 'X', error: 'Broke' } })
        .find('button')
        .exists(),
    ).toBe(false)
  })
})

describe('PynAttention', () => {
  const attention = (props: Record<string, unknown>) =>
    mount(PynAttention, { props: { now, ...props } })

  it('says the person is caught up when there is nothing', () => {
    const w = attention({})
    expect(w.text()).toContain('You are all caught up')
    expect(w.find('[data-lock]').exists()).toBe(false)
  })

  it('lists locks soonest first with repository, path and time left, flagging expiring ones', () => {
    const w = attention({ locks: heldLocks })
    const rows = w.findAll('[data-lock]')
    expect(rows).toHaveLength(3)
    expect(rows[0].text()).toContain('Content/Art/Hero.psd')
    expect(rows[0].text()).toContain('alice/castle-quest')
    expect(rows[0].text()).toContain('Expiring soon')
    expect(rows[0].text()).toContain('20m')
    expect(rows[1].text()).toContain('3h 42m')
    expect(rows[1].text()).not.toContain('Expiring soon')
    expect(rows[0].find('a').attributes('href')).toBe('/alice/castle-quest')
  })

  it('limits the locks and links to the rest', () => {
    const w = attention({ locks: manyLocks, maxLocks: 3, locksHref: '/all' })
    expect(w.findAll('[data-lock]')).toHaveLength(3)
    expect(w.find('[data-more]').text()).toBe('and 5 more locks')
    expect(w.find('[data-more]').attributes('href')).toBe('/all')
  })

  it('lists invitations with who invited and an Accept link that emits', async () => {
    const w = attention({
      invitations: orgInvitations,
      invitationHref: (i: { org: string }) => `/_/invitations#${i.org}`,
    })
    const row = w.find('[data-invitation]')
    expect(row.text()).toContain(orgInvitations[0].org)
    expect(row.text()).toContain(`Invited by ${orgInvitations[0].invited_by}`)
    const link = row.find('a')
    expect(link.attributes('href')).toBe(`/_/invitations#${orgInvitations[0].org}`)
    expect(link.text()).toContain('Accept')
    await link.trigger('click')
    expect(w.emitted('accept')?.[0][0]).toBe(orgInvitations[0].org)
  })

  it('defaults the invitation link and lists notices, linking those with an href', () => {
    const w = attention({ invitations: orgInvitations, notices })
    expect(w.find('[data-invitation] a').attributes('href')).toBe('/_/invitations')
    const rows = w.findAll('[data-notice]')
    expect(rows).toHaveLength(2)
    expect(rows[0].find('a').attributes('href')).toBe('/alice/-/usage')
    expect(rows[1].find('a').exists()).toBe(false)
    expect(w.text()).not.toContain('caught up')
  })
})

describe('PynRecentItems', () => {
  it('labels the list as kept in this browser and shows each kind', () => {
    const w = mount(PynRecentItems, { props: { items: recent } })
    expect(w.text()).toContain('Kept in this browser')
    const rows = w.findAll('[data-recent]')
    expect(rows).toHaveLength(3)
    expect(rows[0].find('a').attributes('href')).toBe('/alice/castle-quest')
    expect(rows[0].text()).toContain('repository')
  })

  it('clears only when clearable and shows an empty line', async () => {
    expect(
      mount(PynRecentItems, { props: { items: recent } })
        .find('button')
        .exists(),
    ).toBe(false)
    const w = mount(PynRecentItems, { props: { items: [], clearable: true } })
    expect(w.text()).toContain('Nothing opened yet.')
    await w.find('button').trigger('click')
    expect(w.emitted('clear')).toHaveLength(1)
  })
})

describe('PynDashboardRepositories and Organizations', () => {
  it('lists repositories with a New link, and See all only past the max', () => {
    const w = mount(PynDashboardRepositories, {
      props: { repos: dashboardRepos, seeAllHref: '/r' },
    })
    expect(w.findAll('li')).toHaveLength(3)
    expect(w.find('a[href="/_/new"]').text()).toBe('New')
    expect(w.text()).not.toContain('See all')
    const more = mount(PynDashboardRepositories, {
      props: { repos: dashboardRepos, max: 2, seeAllHref: '/r' },
    })
    expect(more.findAll('li')).toHaveLength(2)
    expect(more.find('a[href="/r"]').exists()).toBe(true)
  })

  it('shows the create state, loading and error', () => {
    const empty = mount(PynDashboardRepositories, { props: { repos: [] } })
    expect(empty.text()).toContain('Create a repository')
    expect(
      mount(PynDashboardRepositories, { props: { repos: [], loading: true } })
        .find('[role=status]')
        .exists(),
    ).toBe(true)
    const failed = mount(PynDashboardRepositories, { props: { repos: [], error: 'Nope' } })
    expect(failed.find('[role=alert]').text()).toBe('Nope')
    expect(failed.find('button').text()).toBe('Try again')
  })

  it('lists organizations and offers to create one when there are none', () => {
    const w = mount(PynDashboardOrganizations, { props: { orgs } })
    expect(w.findAll('li')).toHaveLength(2)
    expect(w.find('a[href="/_/orgs"]').exists()).toBe(true)
    const empty = mount(PynDashboardOrganizations, { props: { orgs: [] } })
    expect(empty.text()).toContain('Create an organization')
    expect(empty.find('a[href="/_/new-org"]').exists()).toBe(true)
    expect(empty.text()).not.toContain('See all')
  })
})

describe('PynDashboardFirstRun', () => {
  it('offers a repository and an organization and emits their clicks', async () => {
    const w = mount(PynDashboardFirstRun)
    const links = w.findAll('a')
    expect(links.map((l) => l.attributes('href'))).toEqual(['/_/new', '/_/new-org'])
    await links[0].trigger('click')
    await links[1].trigger('click')
    expect(w.emitted('newRepo')).toHaveLength(1)
    expect(w.emitted('newOrg')).toHaveLength(1)
  })
})
