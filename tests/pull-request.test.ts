import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import {
  PynMergeBox,
  PynPullCommits,
  PynPullRequestHeader,
  PynPullRequestPage,
  PynPullSide,
} from '../src'
import {
  commitDays,
  mergeBlockers,
  mergeStatus,
  pullCounts,
  pullLocksByOthers,
  pullTabs,
  pullWhen,
  segmentFill,
} from '../src/state/pull-request.state'
import { diffFiles } from '../src/stories/diff-data'
import { now } from '../src/stories/landing-data'
import {
  closedPull,
  conflictedPull,
  emptyPull,
  lockedPull,
  mergedPull,
  openPull,
  pullCommits,
  pullEvents,
  pullList,
} from '../src/stories/pull-request-data'

const mounted: ReturnType<typeof mount>[] = []
const make = ((c: object, o: object) => {
  const w = mount(c as never, { attachTo: document.body, ...o })
  mounted.push(w)
  return w
}) as typeof mount
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()))

describe('pull request state', () => {
  it('builds the four tabs with counts and the current one', () => {
    const tabs = pullTabs(openPull, '/a/b/pulls/42', 'files')
    expect(tabs.map((t) => t.label)).toEqual(['Overview', 'Commits', 'Checks', 'Files changed'])
    expect(tabs[3]).toMatchObject({ current: true, href: '/a/b/pulls/42/files', count: 6 })
    expect(tabs[0]!.href).toBe('/a/b/pulls/42')
  })

  it('blocks a merge on conflicts or locks held by others, not on my own', () => {
    expect(mergeBlockers(openPull, 'jamie')).toEqual([])
    expect(mergeBlockers(conflictedPull, 'jamie')).toEqual(['conflicts'])
    expect(mergeBlockers(lockedPull, 'jamie')).toEqual(['locks'])
    expect(pullLocksByOthers(lockedPull.locks, 'sam').map((l) => l.owner)).toEqual(['jamie'])
  })

  it('describes the pull request in the merge box heading', () => {
    expect(mergeStatus(openPull, 'jamie').title).toBe('Review requested')
    expect(mergeStatus(mergedPull).tone).toBe('merged')
    expect(mergeStatus(closedPull).title).toBe('Pull request closed')
    expect(mergeStatus(lockedPull, 'jamie').text).toContain('1 changed path is locked')
    expect(mergeStatus({ ...openPull, review: 'approved' }).tone).toBe('success')
  })

  it('counts, dates and groups', () => {
    expect(pullCounts(pullList)).toEqual({ open: 3, closed: 2 })
    expect(pullWhen(mergedPull).verb).toBe('merged')
    expect(pullWhen(closedPull).verb).toBe('closed')
    expect(pullWhen(openPull).verb).toBe('opened')
    expect(segmentFill(1, 4)).toBe(25)
    expect(segmentFill(0, 0)).toBe(0)
    expect(commitDays(pullCommits).length).toBeGreaterThan(1)
  })
})

describe('PynPullRequestHeader', () => {
  it('shows state, author, branches and the diff stat, and emits the edit', async () => {
    const w = make(PynPullRequestHeader, { props: { pull: openPull, now, editable: true } })
    expect(w.find('[data-state]').attributes('data-state')).toBe('open')
    expect(w.find('[data-base]').text()).toBe('main')
    expect(w.find('[data-head]').text()).toBe('feature/level-two')
    expect(w.text()).toContain('+474')
    expect(w.text()).toContain('12 hours ago')
    await w.find('button[aria-label="Edit title"]').trigger('click')
    expect(w.emitted('editTitle')).toHaveLength(1)
  })

  it('says merged for a merged pull request', () => {
    const w = make(PynPullRequestHeader, { props: { pull: mergedPull, now } })
    expect(w.text()).toContain('Merged')
    expect(w.text()).toContain('merged 2 hours ago')
  })
})

describe('PynMergeBox', () => {
  it('merges with the chosen method', async () => {
    const w = make(PynMergeBox, { props: { pull: openPull, me: 'jamie', now } })
    expect(w.find('[data-segment=checks]').text()).toContain('Not supported yet')
    await w.find('[data-merge]').trigger('click')
    expect(w.emitted('merge')![0]).toEqual(['allow'])
  })

  it('lists locks held by others and disables the merge', () => {
    const w = make(PynMergeBox, { props: { pull: lockedPull, me: 'jamie', now } })
    const rows = w.findAll('[data-lock]')
    expect(rows).toHaveLength(1)
    expect(rows[0]!.text()).toContain('Level01.umap')
    expect(w.find('[data-merge]').attributes('disabled')).toBeDefined()
  })

  it('lists conflicts and blocks the merge', () => {
    const w = make(PynMergeBox, { props: { pull: conflictedPull, now } })
    expect(w.findAll('[data-conflict]')).toHaveLength(2)
    expect(w.find('[data-merge]').attributes('disabled')).toBeDefined()
  })

  it('has no merge button once merged or for a read-only viewer', () => {
    expect(
      make(PynMergeBox, { props: { pull: mergedPull } })
        .find('[data-merge]')
        .exists(),
    ).toBe(false)
    const ro = make(PynMergeBox, { props: { pull: openPull, canMerge: false } })
    expect(ro.find('[data-merge]').exists()).toBe(false)
  })
})

