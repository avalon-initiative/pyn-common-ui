import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { PynBranchBar, PynBranchPicker, PynCloneMenu, PynRepoShell, PynTabs } from '../src'

const mounted: ReturnType<typeof mount>[] = []
const make = ((c: object, o: object) => {
  const w = mount(c as never, { attachTo: document.body, ...o })
  mounted.push(w)
  return w
}) as typeof mount
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()))

const tabs = [
  { section: '', label: 'Code' },
  { section: 'locks', label: 'Locks' },
  { section: 'settings', label: 'Settings' },
]
const shell = { owner: 'a', name: 'b', visibility: 'private' as const }

describe('PynTabs icons and reserved counts', () => {
  const items = [
    { label: 'Code', href: '/c', current: true, icon: 'code' },
    { label: 'Locks', href: '/l', icon: 'lock', reserveCount: true },
  ]

  it('shows icons only when every tab has one', () => {
    expect(make(PynTabs, { props: { items, label: 'T' } }).findAll('svg')).toHaveLength(2)
    const some = [items[0]!, { label: 'Locks', href: '/l' }]
    expect(
      make(PynTabs, { props: { items: some, label: 'T' } })
        .find('svg')
        .exists(),
    ).toBe(false)
  })

  it('holds the count space without announcing it, and drops it once the count shows', () => {
    const w = make(PynTabs, { props: { items, label: 'T' } })
    const pill = w.findAll('a')[1]!.find('span[aria-hidden=true]')
    expect(pill.exists()).toBe(true)
    expect(w.find('[data-count]').exists()).toBe(false)
    expect(w.findAll('a')[1]!.text()).toBe('Locks')
    const counted = make(PynTabs, {
      props: { items: [{ ...items[1]!, count: 2 }], label: 'T' },
    })
    expect(counted.find('[data-count]').text()).toBe('2')
  })

  it('marks only the current tab as the page and underlines its item', () => {
    const w = make(PynTabs, { props: { items, label: 'T' } })
    expect(w.findAll('a').map((a) => a.attributes('aria-current'))).toEqual(['page', undefined])
    expect(w.findAll('li')[0]!.classes().length).toBeGreaterThan(
      w.findAll('li')[1]!.classes().length,
    )
  })
})

describe('PynRepoShell header band', () => {
  it('gives each tab the icon of its section', () => {
    const w = make(PynRepoShell, { props: { ...shell, tabs } })
    expect(w.findAll('nav[aria-label=Repository] a svg')).toHaveLength(3)
  })

  it('renders the watch, fork, star and actions slots in that order on the right', () => {
    const w = make(PynRepoShell, {
      props: shell,
      slots: {
        actions: '<i>clone</i>',
        star: '<i>star</i>',
        watch: '<i>watch</i>',
        fork: '<i>fork</i>',
      },
    })
    expect(w.find('header > div > div:last-child').text()).toBe('watchforkstarclone')
  })

  it('shows the owner avatar and the repository link, and the owner link with showOwner', () => {
    const w = make(PynRepoShell, { props: shell })
    const nav = w.find('nav[aria-label="Repository path"]')
    expect(nav.find('[role=img]').attributes('aria-label')).toBe("a's avatar")
    expect(nav.findAll('a').map((a) => a.attributes('href'))).toEqual(['/a/b'])
    const full = make(PynRepoShell, { props: { ...shell, showOwner: true } })
    expect(
      full.findAll('nav[aria-label="Repository path"] a').map((a) => a.attributes('href')),
    ).toEqual(['/a', '/a/b'])
  })

  it('reserves the lock strip and the Locks count while pending, and nothing otherwise', () => {
    const pending = make(PynRepoShell, { props: { ...shell, tabs, lockPending: true } })
    const hold = pending.find('[data-lock-pending]')
    expect(hold.attributes('aria-hidden')).toBe('true')
    expect(pending.find('[data-lock-strip]').exists()).toBe(false)
    expect(
      pending.findAll('nav[aria-label=Repository] a')[1]!.find('[aria-hidden=true]').exists(),
    ).toBe(true)
    const done = make(PynRepoShell, {
      props: { ...shell, tabs, lockPending: false, lockedCount: 0 },
    })
    expect(done.find('[data-lock-pending]').exists()).toBe(false)
    const loaded = make(PynRepoShell, {
      props: { ...shell, tabs, lockPending: true, lockedCount: 2 },
    })
    expect(loaded.find('[data-lock-pending]').exists()).toBe(false)
    expect(loaded.find('[data-lock-strip]').exists()).toBe(true)
  })
})

