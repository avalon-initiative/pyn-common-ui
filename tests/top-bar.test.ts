import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { PynShell, PynTopBar, countText, ownerItems } from '../src'
import { owners } from '../src/stories/dashboard-data'

const base = { user: 'alice', theme: 'system' as const, owners }
const tick = () => new Promise((r) => setTimeout(r))
const mounted: ReturnType<typeof mount>[] = []
const make = (props: Record<string, unknown> = {}) => {
  const w = mount(PynTopBar, { props: { ...base, ...props }, attachTo: document.body })
  mounted.push(w)
  return w
}
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()))

const trigger = (w: ReturnType<typeof mount>, label: string) =>
  w.find(`button[aria-label^="${label}"]`)
const key = (el: Element | null | undefined, k: string) =>
  (el as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }))

describe('top bar counts', () => {
  it('caps the display at 99+ and hides zero', () => {
    expect(countText(0)).toBe('')
    expect(countText(undefined)).toBe('')
    expect(countText(7)).toBe('7')
    expect(countText(100)).toBe('99+')
  })

  it('shows the locks pill with hidden text, and hides it at zero', () => {
    expect(make({ locksHeld: 0 }).find('[data-locks]').exists()).toBe(false)
    const w = make({ locksHeld: 150 })
    const pill = w.find('[data-locks]')
    expect(pill.attributes('href')).toBe('/_/locks')
    expect(pill.text()).toContain('99+')
    expect(pill.text()).toContain('150 locks held')
    expect(make({ locksHeld: 1 }).find('[data-locks]').text()).toContain('1 lock held')
  })

  it('marks locks that expire soon in text, not only colour', () => {
    const w = make({ locksHeld: 2, locksExpiring: true })
    expect(w.find('[data-locks]').text()).toContain('one expires soon')
    expect(w.find('[data-locks]').attributes('data-expiring')).toBeDefined()
  })

  it('keeps the bell at zero and counts notifications in hidden text', () => {
    const none = make({ notifications: 0 })
    expect(none.find('[data-bell]').exists()).toBe(true)
    expect(none.find('[data-badge]').exists()).toBe(false)
    expect(none.find('[data-bell]').text()).toBe('Notifications')
    const w = make({ notifications: 2 })
    expect(w.find('[data-badge]').text()).toBe('2')
    expect(w.find('[data-bell]').text()).toContain('2 notifications')
  })

  it('takes destinations from the hrefs prop', () => {
    const w = make({ locksHeld: 1, hrefs: { locks: '/me/locks', home: '/home' } })
    expect(w.find('[data-locks]').attributes('href')).toBe('/me/locks')
    expect(w.find('a[href="/home"]').text()).toBe('PYN')
  })
})

describe('top bar structure', () => {
  it('puts the skip link first and targets the shell main content', () => {
    const w = make()
    const first = w.find('a')
    expect(first.attributes('data-skip')).toBeDefined()
    expect(first.attributes('href')).toBe('#pyn-main')
    const shell = mount(PynShell, { slots: { top: '<div/>', default: 'x' } })
    expect(shell.find('main#pyn-main').exists()).toBe(true)
  })

  it('names every control', () => {
    const w = make({ locksHeld: 1, notifications: 1 })
    const controls = w.findAll('button, a, input')
    for (const c of controls) {
      const name = c.attributes('aria-label') ?? c.text()
      expect(name.trim(), c.html()).not.toBe('')
    }
  })

  it('shows the signed-in owner and the owner switcher entries', async () => {
    const w = make({ currentOwner: 'studio' })
    expect(w.find('[data-owner]').text()).toBe('studio')
    await trigger(w, 'Switch owner').trigger('click')
    const links = w.findAll('[role=menu] a[role=menuitem]')
    expect(links.map((l) => l.attributes('href'))).toEqual([
      '/alice',
      '/studio',
      '/modding-club',
      '/_/new-org',
    ])
    expect(w.find('[aria-current="true"]').text()).toContain('studio')
    expect(w.text()).toContain('Create an organization')
  })

  it('builds owner items without organizations', () => {
    const items = ownerItems([{ name: 'alice', kind: 'user' }], 'alice', '/n')
    expect(items.some((i) => i.id === 'h-orgs')).toBe(false)
  })

  it('lists the create menu links', async () => {
    const w = make()
    await trigger(w, 'Create').trigger('click')
    expect(w.findAll('[role=menu] a').map((a) => a.attributes('href'))).toEqual([
      '/_/new',
      '/_/new-org',
    ])
  })

  it('lists profile, settings and sign out, and administration only for administrators', async () => {
    const w = make()
    await trigger(w, 'Account menu').trigger('click')
    expect(w.find('[role=menu]').text()).not.toContain('Server administration')
    expect(w.find('[role=menu] a[href="/alice"]').exists()).toBe(true)
    await w.setProps({ admin: true })
    expect(w.find('[role=menu] a[href="/_/admin"]').exists()).toBe(true)
  })

  it('emits sign out and theme from the account menu', async () => {
    const w = make()
    await trigger(w, 'Account menu').trigger('click')
    const items = w.findAll('[role=menu] button')
    await items.find((b) => b.text().includes('Dark'))!.trigger('click')
    expect(w.emitted('theme')?.[0]).toEqual(['dark'])
    await trigger(w, 'Account menu').trigger('click')
    await w
      .findAll('[role=menu] button')
      .find((b) => b.text().includes('Sign out'))!
      .trigger('click')
    expect(w.emitted('signOut')).toHaveLength(1)
  })

  it('offers brand, search and sign in when signed out', () => {
    const w = make({ signedOut: true, user: undefined })
    expect(w.find('[role=search]').exists()).toBe(true)
    expect(w.find('[data-sign-in]').exists()).toBe(true)
    expect(w.find('[data-owner]').exists()).toBe(false)
    expect(w.find('[data-locks]').exists()).toBe(false)
    expect(make({ signedOut: true, showSearch: false }).find('[role=search]').exists()).toBe(false)
  })
})

