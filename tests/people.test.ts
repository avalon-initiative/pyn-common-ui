import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PynPeopleList, PynPeopleSearch, PynShell, PynTopBar } from '../src'
import { aliceIdentity, carolIdentity } from '../src/stories/person-data'

const people = [
  {
    identity: aliceIdentity,
    bio: 'Level designer.',
    company: 'Studio',
    location: 'Oslo',
    links: ['https://alice.example', 'javascript:alert(1)'],
  },
  { identity: carolIdentity },
]

describe('PynPeopleList', () => {
  it('lists people with profile links and only web links', () => {
    const w = mount(PynPeopleList, { props: { people } })
    const rows = w.findAll('[data-person]')
    expect(rows).toHaveLength(2)
    expect(rows[0].find('a').attributes('href')).toBe('/alice')
    expect(rows[0].text()).toContain('Alice Anders')
    expect(rows[0].find('[data-company]').text()).toBe('Studio')
    expect(rows[0].findAll('[data-link]')).toHaveLength(1)
    expect(rows[1].find('a').text()).toBe('carol')
  })

  it('builds links with the href prop', () => {
    const w = mount(PynPeopleList, { props: { people, href: (u: string) => `/people/${u}` } })
    expect(w.find('a').attributes('href')).toBe('/people/alice')
  })

  it('shows the empty message', () => {
    const w = mount(PynPeopleList, { props: { people: [], empty: 'None here' } })
    expect(w.find('[data-empty]').text()).toBe('None here')
  })

  it('emits more from the Load more button, disabled while busy', async () => {
    const w = mount(PynPeopleList, { props: { people, more: true } })
    await w.find('button').trigger('click')
    expect(w.emitted('more')).toHaveLength(1)
    await w.setProps({ busy: true })
    expect(w.find('button').attributes('disabled')).toBeDefined()
    expect(mount(PynPeopleList, { props: { people } }).find('button').exists()).toBe(false)
  })
})

describe('PynPeopleSearch', () => {
  it('emits search on submit and clears', async () => {
    const w = mount(PynPeopleSearch)
    expect(w.find('input').attributes('maxlength')).toBe('64')
    expect(w.find('button').exists()).toBe(false)
    await w.find('input').setValue('  ali ')
    await w.find('form').trigger('submit')
    expect(w.emitted('search')?.[0]).toEqual(['ali'])
    await w.find('button').trigger('click')
    expect(w.emitted('search')?.[1]).toEqual([''])
    expect((w.find('input').element as HTMLInputElement).value).toBe('')
  })
})

describe('signed-out top bar', () => {
  it('shows a sign-in link and no account or create menus', () => {
    const w = mount(PynTopBar, { props: { signedOut: true, theme: 'light' } })
    expect(w.find('[data-sign-in]').attributes('href')).toBe('/_/sign-in')
    expect(w.find('[role="search"]').exists()).toBe(false)
    expect(w.text()).toContain('Theme')
    expect(w.text()).not.toContain('Create')
  })

  it('takes a custom sign-in link and renders in the shell', () => {
    const w = mount(PynShell, {
      props: { bare: true },
      slots: { top: '<div id="t"></div>' },
    })
    expect(w.find('#t').exists()).toBe(true)
    const bar = mount(PynTopBar, { props: { signedOut: true, theme: 'dark', signInHref: '/in' } })
    expect(bar.find('[data-sign-in]').attributes('href')).toBe('/in')
  })
})