describe('PynBranchBar toolbar', () => {
  const branches = [{ name: 'main', isDefault: true }, { name: 'dev' }]

  it('keeps the static label without branches and the old meta text', () => {
    const w = make(PynBranchBar, { props: { branch: 'main', files: 2, updatedAt: null } })
    expect(w.findComponent(PynBranchPicker).exists()).toBe(false)
    expect(w.text()).toContain('2 files')
  })

  it('shows no file meta in the toolbar form', () => {
    const w = make(PynBranchBar, { props: { branch: 'main', branches } })
    expect(w.text()).not.toContain('files')
    expect(w.text()).not.toContain('No revisions yet')
  })

  it('renders the picker, the branches link with its count and the slots', () => {
    const w = make(PynBranchBar, {
      props: { branch: 'main', branches, branchesHref: '/a/b/branches', branchCount: 2 },
      slots: { default: '<nav>crumbs</nav>', actions: '<button>Clone</button>' },
    })
    expect(w.findComponent(PynBranchPicker).props('current')).toBe('main')
    const link = w.find('[data-branches-link]')
    expect(link.attributes('href')).toBe('/a/b/branches')
    expect(link.text()).toBe('2 Branches')
    expect(w.text()).toContain('crumbs')
    expect(w.findAll('button').at(-1)!.text()).toBe('Clone')
  })

  it('uses the singular and keeps the link while the count is unknown', () => {
    const one = make(PynBranchBar, { props: { branch: 'm', branchesHref: '/x', branchCount: 1 } })
    expect(one.find('[data-branches-link]').text()).toBe('1 Branch')
    const wait = make(PynBranchBar, { props: { branch: 'm', branchesHref: '/x' } })
    expect(wait.find('[data-branches-link] strong').text()).toBe('')
  })

  it('forwards the selected branch', async () => {
    const w = make(PynBranchBar, { props: { branch: 'main', branches } })
    await w.find('button').trigger('click')
    await w.findAll('[role=option]')[1]!.trigger('click')
    expect(w.emitted('select')).toEqual([['dev', 'branch']])
  })
})

describe('PynBranchPicker panel', () => {
  const branches = [{ name: 'main', isDefault: true }, { name: 'dev' }]
  const props = { branches, current: 'main' }

  it('has a Switch branches heading naming the group and a check on the current branch only', async () => {
    const w = make(PynBranchPicker, { props })
    await w.find('button').trigger('click')
    const group = w.find('[role=group]')
    const title = w.find(`#${group.attributes('aria-labelledby')}`)
    expect(title.text()).toBe('Switch branches/tags')
    const opts = w.findAll('[role=option]')
    expect(opts[0]!.find('svg').exists()).toBe(true)
    expect(opts[1]!.find('svg').exists()).toBe(false)
  })

  it('closes from the close button and returns focus to the trigger', async () => {
    const w = make(PynBranchPicker, { props })
    await w.find('button').trigger('click')
    await w.find('button[aria-label=Close]').trigger('click')
    expect(w.find('[role=listbox]').exists()).toBe(false)
    expect(document.activeElement).toBe(w.find('button').element)
  })

  it('links to all branches and leaves Tab to the browser, closing only when focus leaves', async () => {
    const w = make(PynBranchPicker, { props: { ...props, allHref: '/a/b/branches' } })
    await w.find('button').trigger('click')
    expect(w.find('a').attributes('href')).toBe('/a/b/branches')
    await w.find('input').trigger('keydown', { key: 'Tab' })
    expect(w.find('[role=listbox]').exists()).toBe(true)
    const plain = make(PynBranchPicker, { props })
    await plain.find('button').trigger('click')
    expect(plain.find('a').exists()).toBe(false)
  })

  it('switches between Branches and Tags, the latter showing the not-supported state', async () => {
    const w = make(PynBranchPicker, { props })
    await w.find('button').trigger('click')
    const tabs = w.findAll('[role=tab]')
    expect(tabs.map((t) => t.text())).toEqual(['Branches', 'Tags'])
    expect(tabs[0]!.attributes('aria-selected')).toBe('true')
    await tabs[1]!.trigger('click')
    expect(w.find('[role=listbox]').exists()).toBe(false)
    expect(w.text()).toContain('Tags are not supported yet')
    await tabs[0]!.trigger('click')
    expect(w.findAll('[role=option]')).toHaveLength(2)
  })

  it('offers a create row for an unknown name only when creatable, and emits it', async () => {
    const plain = make(PynBranchPicker, { props })
    await plain.find('button').trigger('click')
    await plain.find('input').setValue('feature/x')
    expect(plain.find('[data-create]').exists()).toBe(false)
    const w = make(PynBranchPicker, { props: { ...props, creatable: true } })
    await w.find('button').trigger('click')
    await w.find('input').setValue('dev')
    expect(w.find('[data-create]').exists()).toBe(false)
    await w.find('input').setValue('feature/x')
    expect(w.find('[data-create]').text()).toContain('feature/x')
    await w.find('input').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('create')).toEqual([['feature/x']])
    expect(w.find('[role=listbox]').exists()).toBe(false)
  })

  it('closes when focus leaves the picker', async () => {
    const w = make(PynBranchPicker, { props })
    await w.find('button').trigger('click')
    const outside = document.createElement('button')
    document.body.append(outside)
    await w.find('input').trigger('focusout', { relatedTarget: outside })
    expect(w.find('[role=listbox]').exists()).toBe(false)
    outside.remove()
  })
})

describe('PynCloneMenu variant', () => {
  const props = { httpsUrl: 'https://h/a/b', command: 'pyn clone a/b' }

  it('is the filled call to action by default and neutral on request', () => {
    const primary = make(PynCloneMenu, { props })
    const neutral = make(PynCloneMenu, { props: { ...props, variant: 'default' } })
    expect(primary.find('button').classes().length).toBe(2)
    expect(neutral.find('button').classes().length).toBe(1)
    expect(primary.find('button').text()).toBe('Code')
  })
})