describe('top bar shortcuts and explore', () => {
  const pickItem = (w: ReturnType<typeof mount>, text: string) =>
    w
      .findAll('[role=menu] [role=menuitem]')
      .find((b) => b.text().includes(text))!
      .trigger('click')

  it('emits shortcuts from the account menu', async () => {
    const w = make()
    await trigger(w, 'Account menu').trigger('click')
    await pickItem(w, 'Keyboard shortcuts')
    expect(w.emitted('shortcuts')).toHaveLength(1)
  })

  it('emits shortcuts from the navigation drawer', async () => {
    const w = make()
    await trigger(w, 'Open navigation').trigger('click')
    await w
      .findAll('nav[aria-label="Main"] button')
      .find((b) => b.text().includes('Keyboard shortcuts'))!
      .trigger('click')
    expect(w.emitted('shortcuts')).toHaveLength(1)
  })

  it('links Explore in the signed-out bar and narrow menu, with an override', async () => {
    const w = make({ signedOut: true, user: undefined })
    expect(w.find('[data-explore]').attributes('href')).toBe('/_/explore')
    await trigger(w, 'Open navigation').trigger('click')
    expect(w.find('nav a[href="/_/explore"]').text()).toBe('Explore')
    const o = make({ signedOut: true, user: undefined, hrefs: { explore: '/pub' } })
    expect(o.find('[data-explore]').attributes('href')).toBe('/pub')
  })

  it('shows Explore in the signed-in wide bar and narrow menu, once', async () => {
    const w = make({ extraLinks: [{ id: 'x', label: 'Discover', href: '/_/explore' }] })
    expect(w.find('[data-explore]').attributes('href')).toBe('/_/explore')
    await trigger(w, 'Open navigation').trigger('click')
    expect(w.findAll('nav a[href="/_/explore"]')).toHaveLength(1)
    expect(
      make({ hrefs: { explore: '/pub' } })
        .find('[data-explore]')
        .attributes('href'),
    ).toBe('/pub')
  })

  it('keeps other extra links beside Explore', async () => {
    const w = make({ extraLinks: [{ id: 'docs', label: 'Docs', href: '/docs' }] })
    await trigger(w, 'Open navigation').trigger('click')
    expect(w.find('nav a[href="/docs"]').exists()).toBe(true)
  })
})

describe('top bar menus follow the menu button pattern', () => {
  it('exposes haspopup and expanded', async () => {
    const w = make()
    const t = trigger(w, 'Create')
    expect(t.attributes('aria-haspopup')).toBe('menu')
    expect(t.attributes('aria-expanded')).toBe('false')
    await t.trigger('click')
    expect(t.attributes('aria-expanded')).toBe('true')
  })

  it('opens with ArrowDown, moves with arrows, Home and End, and wraps', async () => {
    const w = make({ admin: true })
    const t = trigger(w, 'Account menu')
    key(t.element, 'ArrowDown')
    await tick()
    const items = () => w.findAll('[role^=menuitem]').map((i) => i.element)
    expect(document.activeElement).toBe(items()[0])
    key(document.activeElement, 'ArrowDown')
    expect(document.activeElement).toBe(items()[1])
    key(document.activeElement, 'End')
    expect(document.activeElement).toBe(items().at(-1))
    key(document.activeElement, 'ArrowDown')
    expect(document.activeElement).toBe(items()[0])
    key(document.activeElement, 'ArrowUp')
    expect(document.activeElement).toBe(items().at(-1))
    key(document.activeElement, 'Home')
    expect(document.activeElement).toBe(items()[0])
  })

  it('opens on the last item with ArrowUp', async () => {
    const w = make()
    key(trigger(w, 'Create').element, 'ArrowUp')
    await tick()
    expect(document.activeElement).toBe(w.findAll('[role^=menuitem]').at(-1)!.element)
  })

  it('closes with Escape and returns focus to the button', async () => {
    const w = make()
    const t = trigger(w, 'Create')
    await t.trigger('click')
    await tick()
    key(document.activeElement, 'Escape')
    await tick()
    expect(w.find('[role=menu]').exists()).toBe(false)
    expect(document.activeElement).toBe(t.element)
  })

  it('closes on an outside click', async () => {
    const w = make()
    await trigger(w, 'Create').trigger('click')
    document.body.click()
    await tick()
    expect(w.find('[role=menu]').exists()).toBe(false)
  })
})

