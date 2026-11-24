import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PynFileBar, PynFileTree, PynFileView, PynFilesPanel } from '../src'
import { ancestorFolders, matchFiles, treeRows } from '../src/state/tree.state'
import { fileEntry, lockedEntry, treeEntries } from '../src/stories/file-data'
import { now } from '../src/stories/landing-data'

const mounted: ReturnType<typeof mount>[] = []
const make = ((c: object, o: object) => {
  const w = mount(c as never, { attachTo: document.body, ...o })
  mounted.push(w)
  return w
}) as typeof mount
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()))

const repo = { owner: 'o', name: 'n' }

describe('tree state', () => {
  it('nests loaded entries, folders first, descending only into open folders', () => {
    const closed = treeRows(treeEntries, []).map((r) => r.entry.path)
    expect(closed.slice(0, 3)).toEqual(['Content', 'Source', 'docs'])
    expect(closed).not.toContain('Source/useCount.ts')
    const open = treeRows(treeEntries, ['Source'])
    const at = open.findIndex((r) => r.entry.path === 'Source')
    expect(open[at + 1]).toMatchObject({ depth: 1 })
    expect(open[at + 1]!.entry.path.startsWith('Source/')).toBe(true)
  })

  it('lists ancestor folders and matches files by path', () => {
    expect(ancestorFolders('a/b/c.ts')).toEqual(['a', 'a/b'])
    expect(ancestorFolders('c.ts')).toEqual([])
    expect(matchFiles(treeEntries, 'LEVEL').map((e) => e.path)).toEqual([
      'Content/Level01.umap',
      'Content/Level02.umap',
    ])
    expect(matchFiles(treeEntries, '  ')).toEqual([])
  })
})

describe('PynFileTree', () => {
  const props = { ...repo, entries: treeEntries, expanded: ['Source'], current: fileEntry.path }

  it('highlights the current file, links files and toggles folders', async () => {
    const w = make(PynFileTree, { props })
    const current = w.find('[aria-current=page]')
    expect(current.find('a').attributes('href')).toBe('/o/n/blob/Source/useCount.ts')
    const folder = w.findAll('[data-kind=folder] button')[0]!
    await folder.trigger('click')
    expect(w.emitted('toggle')).toEqual([['Content']])
    expect(w.find('[data-kind=folder][aria-expanded=true]').text()).toContain('Source')
  })

  it('marks exclusive files and tells a held lock from an open one', () => {
    const w = make(PynFileTree, { props: { ...props, expanded: ['Content'] } })
    const rows = w.findAll('[data-mode=exclusive][data-kind=file]')
    expect(rows[0]!.text()).toContain('Exclusive')
    expect(rows[1]!.text()).toContain('Locked by bob')
  })
})

describe('PynFilesPanel', () => {
  const props = { ...repo, entries: treeEntries, branch: 'main', branches: [{ name: 'main' }] }

  it('collapses to its toggle and reports the state', async () => {
    const w = make(PynFilesPanel, { props: { ...props, collapsed: false } })
    expect(w.find('[role=tree]').exists()).toBe(true)
    await w.find('button[aria-label="Collapse file tree"]').trigger('click')
    expect(w.emitted('update:collapsed')).toEqual([[true]])
    const shut = make(PynFilesPanel, { props: { ...props, collapsed: true } })
    expect(shut.find('[role=tree]').exists()).toBe(false)
    expect(shut.find('button[aria-label="Expand file tree"]').exists()).toBe(true)
  })

  it('starts open by default and collapsed on a narrow screen', () => {
    expect(make(PynFilesPanel, { props }).find('[role=tree]').exists()).toBe(true)
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const narrow = make(PynFilesPanel, { props })
    vi.unstubAllGlobals()
    expect(narrow.find('[role=tree]').exists()).toBe(false)
  })

  it('filters files from Go to file and opens the first match on Enter', async () => {
    const w = make(PynFilesPanel, { props: { ...props, collapsed: false } })
    const input = w.find('input[aria-label="Go to file"]')
    await input.setValue('notes')
    expect(w.emitted('search')).toEqual([['notes']])
    expect(w.findAll('[aria-label="Matching files"] a').map((a) => a.text())).toEqual([
      'Source/Notes.md',
    ])
    await input.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('open')).toEqual([['Source/Notes.md']])
    await input.setValue('zzz')
    expect(w.text()).toContain('No matching files')
  })

  it('forwards branch events from the picker', async () => {
    const w = make(PynFilesPanel, {
      props: {
        ...props,
        collapsed: false,
        creatable: true,
        branches: [{ name: 'main' }, { name: 'dev' }],
      },
    })
    await w.find('button[aria-haspopup=listbox]').trigger('click')
    await w.findAll('[role=option]')[1]!.trigger('click')
    expect(w.emitted('selectBranch')).toEqual([['dev', 'branch']])
  })
})

describe('PynFileView layout', () => {
  const props = {
    ...repo,
    path: lockedEntry.path,
    entry: lockedEntry,
    me: 'jamie',
    now,
    body: { kind: 'code' as const, text: 'a\nb\n', language: null },
  }

  it('shows no panel without a tree and keeps the lock state visible', () => {
    const w = make(PynFileView, { props })
    expect(w.findComponent(PynFilesPanel).exists()).toBe(false)
    expect(w.find('[data-state]').attributes('data-state')).toBe('locked')
  })

  it('shows the panel with a tree and re-emits its events', async () => {
    const w = make(PynFileView, {
      props: {
        ...props,
        tree: treeEntries,
        expanded: [],
        branch: 'main',
        branches: [{ name: 'main' }],
      },
    })
    const panel = w.findComponent(PynFilesPanel)
    expect(panel.exists()).toBe(true)
    expect(panel.props('current')).toBe(lockedEntry.path)
    await panel.vm.$emit('toggle', 'Content')
    expect(w.emitted('toggleFolder')).toEqual([['Content']])
  })

  it('puts History in the latest-change row and offers Raw, Copy and Download', () => {
    const w = make(PynFileBar, { props: { ...repo, entry: fileEntry, text: 'x' } })
    expect(w.find('a[href*="/history"]').text()).toContain('History')
    const actions = w
      .findAll('[class*=actions] > *')
      .map((a) => a.attributes('aria-label') ?? a.text())
    expect(actions).toEqual(expect.arrayContaining(['Raw', 'Copy file contents', 'Download']))
    expect(
      make(PynFileBar, { props: { ...repo, entry: fileEntry } })
        .find('[aria-label="Copy file contents"]')
        .exists(),
    ).toBe(false)
  })
})
