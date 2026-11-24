import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  PynBranchDialog,
  PynBranchPicker,
  PynBranchesPage,
  PynConfirmDialog,
  PynFilesPanel,
  PynHistory,
  ancestorFolders,
  pickerBranch,
} from '../src'
import { branchesPageBranches } from '../src/stories/branches-page-data'
import { treeEntries } from '../src/stories/file-data'

const mounted: ReturnType<typeof mount>[] = []
const make = ((c: object, o: object) => {
  const w = mount(c as never, { attachTo: document.body, ...o })
  mounted.push(w)
  return w
}) as typeof mount
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()))

const branches = [{ name: 'dev' }, { name: 'main', isDefault: true }]
const dialogs = () => document.body

describe('picker on the default branch', () => {
  it('names the default branch when none is in view', () => {
    expect(pickerBranch(undefined, branches)).toBe('main')
    expect(pickerBranch('dev', branches)).toBe('dev')
    expect(pickerBranch(undefined, [])).toBe('')
  })

  it('shows in the files panel and history without a branch', () => {
    const panel = make(PynFilesPanel, {
      props: { owner: 'o', name: 'n', entries: treeEntries, branches, collapsed: false },
    })
    expect(panel.find('button[aria-haspopup=listbox]').text()).toContain('main')
    const history = make(PynHistory, { props: { revisions: [], branches } })
    expect(history.find('button[aria-haspopup=listbox]').text()).toContain('main')
  })

  it('stays hidden without branches', () => {
    const panel = make(PynFilesPanel, {
      props: { owner: 'o', name: 'n', entries: treeEntries, branch: 'main', collapsed: false },
    })
    expect(panel.find('button[aria-haspopup=listbox]').exists()).toBe(false)
  })
})

describe('picker buttons', () => {
  it('emits newBranch and search from the icon buttons', async () => {
    const w = make(PynBranchPicker, {
      props: { branches, current: 'main', newBranchButton: true, searchButton: true },
    })
    await w.find('button[aria-label="New branch"]').trigger('click')
    await w.find('button[aria-label="Search files"]').trigger('click')
    expect(w.emitted('newBranch')).toHaveLength(1)
    expect(w.emitted('search')).toHaveLength(1)
  })

  it('has no extra buttons by default', () => {
    const w = make(PynBranchPicker, { props: { branches, current: 'main' } })
    expect(w.find('button[aria-label="New branch"]').exists()).toBe(false)
  })

  it('focuses Go to file from the panel search button', async () => {
    const w = make(PynFilesPanel, {
      props: { owner: 'o', name: 'n', entries: treeEntries, branches, collapsed: false },
    })
    await w.find('button[aria-label="Search files"]').trigger('click')
    expect(document.activeElement).toBe(w.find('input[aria-label="Go to file"]').element)
  })
})

describe('PynConfirmDialog', () => {
  it('confirms and closes', async () => {
    const w = make(PynConfirmDialog, {
      props: { open: true, title: 'Sure?', confirmLabel: 'Do it' },
      slots: { default: 'Body text' },
    })
    expect(dialogs().textContent).toContain('Body text')
    const buttons = [...document.querySelectorAll<HTMLButtonElement>('footer button')]
    buttons.find((b) => b.textContent?.includes('Do it'))!.click()
    buttons.find((b) => b.textContent?.includes('Cancel'))!.click()
    expect(w.emitted('confirm')).toHaveLength(1)
    expect(w.emitted('close')).toHaveLength(1)
  })

  it('disables confirm while busy or not ready', () => {
    make(PynConfirmDialog, { props: { open: true, title: 'x', confirmDisabled: true } })
    const confirm = [...document.querySelectorAll<HTMLButtonElement>('footer button')].at(-1)!
    expect(confirm.disabled).toBe(true)
  })
})

