import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  PynBranchBar,
  PynCommandBlock,
  PynLockedFiles,
  PynQuickSetup,
  PynReadme,
  PynRepoAbout,
  PynRepoLanding,
  PynRepoShell,
  PynRepoSocial,
} from '../src'

const mounted: ReturnType<typeof mount>[] = []
const make = ((c: object, o: object) => {
  const w = mount(c as never, { attachTo: document.body, ...o })
  mounted.push(w)
  return w
}) as typeof mount
afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount())
  vi.unstubAllGlobals()
})

const shell = { owner: 'a', name: 'b', visibility: 'public' as const }

describe('PynRepoSocial', () => {
  it('renders nothing without a member and only the members given', () => {
    expect(make(PynRepoSocial, { props: {} }).find('[role=group]').exists()).toBe(false)
    const w = make(PynRepoSocial, { props: { watch: { count: 2 }, star: { count: 0 } } })
    expect(w.findAll('[data-kind]').map((e) => e.attributes('data-kind'))).toEqual([
      'watch',
      'star',
    ])
    expect(w.find('[data-kind=watch]').text()).toBe('Watch2')
  })

  it('reads Watching and Starred when active, with aria-pressed', () => {
    const w = make(PynRepoSocial, {
      props: {
        watch: { count: 1, active: true },
        star: { count: 3, active: true },
        fork: { count: 0 },
      },
    })
    expect(w.find('[data-kind=watch] button').text()).toContain('Watching')
    expect(w.find('[data-kind=star] button').text()).toContain('Starred')
    expect(w.find('[data-kind=star] button').attributes('aria-pressed')).toBe('true')
    expect(w.find('[data-kind=fork] button').attributes('aria-pressed')).toBeUndefined()
  })

  it('emits press and the caret menu choice', async () => {
    const w = make(PynRepoSocial, {
      props: { star: { count: 1, menu: [{ id: 'list', label: 'Add to list' }] } },
    })
    await w.find('[data-kind=star] button').trigger('click')
    expect(w.emitted('press')).toEqual([['star']])
    await w.find('button[aria-label="Star options"]').trigger('click')
    await w.find('[role=menuitem]').trigger('click')
    expect(w.emitted('menu')).toEqual([['star', 'list']])
  })

  it('has no caret without menu items and disables a disabled button', () => {
    const w = make(PynRepoSocial, { props: { fork: { count: 1, disabled: true } } })
    expect(w.find('[aria-haspopup=menu]').exists()).toBe(false)
    expect(w.find('button').attributes('disabled')).toBeDefined()
  })
})

describe('PynRepoShell title row', () => {
  it('shows avatar and name, with the owner link only on request', () => {
    const w = make(PynRepoShell, { props: { ...shell, ownerAvatarUrl: '/me.png' } })
    expect(w.find('h1 img').attributes('src')).toBe('/me.png')
    expect(w.find('h1').text()).toContain('b')
    expect(w.find('h1 a[href="/a"]').exists()).toBe(false)
  })

  it('renders the social group from props and forwards its events', async () => {
    const w = make(PynRepoShell, {
      props: { ...shell, social: { watch: { count: 0 }, star: { count: 4 } } },
    })
    expect(w.find('[role=group]').exists()).toBe(true)
    await w.find('[data-kind=star] button').trigger('click')
    expect(w.emitted('social')).toEqual([['star']])
  })

  it('has no actions container without the group or slots', () => {
    const w = make(PynRepoShell, { props: shell })
    expect(w.find('[role=group]').exists()).toBe(false)
    expect(w.find('header > div > div').exists()).toBe(false)
  })
})

describe('PynBranchBar tags and Go to file', () => {
  const props = { branch: 'main', branchesHref: '/a/b/branches', branchCount: 1 }

  it('shows nothing by default', () => {
    const w = make(PynBranchBar, { props })
    expect(w.find('[data-tags-link]').exists()).toBe(false)
    expect(w.find('[data-tags-unsupported]').exists()).toBe(false)
    expect(w.text()).not.toContain('Go to file')
  })

  it('shows a not-supported placeholder for tags without a link', () => {
    const w = make(PynBranchBar, { props: { ...props, showTags: true } })
    const tags = w.find('[data-tags-unsupported]')
    expect(tags.element.tagName).toBe('SPAN')
    expect(tags.attributes('title')).toBe('Tags are not supported yet')
    expect(tags.text()).toContain('Not supported yet')
  })

  it('links the tags count when a link is given', () => {
    const w = make(PynBranchBar, {
      props: { ...props, showTags: true, tagsHref: '/a/b/tags', tagCount: 9 },
    })
    expect(w.find('[data-tags-link]').attributes('href')).toBe('/a/b/tags')
    expect(w.find('[data-tags-link]').text()).toBe('9 Tags')
  })

  it('emits goToFile from its button', async () => {
    const w = make(PynBranchBar, { props: { ...props, goToFile: true } })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Go to file')!
      .trigger('click')
    expect(w.emitted('goToFile')).toHaveLength(1)
  })
})

