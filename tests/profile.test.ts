// Render tests for the profile components. Run with `make test`.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PynAvatar, PynProfileHeader, PynProfileLayout, initials } from '../src'
import { activity, orgs, profile, repos } from '../src/stories/profile-data'

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
      slots: { header: '<p data-head>head</p>' },
    })
    expect(w.find('[data-head]').exists()).toBe(true)
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