describe('PynPullSide', () => {
  it('shows the not-supported state for sections pyn has no feature for', () => {
    const w = make(PynPullSide, { props: { pull: openPull } })
    for (const s of ['reviewers', 'assignees', 'labels', 'milestone'])
      expect(w.find(`[data-section=${s}]`).text()).toContain('Not supported yet')
    expect(w.find('[data-section=labels] > div').classes().length).toBeGreaterThan(1)
    expect(w.find('[data-section=participants]').text()).toContain('2 participants')
  })

  it('closes or reopens only for a manager, never a merged pull request', async () => {
    const w = make(PynPullSide, { props: { pull: openPull, canManage: true } })
    await w.find('[data-close]').trigger('click')
    expect(w.emitted('close')).toHaveLength(1)
    const c = make(PynPullSide, { props: { pull: closedPull, canManage: true } })
    await c.find('[data-reopen]').trigger('click')
    expect(c.emitted('reopen')).toHaveLength(1)
    expect(
      make(PynPullSide, { props: { pull: mergedPull, canManage: true } })
        .find('button')
        .exists(),
    ).toBe(false)
    expect(
      make(PynPullSide, { props: { pull: openPull } })
        .find('[data-close]')
        .exists(),
    ).toBe(false)
  })

  it('says no participants for an empty list', () => {
    const w = make(PynPullSide, { props: { pull: emptyPull } })
    expect(w.text()).toContain('No participants')
  })
})

describe('PynPullCommits', () => {
  it('groups commits by day and shows short ids', () => {
    const w = make(PynPullCommits, { props: { commits: pullCommits, now } })
    expect(w.findAll('[data-commit]')).toHaveLength(3)
    expect(w.text()).toContain('210e2fe')
    expect(make(PynPullCommits, { props: { commits: [] } }).text()).toContain('No commits')
  })
})

describe('PynPullRequestPage', () => {
  const base = {
    pull: openPull,
    basePath: '/a/b/pulls/42',
    owner: 'a',
    name: 'b',
    me: 'jamie',
    now,
    commits: pullCommits,
    events: pullEvents,
    files: diffFiles,
  }

  it('shows the overview with the merge box, timeline and side column', () => {
    const w = make(PynPullRequestPage, { props: base })
    expect(w.find('[data-pull-bar]').text()).toContain('#42')
    expect(w.find('section[aria-label=Merge]').exists()).toBe(true)
    expect(w.findAll('ol[aria-label=Timeline] > li').length).toBe(1 + pullEvents.length)
    expect(w.find('aside').exists()).toBe(true)
    expect(w.find('nav[aria-label="Pull request"] [aria-current=page]').text()).toContain(
      'Overview',
    )
  })

  it('shows the description placeholder for an empty body', () => {
    const w = make(PynPullRequestPage, { props: { ...base, pull: emptyPull, events: [] } })
    expect(w.text()).toContain('No description provided.')
  })

  it('switches the tab body', () => {
    const commits = make(PynPullRequestPage, { props: { ...base, tab: 'commits' } })
    expect(commits.findAll('[data-commit]')).toHaveLength(3)
    const checks = make(PynPullRequestPage, { props: { ...base, tab: 'checks' } })
    expect(checks.text()).toContain('Checks are not supported yet')
    const files = make(PynPullRequestPage, { props: { ...base, tab: 'files' } })
    expect(files.findAll('section[id^=diff-]')).toHaveLength(diffFiles.length)
    expect(files.find('section[aria-label=Merge]').exists()).toBe(false)
  })

  it('passes merge, close and reopen up', async () => {
    const w = make(PynPullRequestPage, { props: { ...base, canManage: true } })
    await w.find('[data-merge]').trigger('click')
    await w.find('[data-close]').trigger('click')
    expect(w.emitted('merge')![0]).toEqual(['allow'])
    expect(w.emitted('close')).toHaveLength(1)
  })
})
