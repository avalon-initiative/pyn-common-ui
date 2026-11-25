// Render tests for the profile components. Run with `make test`.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  PynAvatar,
  PynOrgHome,
  PynPageColumns,
  PynProfileHeader,
  PynProfileLayout,
  PynRepoList,
  arrangeRepos,
  initials,
  profileTabs,
} from '../src'
import { activity, orgs, people, profile, repos, starred } from '../src/stories/profile-data'

describe('initials', () => {
  it('takes the first and last word, or ? when empty', () => {
    expect(initials('Alice Anders')).toBe('AA')
    expect(initials('alice')).toBe('A')
    expect(initials('mary-jane.watson')).toBe('MW')
    expect(initials('  ')).toBe('?')
  })
})

describe('PynAvatar', () => {
  it('shows the image with a named wrapper', () => {
    const w = mount(PynAvatar, { props: { username: 'alice', src: '/v1/users/alice/avatar?v=1' } })
    expect(w.find('img').attributes('src')).toBe('/v1/users/alice/avatar?v=1')
    expect(w.attributes('role')).toBe('img')
    expect(w.attributes('aria-label')).toBe("alice's avatar")
  })

  it('falls back to initials without an image', () => {
    const w = mount(PynAvatar, { props: { username: 'alice', name: 'Alice Anders', src: null } })
    expect(w.find('img').exists()).toBe(false)
    expect(w.find('[data-initials]').text()).toBe('AA')
    expect(w.attributes('aria-label')).toBe("Alice Anders's avatar")
  })

  it('falls back to initials when the image fails, and retries on a new src', async () => {
    const w = mount(PynAvatar, { props: { username: 'alice', src: '/a.png' } })
    await w.find('img').trigger('error')
    expect(w.find('img').exists()).toBe(false)
    expect(w.find('[data-initials]').text()).toBe('A')
    await w.setProps({ src: '/b.png' })
    expect(w.find('img').attributes('src')).toBe('/b.png')
  })

  it('sets the size', () => {
    expect(mount(PynAvatar, { props: { username: 'a', size: 'xl' } }).attributes('data-size')).toBe(
      'xl',
    )
  })
})

describe('PynProfileHeader', () => {
  it('renders every field', () => {
    const w = mount(PynProfileHeader, { props: profile })
    expect(w.find('h1').text()).toContain('Alice Anders')
    expect(w.find('h1').text()).toContain('alice')
    expect(w.text()).toContain('Level designer')
    expect(w.find('[data-company]').text()).toBe('Studio')
    expect(w.find('[data-location]').text()).toBe('Lisbon')
    expect(w.find('[data-since]').text()).toBe('Member since Sep 02 2026')
    const links = w.findAll('[data-link] a')
    expect(links.map((a) => a.text())).toEqual(['alice.example.com', 'github.com/alice'])
    expect(links[0].attributes('rel')).toContain('noopener')
  })

  it('shows the username alone and omits empty parts', () => {
    const w = mount(PynProfileHeader, { props: { username: 'bob' } })
    expect(w.find('h1').text()).toBe('bob')
    expect(w.find('[data-since]').exists()).toBe(false)
    expect(w.find('[data-initials]').text()).toBe('B')
  })

  it('drops links that are not http(s)', () => {
    const w = mount(PynProfileHeader, {
      props: { username: 'bob', links: ['javascript:alert(1)', 'https://ok.example'] },
    })
    expect(w.findAll('[data-link]')).toHaveLength(1)
  })

  it('renders the actions slot only when given', () => {
    const w = mount(PynProfileHeader, {
      props: { username: 'bob' },
      slots: { actions: '<button>Edit</button>' },
    })
    expect(w.find('button').text()).toBe('Edit')
    expect(
      mount(PynProfileHeader, { props: { username: 'bob' } })
        .find('button')
        .exists(),
    ).toBe(false)
  })
})