describe('PynCommandBlock', () => {
  it('copies the commands without comment lines', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const w = make(PynCommandBlock, {
      props: { lines: ['# note', 'pyn add .', 'pyn push'], label: 'steps' },
    })
    expect(w.find('pre').text()).toBe('# note\npyn add .\npyn push')
    await w.find('button[aria-label="Copy steps"]').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('pyn add .\npyn push')
    expect(w.emitted('copy')).toEqual([['pyn add .\npyn push']])
    expect(w.find('[role=status]').text()).toBe('Copied')
  })

  it('reports a failed copy', async () => {
    vi.stubGlobal('navigator', {})
    document.execCommand = () => false
    const w = make(PynCommandBlock, { props: { lines: ['pyn push'], label: 'steps' } })
    await w.find('button').trigger('click')
    await flushPromises()
    expect(w.find('[role=status]').text()).toBe('Could not copy')
    expect(w.emitted('copy')).toBeUndefined()
  })
})

describe('PynQuickSetup', () => {
  const props = { name: 'game', command: 'pyn clone a/game', httpsUrl: 'https://h/a/game.pyn' }

  it('shows the HTTPS address with a copy button and pyn command blocks', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const w = make(PynQuickSetup, { props })
    expect((w.find('input').element as HTMLInputElement).value).toBe(props.httpsUrl)
    await w.find('button[aria-label="Copy HTTPS address"]').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith(props.httpsUrl)
    expect(w.emitted('copy')).toEqual([['https', props.httpsUrl]])
    const blocks = w.findAllComponents(PynCommandBlock)
    expect(blocks).toHaveLength(2)
    expect(blocks[0]!.text()).toContain('pyn clone a/game')
    expect(blocks[0]!.text()).toContain('pyn push')
    expect(blocks[1]!.text()).toContain('pyn lock <path>')
    expect(w.text()).not.toContain('git ')
  })

  it('says SSH is not supported yet unless an address is given', async () => {
    const w = make(PynQuickSetup, { props })
    await w.findAll('[role=tab]')[1]!.trigger('click')
    expect(w.find('[data-ssh-unsupported]').text()).toBe(
      'SSH is not supported yet by pyn. Please try again next release.',
    )
    expect(w.find('input').exists()).toBe(false)
    const ssh = make(PynQuickSetup, { props: { ...props, sshUrl: 'ssh://h/a/game' } })
    await ssh.findAll('[role=tab]')[1]!.trigger('click')
    expect((ssh.find('input').element as HTMLInputElement).value).toBe('ssh://h/a/game')
    await ssh.find('[role=tablist]').trigger('keydown', { key: 'ArrowLeft' })
    expect(ssh.find('[role=tab][aria-selected=true]').text()).toBe('HTTPS')
  })

  it('drops the address row without httpsUrl', () => {
    const w = make(PynQuickSetup, { props: { name: 'game' } })
    expect(w.find('[role=tablist]').exists()).toBe(false)
    expect(w.text()).toContain('pyn clone <server>/<owner>/game')
  })
})

describe('PynReadme tabs', () => {
  const readme = { name: 'README.md', path: 'README.md', text: '# Hi' }
  const base = { owner: 'a', name: 'b' }

  it('shows a single README tab and the file link', () => {
    const w = make(PynReadme, { props: { ...base, readme } })
    expect(w.findAll('[role=tab]').map((t) => t.text())).toEqual(['README'])
    expect(w.find('header a').attributes('href')).toBe('/a/b/blob/README.md')
    expect(w.find('[role=tabpanel] h1').text()).toBe('Hi')
  })

  it('switches documents with a click or the arrow keys', async () => {
    const others = [{ name: 'CONTRIBUTING.md', path: 'CONTRIBUTING.md', text: '# Help' }]
    const w = make(PynReadme, { props: { ...base, readme, others } })
    expect(w.findAll('[role=tab]').map((t) => t.text())).toEqual(['README', 'CONTRIBUTING'])
    await w.findAll('[role=tab]')[1]!.trigger('click')
    expect(w.find('[role=tabpanel] h1').text()).toBe('Help')
    expect(w.find('header a').attributes('href')).toBe('/a/b/blob/CONTRIBUTING.md')
    await w.find('[role=tablist]').trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()
    expect(w.find('[role=tab][aria-selected=true]').text()).toBe('README')
    expect(document.activeElement).toBe(w.findAll('[role=tab]')[0]!.element)
  })
})