describe('top bar search', () => {
  it('emits input as typed and search on Enter', async () => {
    const w = make()
    const input = w.find('input[type=search]')
    await input.setValue('cas')
    expect(w.emitted('input')?.at(-1)).toEqual(['cas'])
    await w.find('form').trigger('submit')
    expect(w.emitted('search')?.[0]).toEqual(['cas'])
  })

  it('opens a matching repository from the old repos prop', async () => {
    const w = make({ repos: ['alice/game', 'bob/tools'] })
    await w.find('input').setValue('bob')
    await w.find('form').trigger('submit')
    expect(w.emitted('open')?.[0]).toEqual(['bob/tools'])
    expect(w.emitted('search')).toBeUndefined()
  })

  it('focuses the search with / outside inputs only', async () => {
    const w = make()
    const input = w.find('input').element as HTMLInputElement
    const other = document.createElement('textarea')
    document.body.append(other)
    other.focus()
    key(other, '/')
    expect(document.activeElement).toBe(other)
    document.body.focus()
    const e = new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true })
    document.body.dispatchEvent(e)
    await tick()
    expect(e.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(input)
    other.remove()
  })

  it('shows the / hint to assistive technology as hidden and offers a search button when narrow', () => {
    const w = make()
    expect(w.find('kbd').attributes('aria-hidden')).toBe('true')
    expect(w.find('input').attributes('aria-keyshortcuts')).toBe('/')
    expect(trigger(w, 'Search').attributes('aria-expanded')).toBe('false')
  })

  it('opens the narrow search with the button and closes it on Escape', async () => {
    const w = make()
    const button = trigger(w, 'Search')
    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(w.find('input').element)
    await w.find('form').trigger('keydown', { key: 'Escape' })
    expect(button.attributes('aria-expanded')).toBe('false')
  })
})

describe('top bar navigation drawer', () => {
  it('lists the global links', async () => {
    const w = make({ notifications: 4, locksHeld: 1 })
    await trigger(w, 'Open navigation').trigger('click')
    const text = w.find('nav[aria-label="Main"]').text()
    for (const t of ['Dashboard', 'Repositories', 'Your locks', 'New repository']) {
      expect(text).toContain(t)
    }
  })

  it('lists sign in and theme choices when signed out', async () => {
    const w = make({ signedOut: true, user: undefined })
    await trigger(w, 'Open navigation').trigger('click')
    const menu = w.find('nav[aria-label="Main"]')
    expect(menu.find('a[href="/_/sign-in"]').exists()).toBe(true)
    expect(menu.text()).toContain('Dark theme')
  })
})

describe('top bar named destinations', () => {
  const hrefsIn = (w: ReturnType<typeof mount>) =>
    w.findAll('[role=menu] a[role=menuitem], nav a').map((a) => a.attributes('href'))

  it('shows People and Organizations in the account menu and the narrow main menu', async () => {
    const w = make()
    await trigger(w, 'Account menu').trigger('click')
    expect(hrefsIn(w)).toEqual(expect.arrayContaining(['/_/people', '/_/orgs']))
    document.body.click()
    await tick()
    await trigger(w, 'Open navigation').trigger('click')
    expect(hrefsIn(w)).toEqual(expect.arrayContaining(['/_/people', '/_/orgs']))
    expect(w.find('nav').text()).toContain('People')
    expect(w.find('nav').text()).toContain('Organizations')
  })

  it('takes the destinations from hrefs', async () => {
    const w = make({ hrefs: { people: '/p', orgs: '/o' } })
    await trigger(w, 'Open navigation').trigger('click')
    expect(hrefsIn(w)).toEqual(expect.arrayContaining(['/p', '/o']))
    expect(hrefsIn(w)).not.toContain('/_/people')
  })

  it('shows an extraAccount entry with a named href once', async () => {
    const w = make({
      extraAccount: [
        { id: 'people', label: 'People', href: '/_/people' },
        { id: 'docs', label: 'Documentation', href: '/docs' },
      ],
    })
    await trigger(w, 'Account menu').trigger('click')
    const hrefs = hrefsIn(w)
    expect(hrefs.filter((h) => h === '/_/people')).toHaveLength(1)
    expect(hrefs).toContain('/docs')
  })

  it('lists extraLinks in the drawer only, without repeating a named one', async () => {
    const w = make({
      extraLinks: [
        { id: 'docs', label: 'Documentation', href: '/docs' },
        { id: 'orgs2', label: 'Orgs', href: '/_/orgs' },
      ],
    })
    await trigger(w, 'Open navigation').trigger('click')
    const hrefs = hrefsIn(w)
    expect(hrefs).toContain('/docs')
    expect(hrefs.filter((h) => h === '/_/orgs')).toHaveLength(1)
    await w.find('button[aria-label="Close"]').trigger('click')
    await tick()
    await trigger(w, 'Account menu').trigger('click')
    expect(hrefsIn(w)).not.toContain('/docs')
  })
})
