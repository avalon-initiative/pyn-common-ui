import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  PynBranchBar,
  PynBranchPicker,
  PynFileView,
  PynFilesPanel,
  PynHistory,
  PynRepoLanding,
  PynTagDialog,
  PynTagsPage,
  filterTags,
  isCommitId,
  shortCommit,
  tagNameProblem,
} from '../src'
import { tagsPageBranches as branches, tagsPageTags as tags } from '../src/stories/tags-page-data'
import { treeEntries } from '../src/stories/file-data'
import { repo, rootListing, summary } from '../src/stories/landing-data'

const mounted: ReturnType<typeof mount>[] = []
const make = ((c: object, o: object) => {
  const w = mount(c as never, { attachTo: document.body, ...o })
  mounted.push(w)
  return w
}) as typeof mount
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()))

const now = new Date('2026-11-22T12:00:00Z')
const footer = () => [...document.querySelectorAll<HTMLButtonElement>('footer button')]
const type = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  el.value = value
  el.dispatchEvent(new Event('input'))
}

describe('tags state', () => {
  it('refuses names the server would refuse, and taken ones', () => {
    expect(tagNameProblem('', tags)).toBe('')
    expect(tagNameProblem('v1.0.0', tags)).toBe('')
    expect(tagNameProblem('v 1', tags)).not.toBe('')
    expect(tagNameProblem('v1..2', tags)).not.toBe('')
    expect(tagNameProblem('a:b', tags)).not.toBe('')
    expect(tagNameProblem('v0.2.0', tags)).toBe('A tag with this name already exists.')
  })

  it('accepts commit ids of at least four hex digits', () => {
    expect(isCommitId('abc')).toBe(false)
    expect(isCommitId(' d7d7 ')).toBe(true)
    expect(isCommitId('xyz123')).toBe(false)
    expect(shortCommit('d7d76b0c41e2')).toBe('d7d76b0')
  })

  it('filters by name or message', () => {
    expect(filterTags(tags, 'AUDIO').map((t) => t.name)).toEqual(['v0.2.0'])
    expect(filterTags(tags, ' v0.1 ').map((t) => t.name)).toEqual(['v0.1.1'])
    expect(filterTags(tags, '')).toHaveLength(3)
  })
})

describe('PynBranchPicker tags', () => {
  const pickerBranches = [{ name: 'main', isDefault: true }, { name: 'dev' }]
  const pickerTags = [{ name: 'v1.0' }, { name: 'v2.0', createdAt: '2026-11-20T12:00:00Z' }]
  const base = { branches: pickerBranches, current: 'main', now }
  const openTags = async (w: ReturnType<typeof mount>) => {
    await w.find('button').trigger('click')
    await w.find('[data-tab=tags]').trigger('click')
  }

  it('lists tags with a find field and emits the tag with its kind', async () => {
    const w = make(PynBranchPicker, { props: { ...base, tags: pickerTags } })
    await openTags(w)
    expect(w.find('[role=listbox]').attributes('aria-label')).toBe('Tags')
    expect(w.findAll('[role=option]').map((o) => o.text())).toEqual(['v1.0', 'v2.02 days ago'])
    expect(w.find('input').attributes('aria-label')).toBe('Find a tag')
    await w.find('input').setValue('v2')
    await w.find('input').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('select')).toEqual([['v2.0', 'tag']])
  })

  it('emits the branch kind for a branch', async () => {
    const w = make(PynBranchPicker, { props: { ...base, tags: pickerTags } })
    await w.find('button').trigger('click')
    await w.findAll('[role=option]')[1]!.trigger('click')
    expect(w.emitted('select')).toEqual([['dev', 'branch']])
  })

  it('opens on the Tags tab with the check on the current tag', async () => {
    const w = make(PynBranchPicker, {
      props: { ...base, tags: pickerTags, current: 'v1.0', currentKind: 'tag' },
    })
    expect(w.find('button').text()).toContain('Tag:')
    await w.find('button').trigger('click')
    expect(w.find('[data-tab=tags]').attributes('aria-selected')).toBe('true')
    expect(w.find('[role=option][aria-selected=true]').text()).toBe('v1.0')
  })

  it('links to all tags on the Tags tab and all branches on the Branches tab', async () => {
    const w = make(PynBranchPicker, {
      props: { ...base, tags: pickerTags, allHref: '/b', tagsHref: '/t' },
    })
    await w.find('button').trigger('click')
    expect(w.find('a').text()).toBe('View all branches')
    await w.find('[data-tab=tags]').trigger('click')
    expect(w.find('a').attributes('href')).toBe('/t')
    expect(w.find('a').text()).toBe('View all tags')
  })

  it('never offers the create row on the Tags tab', async () => {
    const w = make(PynBranchPicker, { props: { ...base, tags: pickerTags, creatable: true } })
    await openTags(w)
    await w.find('input').setValue('new-tag')
    expect(w.find('[data-create]').exists()).toBe(false)
    expect(w.text()).toContain('No matching tags')
  })

  it('shows loading, error and empty states for tags', async () => {
    const loading = make(PynBranchPicker, { props: { ...base, tags: [], tagsLoading: true } })
    await openTags(loading)
    expect(loading.text()).toContain('Loading tags')
    const failed = make(PynBranchPicker, { props: { ...base, tags: [], tagsError: 'Nope' } })
    await openTags(failed)
    expect(failed.find('[role=alert]').text()).toBe('Nope')
    const empty = make(PynBranchPicker, { props: { ...base, tags: [] } })
    await openTags(empty)
    expect(empty.text()).toContain('No tags yet')
  })

  it('keeps the not-supported state without tags', async () => {
    const w = make(PynBranchPicker, { props: { ...base, allHref: '/b', tagsHref: '/t' } })
    await openTags(w)
    expect(w.text()).toContain('Tags are not supported yet')
    expect(w.find('a').attributes('href')).toBe('/b')
  })
})