describe('PynRepoAbout', () => {
  it('shows placeholders for a missing description and topics', () => {
    const w = make(PynRepoAbout, { props: {} })
    expect(w.text()).toContain('No description provided')
    expect(w.find('[data-topics-unsupported]').exists()).toBe(true)
    expect(w.find('[aria-label="Repository activity"]').exists()).toBe(false)
  })

  it('shows topics instead of the placeholder and nothing for an empty list', () => {
    const w = make(PynRepoAbout, { props: { topics: ['unreal'] } })
    expect(w.find('[aria-label=Topics]').text()).toBe('unreal')
    expect(w.find('[data-topics-unsupported]').exists()).toBe(false)
    const none = make(PynRepoAbout, { props: { topics: [] } })
    expect(none.find('[data-topics-unsupported]').exists()).toBe(false)
  })

  it('shows only the counts given, with singular units', () => {
    const w = make(PynRepoAbout, { props: { stars: 1, forks: 0 } })
    expect(w.findAll('li').map((l) => l.text())).toEqual(['1 star', '0 forks'])
  })
})

describe('PynLockedFiles', () => {
  const lock = (path: string, expires_at: string) => ({
    path,
    owner: 'jamie',
    acquired_at: '2026-10-08T08:00:00Z',
    expires_at,
  })

  it('lists the soonest to expire first, capped, with the total on View all', () => {
    const locks = [
      lock('c', '2026-10-08T15:00:00Z'),
      lock('a', '2026-10-08T13:00:00Z'),
      lock('b', '2026-10-08T14:00:00Z'),
    ]
    const w = make(PynLockedFiles, {
      props: { locks, owner: 'x', name: 'y', max: 2, now: new Date('2026-10-08T12:00:00Z') },
    })
    expect(w.findAll('li').map((l) => l.text().slice(0, 1))).toEqual(['a', 'b'])
    expect(w.find('a').text()).toBe('View all (3)')
  })
})

describe('PynRepoLanding page layout', () => {
  const repo = {
    id: '1',
    owner_id: 'o',
    owner: 'a',
    name: 'b',
    visibility: 'public' as const,
    lease_hours: 8,
    created_at: '2026-10-01T00:00:00Z',
  }
  const summary = {
    default_branch: 'main',
    files: 1,
    exclusive_files: 0,
    shared_files: 1,
    locks: [],
    activity: [],
  }
  const entries = [{ name: 'a.txt', path: 'a.txt', kind: 'file' as const, mode: 'shared' as const }]
  const props = { repo, path: '', summary, listing: { path: '', entries } }

  it('renders About above the toolbar and in the rail, and the compare slot under the toolbar', () => {
    const w = make(PynRepoLanding, {
      props: { ...props, about: { description: 'Hi' } },
      slots: { compare: '<p data-compare>ahead</p>' },
    })
    expect(w.findAllComponents(PynRepoAbout)).toHaveLength(2)
    const main = w.find('div > div')
    expect(main.find('section[aria-label=About]').exists()).toBe(true)
    expect(w.find('[data-compare]').exists()).toBe(true)
  })

  it('shows the tags placeholder in the toolbar and hides the toolbar for an empty repository', () => {
    const w = make(PynRepoLanding, {
      props: { ...props, branchesHref: '/a/b/branches', goToFile: true },
    })
    expect(w.find('[data-tags-unsupported]').exists()).toBe(true)
    expect(w.text()).toContain('Go to file')
    const empty = make(PynRepoLanding, {
      props: { ...props, listing: { path: '', entries: [] }, httpsUrl: 'https://h/a/b.pyn' },
    })
    expect(empty.findComponent(PynBranchBar).exists()).toBe(false)
    expect(empty.findComponent(PynQuickSetup).props('httpsUrl')).toBe('https://h/a/b.pyn')
  })
})
