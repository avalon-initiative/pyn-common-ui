import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { PynDiffFile, PynDiffStat, PynDiffView } from '../src'
import {
  diffAnchor,
  diffTotals,
  diffTreeEntries,
  filterDiffFiles,
  locksHeldByOthers,
  segments,
  splitRows,
  statSquares,
  wordMarks,
} from '../src/state/diff.state'
import { diffFiles, lockedBinary, lockfile, sourceFile } from '../src/stories/diff-data'
import { now } from '../src/stories/landing-data'

const mounted: ReturnType<typeof mount>[] = []
const make = ((c: object, o: object) => {
  const w = mount(c as never, { attachTo: document.body, ...o })
  mounted.push(w)
  return w
}) as typeof mount
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()))

describe('diff state', () => {
  it('marks only the changed words of a line pair', () => {
    const [a, b] = wordMarks('version = "2.0.4"', 'version = "3.0.0"')
    expect(a).toEqual([[11, 16]])
    expect(b).toEqual([[11, 16]])
    expect(wordMarks('same', 'same')).toEqual([[], []])
  })

  it('splits text at the marks', () => {
    expect(segments('abcdef', [[2, 4]])).toEqual([
      { text: 'ab', marked: false },
      { text: 'cd', marked: true },
      { text: 'ef', marked: false },
    ])
    expect(segments('abc')).toEqual([{ text: 'abc', marked: false }])
  })

  it('pairs a deletion run with the additions after it', () => {
    const rows = splitRows(sourceFile.hunks[0]!)
    const changed = rows.filter((r) => r.left?.kind !== 'context')
    expect(changed[0]!.left?.kind).toBe('delete')
    expect(changed[0]!.right?.kind).toBe('add')
    expect(changed.some((r) => r.left === null && r.right?.kind === 'add')).toBe(true)
  })

  it('totals, squares, anchors, filters and tree entries', () => {
    expect(diffTotals([lockfile, sourceFile])).toMatchObject({ files: 2 })
    expect(statSquares(0, 0)).toEqual(Array(5).fill('none'))
    expect(statSquares(1, 99).filter((s) => s === 'add')).toHaveLength(1)
    expect(statSquares(99, 1).filter((s) => s === 'delete')).toHaveLength(1)
    expect(diffAnchor('a/b c.ts')).toBe('diff-a-b-c-ts')
    expect(filterDiffFiles(diffFiles, 'SOURCE').every((f) => f.path.startsWith('Source'))).toBe(
      true,
    )
    const entries = diffTreeEntries(diffFiles)
    expect(entries.filter((e) => e.kind === 'folder').map((e) => e.path)).toContain('Source/Player')
  })

  it('lists locks held by someone else', () => {
    expect(locksHeldByOthers([lockedBinary('sam')], 'jamie')).toHaveLength(1)
    expect(locksHeldByOthers([lockedBinary('jamie')], 'jamie')).toHaveLength(0)
  })
})

describe('PynDiffStat', () => {
  it('shows counts and squares, or counts only', () => {
    const w = make(PynDiffStat, { props: { additions: 3, deletions: 1 } })
    expect(w.text()).toContain('+3')
    expect(w.findAll('span[aria-hidden]')).toHaveLength(1)
    const p = make(PynDiffStat, { props: { additions: 3, deletions: 1, plain: true } })
    expect(p.find('span[aria-hidden]').exists()).toBe(false)
  })
})

describe('PynDiffFile', () => {
  it('renders unified rows with line numbers and word marks', () => {
    const w = make(PynDiffFile, { props: { file: sourceFile, now } })
    expect(w.find('table').attributes('data-layout')).toBe('unified')
    expect(w.findAll('[data-row]').length).toBe(sourceFile.hunks[0]!.lines.length)
    expect(w.findAll('mark').length).toBeGreaterThan(0)
  })

  it('renders side by side', () => {
    const w = make(PynDiffFile, { props: { file: sourceFile, layout: 'split', now } })
    expect(w.find('table').attributes('data-layout')).toBe('split')
    expect(w.findAll('[data-row]').length).toBeLessThan(sourceFile.hunks[0]!.lines.length)
  })

  it('collapses from the header and emits the viewed mark', async () => {
    const w = make(PynDiffFile, { props: { file: sourceFile, now } })
    await w.find('button[aria-expanded]').trigger('click')
    expect(w.emitted('update:collapsed')![0]).toEqual([true])
    await w.find('input[type=checkbox]').setValue(true)
    expect(w.emitted('update:viewed')![0]).toEqual([true])
  })

  it('emits expand requests from the hunk controls', async () => {
    const w = make(PynDiffFile, { props: { file: lockfile, now } })
    await w.findAll('[data-expand="up"]')[0]!.trigger('click')
    expect(w.emitted('expand')![0]).toEqual([
      { path: 'Cargo.lock', hunk: 0, direction: 'up', position: 'before' },
    ])
  })

  it('tells the last hunk header from the control after the last hunk', async () => {
    const w = make(PynDiffFile, { props: { file: lockfile, now } })
    await w.find('[data-expand="down"]').trigger('click')
    await w.find('[data-expand="after"]').trigger('click')
    expect(w.emitted('expand')).toEqual([
      [{ path: 'Cargo.lock', hunk: 1, direction: 'down', position: 'before' }],
      [{ path: 'Cargo.lock', hunk: 1, direction: 'down', position: 'after' }],
    ])
  })

  it('says why a binary file has no lines, and shows its lock', () => {
    const w = make(PynDiffFile, { props: { file: lockedBinary('sam'), me: 'jamie', now } })
    expect(w.find('[data-message]').text()).toBe('Binary file not shown')
    expect(w.find('[data-lock]').text()).toContain('sam')
  })
})

describe('PynDiffView', () => {
  it('lists every file with the tree beside it and counts viewed files', () => {
    const w = make(PynDiffView, { props: { files: diffFiles, viewed: ['Cargo.lock'], now } })
    expect(w.findAll('section[id^=diff-]')).toHaveLength(diffFiles.length)
    expect(w.find('[role=tree]').exists()).toBe(true)
    expect(w.find('[data-viewed-count]').text()).toBe(`1 / ${diffFiles.length} viewed`)
  })

  it('marking viewed emits the paths and filtering narrows the list', async () => {
    const w = make(PynDiffView, { props: { files: diffFiles, now } })
    await w.find('section[id^=diff-] input[type=checkbox]').setValue(true)
    expect(w.emitted('update:viewed')![0]).toEqual([['Cargo.lock']])
    await w.find('input[aria-label="Filter files"]').setValue('docs/')
    expect(w.findAll('section[id^=diff-]')).toHaveLength(1)
  })

  it('switches the layout and shows the empty and no-match states', async () => {
    const w = make(PynDiffView, { props: { files: diffFiles, now } })
    await w.find('[data-layout=split]').trigger('click')
    expect(w.emitted('update:layout')![0]).toEqual(['split'])
    const e = make(PynDiffView, { props: { files: [] } })
    expect(e.text()).toContain('No changes')
    const n = make(PynDiffView, { props: { files: diffFiles, filter: 'zzz' } })
    expect(n.text()).toContain('No matches')
  })
})