describe('branch picker hosts', () => {
  const hostBranches = [{ name: 'main', isDefault: true }, { name: 'dev' }]
  const hostTags = [{ name: 'v1.0' }, { name: 'v2.0' }]
  const tree = { owner: 'acme', name: 'game' }
  const hosts = [
    { label: 'PynBranchBar', c: PynBranchBar, event: 'select', props: { branch: 'v1.0' } },
    {
      label: 'PynRepoLanding',
      c: PynRepoLanding,
      event: 'select',
      props: { repo, path: '', listing: rootListing, summary, branch: 'v1.0' },
    },
    {
      label: 'PynFilesPanel',
      c: PynFilesPanel,
      event: 'selectBranch',
      props: { ...tree, entries: treeEntries, branch: 'v1.0', collapsed: false },
    },
    {
      label: 'PynFileView',
      c: PynFileView,
      event: 'selectBranch',
      props: { ...tree, path: 'a.txt', tree: treeEntries, branch: 'v1.0', collapsed: false },
    },
    {
      label: 'PynHistory',
      c: PynHistory,
      event: 'selectBranch',
      props: { revisions: [], branch: 'v1.0' },
    },
  ]
  const picker = (w: ReturnType<typeof mount>) => w.findComponent(PynBranchPicker)

  it.each(hosts)(
    '$label passes tags through and forwards the kind',
    async ({ c, event, props }) => {
      const w = make(c, {
        props: {
          ...props,
          now,
          branches: hostBranches,
          tags: hostTags,
          tagsHref: '/t',
          currentKind: 'tag',
        },
      })
      await picker(w).find('button').trigger('click')
      expect(picker(w).find('[data-tab=tags]').attributes('aria-selected')).toBe('true')
      expect(picker(w).find('[role=option][aria-selected=true]').text()).toBe('v1.0')
      expect(picker(w).find('a[href="/t"]').text()).toBe('View all tags')
      await picker(w).findAll('[role=option]')[1]!.trigger('click')
      await picker(w).find('button').trigger('click')
      await picker(w).find('[data-tab=branches]').trigger('click')
      await picker(w).findAll('[role=option]')[1]!.trigger('click')
      expect(w.emitted(event)).toEqual([
        ['v2.0', 'tag'],
        ['dev', 'branch'],
      ])
    },
  )

  it.each(hosts)('$label keeps the not-supported Tags tab without tags', async ({ c, props }) => {
    const w = make(c, { props: { ...props, branch: 'main', now, branches: hostBranches } })
    await picker(w).find('button').trigger('click')
    await picker(w).find('[data-tab=tags]').trigger('click')
    expect(picker(w).text()).toContain('Tags are not supported yet')
  })

  it('shows a tag icon on the static label of a tag', () => {
    const w = make(PynBranchBar, { props: { branch: 'v1.0', currentKind: 'tag' } })
    expect(w.text()).toContain('v1.0')
    expect(w.findComponent({ name: 'PynIcon' }).props('name')).toBe('tag')
  })
})