describe('PynProfileLayout', () => {
  const now = new Date('2026-11-15T12:00:00Z')

  it('wires repositories, organizations and activity', () => {
    const w = mount(PynProfileLayout, {
      props: { repos, orgs, activityEntries: activity, now },
      slots: { profile: '<p data-head>head</p>' },
    })
    expect(w.find('aside [data-head]').exists()).toBe(true)
    expect(w.find('a[href="/alice/maps"]').exists()).toBe(true)
    expect(w.find('a[href="/studio"]').text()).toBe('studio')
    expect(w.text()).toContain('Recent activity')
  })

  it('hides empty organizations and omitted activity, and says when there are no repositories', () => {
    const w = mount(PynProfileLayout, { props: { repos: [], orgs: [] } })
    expect(w.text()).not.toContain('Organizations')
    expect(w.text()).not.toContain('Recent activity')
    expect(w.text()).toContain('No repositories to show.')
  })

  it('shows the tab bar with Stars only when a star count is given', () => {
    const labels = (props: object) =>
      mount(PynProfileLayout, { props: { username: 'alice', repos, ...props } })
        .findAll('nav a')
        .map((a) => a.text().replace(/\d.*$/, ''))
    expect(labels({})).toEqual(['Overview', 'Repositories'])
    expect(labels({ stars: 4 })).toEqual(['Overview', 'Repositories', 'Stars'])
    expect(labels({ self: true })).toContain('Usage')
    expect(mount(PynProfileLayout, { props: { repos } }).find('nav').exists()).toBe(false)
  })

  it('shows the Stars count for a number, no count for null, and no tab when undefined', () => {
    const stars = (props: object) =>
      mount(PynProfileLayout, { props: { username: 'alice', ...props } })
        .findAll('nav a')
        .find((a) => a.text().startsWith('Stars'))
    expect(stars({})).toBeUndefined()
    expect(stars({ stars: undefined })).toBeUndefined()
    expect(stars({ stars: 0 })?.find('[data-count]').text()).toBe('0')
    expect(stars({ stars: 4 })?.find('[data-count]').text()).toBe('4')
    const none = stars({ stars: null })
    expect(none?.text()).toBe('Stars')
    expect(none?.find('[data-count]').exists()).toBe(false)
  })

  it('shows the starred slot in place of the list on a Stars tab without a count', () => {
    const w = mount(PynProfileLayout, {
      props: { username: 'alice', stars: null, current: 'stars' },
      slots: { starred: '<div role="alert" data-error>Could not load</div>' },
    })
    expect(w.find('[data-error]').exists()).toBe(true)
    expect(w.text()).not.toContain('No starred repositories.')
    expect(w.find('[aria-current="page"]').text()).toBe('Stars')
  })

  it('shows the README slot, pinned placeholder and repositories on the overview', () => {
    const w = mount(PynProfileLayout, {
      props: { username: 'alice', repos },
      slots: { readme: '<p data-readme>hi</p>' },
    })
    expect(w.find('[data-readme]').exists()).toBe(true)
    expect(w.find('[data-pinned-unsupported]').text()).toContain('not supported')
    expect(w.findAll('h2').map((h) => h.text())).toContain('Repositories')
  })

  it('shows only the filtered list on the Repositories tab', () => {
    const w = mount(PynProfileLayout, {
      props: { username: 'alice', repos, current: 'repositories' },
      slots: {
        readme: '<p data-readme>hi</p>',
        repositoryActions: '<button data-new>New</button>',
      },
    })
    expect(w.find('[data-readme]').exists()).toBe(false)
    expect(w.find('[data-pinned-unsupported]').exists()).toBe(false)
    expect(w.find('input[type=search]').exists()).toBe(true)
    expect(w.find('[data-new]').exists()).toBe(true)
  })

  it('lists the starred repositories on the Stars tab', () => {
    const w = mount(PynProfileLayout, {
      props: { username: 'alice', stars: 2, starredRepos: starred, current: 'stars' },
    })
    expect(w.find('a[href="/studio/castle-quest"]').exists()).toBe(true)
    expect(w.find('a[href="/alice/maps"]').exists()).toBe(false)
    expect(w.find('[aria-current="page"]').text()).toContain('Stars')
  })

  it('lets slots replace the sections', () => {
    const w = mount(PynProfileLayout, {
      slots: {
        repositories: '<p data-r>r</p>',
        organizations: '<p data-o>o</p>',
        activity: '<p data-a>a</p>',
      },
    })
    expect(['data-r', 'data-o', 'data-a'].every((a) => w.find(`[${a}]`).exists())).toBe(true)
  })
})

describe('PynProfileHeader column', () => {
  it('stacks the profile with an icon per fact', () => {
    const w = mount(PynProfileHeader, { props: { ...profile, column: true } })
    expect(w.classes().join(' ')).toMatch(/column/)
    expect(w.find('[data-location] svg').exists()).toBe(true)
    expect(w.find('[data-link] svg').exists()).toBe(true)
    const band = mount(PynProfileHeader, { props: profile })
    expect(band.find('[data-location] svg').exists()).toBe(false)
  })
})

describe('PynPageColumns start', () => {
  it('puts the side column first', () => {
    const w = mount(PynPageColumns, { props: { start: true }, slots: { default: 'm', side: 's' } })
    expect(w.classes().join(' ')).toMatch(/start/)
    expect(w.find('aside').exists()).toBe(true)
  })
})