describe('PynBranchDialog', () => {
  const footer = () => [...document.querySelectorAll<HTMLButtonElement>('footer button')]
  const field = (sel: string) => document.querySelector<HTMLInputElement>(sel)!

  it('creates from the chosen start point, defaulting to the default branch', async () => {
    const w = make(PynBranchDialog, { props: { open: true, mode: 'create', branches } })
    const select = field('select') as unknown as HTMLSelectElement
    expect(select.value).toBe('main')
    expect(footer().at(-1)!.disabled).toBe(true)
    select.value = 'dev'
    select.dispatchEvent(new Event('change'))
    const input = field('input[type=text]')
    input.value = ' feature/x '
    input.dispatchEvent(new Event('input'))
    await w.vm.$nextTick()
    document.querySelector('form')!.dispatchEvent(new Event('submit'))
    expect(w.emitted('create')).toEqual([[{ name: 'feature/x', from: 'dev' }]])
  })

  it('rejects a name another branch has', async () => {
    const w = make(PynBranchDialog, { props: { open: true, mode: 'create', branches } })
    const input = field('input[type=text]')
    input.value = 'dev'
    input.dispatchEvent(new Event('input'))
    await w.vm.$nextTick()
    expect(dialogs().textContent).toContain('already exists')
    expect(footer().at(-1)!.disabled).toBe(true)
  })

  it('renames, prefilled with the current name', async () => {
    const w = make(PynBranchDialog, {
      props: { open: true, mode: 'rename', branches, name: 'dev' },
    })
    const input = field('input[type=text]')
    expect(input.value).toBe('dev')
    expect(footer().at(-1)!.disabled).toBe(true)
    input.value = 'develop'
    input.dispatchEvent(new Event('input'))
    await w.vm.$nextTick()
    document.querySelector('form')!.dispatchEvent(new Event('submit'))
    expect(w.emitted('rename')).toEqual([['dev', 'develop']])
  })

  it('deletes after a confirm, and only after the force step when unmerged', async () => {
    const plain = make(PynBranchDialog, {
      props: { open: true, mode: 'delete', branches, name: 'dev' },
    })
    footer().at(-1)!.click()
    expect(plain.emitted('delete')).toEqual([[{ name: 'dev', force: false }]])
    plain.unmount()
    const w = make(PynBranchDialog, {
      props: { open: true, mode: 'delete', branches, name: 'dev', unmerged: true },
    })
    expect(footer().at(-1)!.disabled).toBe(true)
    const box = field('input[type=checkbox]')
    box.click()
    await w.vm.$nextTick()
    expect(footer().at(-1)!.disabled).toBe(false)
    footer().at(-1)!.click()
    expect(w.emitted('delete')).toEqual([[{ name: 'dev', force: true }]])
  })
})

describe('PynBranchesPage rename', () => {
  it('opens the dialog from the row menu and emits rename', async () => {
    const w = make(PynBranchesPage, {
      props: { branches: branchesPageBranches, defaultBranch: 'main', canRename: true },
    })
    const first = w.findAll('[aria-label^="More actions for"]')[1]!
    await first.trigger('click')
    const item = [...document.querySelectorAll<HTMLElement>('[role=menuitem]')].find(
      (i) => i.textContent?.trim() === 'Rename',
    )!
    item.click()
    await w.vm.$nextTick()
    const input = document.querySelector<HTMLInputElement>('dialog input, [role=dialog] input')!
    input.value = 'renamed-branch'
    input.dispatchEvent(new Event('input'))
    await w.vm.$nextTick()
    document.querySelector('form')!.dispatchEvent(new Event('submit'))
    expect(w.emitted('rename')).toHaveLength(1)
    expect(w.emitted('rename')![0]![1]).toBe('renamed-branch')
  })

  it('offers no Rename without canRename', async () => {
    const w = make(PynBranchesPage, { props: { branches: branchesPageBranches } })
    await w.findAll('[aria-label^="More actions for"]')[0]!.trigger('click')
    expect(document.body.textContent).not.toContain('Rename')
  })
})

describe('exports', () => {
  it('exposes ancestorFolders', () => {
    expect(ancestorFolders('a/b/c.ts')).toEqual(['a', 'a/b'])
  })
})