describe('PynTagDialog', () => {
  it('creates a tag on a branch, defaulting to the default branch', async () => {
    const w = make(PynTagDialog, { props: { open: true, mode: 'create', branches, tags } })
    const select = document.querySelector('select')!
    expect(select.value).toBe('main')
    expect(footer().at(-1)!.disabled).toBe(true)
    type(document.querySelector<HTMLInputElement>('input[type=text]')!, ' v1.0.0 ')
    type(document.querySelector('textarea')!, ' Release ')
    await w.vm.$nextTick()
    document.querySelector('form')!.dispatchEvent(new Event('submit'))
    expect(w.emitted('create')).toEqual([[{ name: 'v1.0.0', target: 'main', message: 'Release' }]])
  })

  it('takes a typed commit and leaves out an empty message', async () => {
    const w = make(PynTagDialog, { props: { open: true, mode: 'create', branches, tags } })
    const select = document.querySelector('select')!
    select.value = select.options[select.options.length - 1]!.value
    select.dispatchEvent(new Event('change'))
    await w.vm.$nextTick()
    const [name, commit] = [...document.querySelectorAll<HTMLInputElement>('input[type=text]')]
    type(name!, 'v1.0.0')
    type(commit!, 'zz')
    await w.vm.$nextTick()
    expect(document.body.textContent).toContain('at least 4 hex digits')
    expect(footer().at(-1)!.disabled).toBe(true)
    type(commit!, 'd7d76b0')
    await w.vm.$nextTick()
    document.querySelector('form')!.dispatchEvent(new Event('submit'))
    expect(w.emitted('create')).toEqual([[{ name: 'v1.0.0', target: 'd7d76b0' }]])
  })

  it('refuses a taken name', async () => {
    const w = make(PynTagDialog, { props: { open: true, mode: 'create', branches, tags } })
    type(document.querySelector<HTMLInputElement>('input[type=text]')!, 'v0.2.0')
    await w.vm.$nextTick()
    expect(document.body.textContent).toContain('already exists')
    expect(footer().at(-1)!.disabled).toBe(true)
  })

  it('confirms a delete', async () => {
    const w = make(PynTagDialog, {
      props: { open: true, mode: 'delete', branches, name: 'v0.1.1' },
    })
    expect(document.body.textContent).toContain('Delete v0.1.1?')
    footer().at(-1)!.click()
    expect(w.emitted('delete')).toEqual([['v0.1.1']])
  })
})

describe('PynTagsPage', () => {
  const make2 = (props: Record<string, unknown> = {}) =>
    make(PynTagsPage, { props: { tags, branches, now, ...props } })

  it('lists name, message, short commit, creator and date', () => {
    const w = make2()
    const rows = w.findAll('[data-tag]')
    expect(rows).toHaveLength(3)
    expect(rows[0]!.text()).toContain('v0.2.0')
    expect(rows[0]!.find('[data-message]').text()).toContain('audio pass')
    expect(rows[0]!.text()).toContain('d7d76b0')
    expect(rows[0]!.find('[data-created-by]').text()).toContain('alice')
    expect(rows[0]!.text()).toContain('2 days ago')
    expect(rows[1]!.find('[data-message]').exists()).toBe(false)
  })

  it('hides create and delete without permission', () => {
    const w = make2()
    expect(w.find('[data-new-tag]').exists()).toBe(false)
    expect(w.find('[aria-label^="Delete tag"]').exists()).toBe(false)
  })

  it('opens the New tag dialog and emits create', async () => {
    const w = make2({ canCreate: true })
    await w.find('[data-new-tag]').trigger('click')
    expect(w.emitted('update:creating')).toEqual([[true]])
    type(document.querySelector<HTMLInputElement>('[role=dialog] input[type=text]')!, 'v1.0.0')
    await w.vm.$nextTick()
    document.querySelector('[role=dialog] form')!.dispatchEvent(new Event('submit'))
    expect(w.emitted('create')).toEqual([[{ name: 'v1.0.0', target: 'main' }]])
  })

  it('confirms a delete before emitting it', async () => {
    const w = make2({ canDelete: true })
    await w.find('[aria-label="Delete tag v0.1.1"]').trigger('click')
    expect(w.emitted('update:deleting')).toEqual([['v0.1.1']])
    expect(w.emitted('delete')).toBeUndefined()
    footer().at(-1)!.click()
    expect(w.emitted('delete')).toEqual([['v0.1.1']])
  })

  it('searches and shows the shared empty states', async () => {
    const w = make2({ query: 'zzz' })
    expect(w.find('[data-no-match]').exists()).toBe(true)
    const empty = make2({ tags: [], canCreate: true })
    expect(empty.text()).toContain('No tags yet')
    expect(empty.text()).toContain('Create one with New tag')
  })

  it('pages the list', () => {
    const w = make2({ pageSize: 2, page: 2 })
    expect(w.findAll('[data-tag]').map((r) => r.find('a, span').text())).toEqual([
      'release/first-playable-milestone-with-a-very-long-tag-name',
    ])
  })
})