describe('profile and repository list helpers', () => {
  it('builds the profile tabs', () => {
    expect(profileTabs('alice').map((t) => [t.label, t.href])).toEqual([
      ['Overview', '/alice'],
      ['Repositories', '/alice/-/repositories'],
    ])
    const tabs = profileTabs('alice', { current: 'stars', repos: 3, stars: 0, self: true })
    expect(tabs.map((t) => t.label)).toEqual(['Overview', 'Repositories', 'Stars', 'Usage'])
    expect(tabs.find((t) => t.current)?.label).toBe('Stars')
    expect(tabs[2].count).toBe(0)
    const noCount = profileTabs('alice', { stars: null }).find((t) => t.label === 'Stars')
    expect(noCount?.href).toBe('/alice/-/stars')
    expect(noCount?.count).toBeUndefined()
  })

  it('filters, types and sorts repositories', () => {
    const names = (q: string, t: 'all' | 'public' | 'private', s: 'updated' | 'name') =>
      arrangeRepos(repos, q, t, s).map((r) => r.name)
    expect(names('', 'all', 'updated')).toEqual(['maps', 'textures', 'notes'])
    expect(names('', 'all', 'name')).toEqual(['maps', 'notes', 'textures'])
    expect(names('', 'private', 'name')).toEqual(['textures'])
    expect(names('exclusive', 'all', 'name')).toEqual(['textures'])
    expect(names('zzz', 'all', 'name')).toEqual([])
  })
})

describe('PynRepoList boxed', () => {
  const now = new Date('2026-11-15T12:00:00Z')
  const mountList = (props: object = {}) =>
    mount(PynRepoList, {
      props: { boxed: true, repos, now, ...props },
      slots: { actions: '<button data-new>New</button>' },
    })

  it('shows the count, extras and the New action', () => {
    const w = mountList()
    expect(w.text()).toContain('3 repositories')
    expect(w.find('[data-new]').exists()).toBe(true)
    expect(w.find('[data-description]').text()).toContain('Level layouts')
    expect(w.findAll('[data-topic]').map((t) => t.text())).toEqual(['levels', 'unreal'])
    expect(w.find('[data-language]').text()).toBe('Unreal')
    expect(w.find('[data-updated]').text()).toContain('Updated')
  })

  it('has Type and Sort selects and no Language select', async () => {
    const w = mountList()
    expect(w.findAll('select').map((s) => s.attributes('aria-label'))).toEqual(['Type', 'Sort'])
    await w.find('select[aria-label=Type]').setValue('private')
    expect(w.findAll('[data-visibility]').map((v) => v.text())).toEqual(['private'])
    await w.find('select[aria-label=Type]').setValue('all')
    await w.find('select[aria-label=Sort]').setValue('name')
    expect(w.findAll('a').map((a) => a.text())).toEqual([
      'alice/maps',
      'alice/notes',
      'alice/textures',
    ])
  })

  it('searches, says when nothing matches and pages', async () => {
    const w = mountList({ pageSize: 2 })
    expect(w.findAll('[data-visibility]')).toHaveLength(2)
    await w.find('[data-next]').trigger('click')
    expect(w.findAll('[data-visibility]')).toHaveLength(1)
    await w.find('input[type=search]').setValue('zzz')
    expect(w.find('[data-no-match]').exists()).toBe(true)
  })

  it('omits extras that are not given and shows the empty state', () => {
    const plain = mountList({ repos: [{ ...repos[1], updated_at: null }] })
    expect(plain.find('[data-description]').exists()).toBe(false)
    expect(plain.find('[data-topic]').exists()).toBe(false)
    expect(plain.find('[data-language]').exists()).toBe(false)
    expect(plain.text()).toContain('Created Oct 05 2026')
    expect(mountList({ repos: [], empty: 'Nothing yet.' }).text()).toContain('Nothing yet.')
  })
})

describe('PynOrgHome', () => {
  it('shows the README, pinned placeholder, repositories and the People rail without an invite', () => {
    const w = mount(PynOrgHome, {
      props: { repos, people, peopleHref: '/studio/-/members' },
      slots: { readme: '<p data-readme>about</p>' },
    })
    expect(w.find('[data-readme]').exists()).toBe(true)
    expect(w.find('[data-pinned-unsupported]').exists()).toBe(true)
    expect(w.find('a[href="/alice/maps"]').exists()).toBe(true)
    const rail = w.find('aside')
    expect(rail.findAll('li a')).toHaveLength(people.length)
    expect(rail.find('a[href="/bob"]').exists()).toBe(true)
    expect(rail.text()).not.toMatch(/invite/i)
    expect(rail.find('[data-people-all]').attributes('href')).toBe('/studio/-/members')
  })

  it('shows languages and topics only when given', () => {
    const none = mount(PynOrgHome, { props: { repos: [], people: [] } })
    expect(none.find('[data-people]').exists()).toBe(false)
    expect(none.find('[data-languages]').exists()).toBe(false)
    expect(none.find('[data-topics]').exists()).toBe(false)
    const some = mount(PynOrgHome, { props: { languages: ['Rust'], topics: ['game-dev'] } })
    expect(some.find('[data-languages]').text()).toContain('Rust')
    expect(some.find('[data-topics]').text()).toContain('game-dev')
  })

  it('caps the avatars at maxPeople', () => {
    const w = mount(PynOrgHome, { props: { people, maxPeople: 2 } })
    expect(w.findAll('[data-people] li')).toHaveLength(2)
  })
})
