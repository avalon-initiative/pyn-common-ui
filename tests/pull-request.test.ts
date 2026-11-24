import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import {
  PynMergeBox,
  PynPullCommits,
  PynPullRequestForm,
  PynPullRequestHeader,
  PynPullRequestList,
  PynPullRequestPage,
  PynPullSide,
  PynRepoShell,
} from '../src'
import {
  commitDays,
  isDraft,
  mergeBlockers,
  matchesPullQuery,
  mergeStatus,
  parsePullQuery,
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
  draftPull,
  emptyPull,
  lockedPull,
  mergedPull,
  openPull,
  pullCommits,
  pullEvents,
  pullList,
  prBranches,
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

  it('treats only an open draft as a draft, which blocks the merge', () => {
    expect(isDraft(draftPull)).toBe(true)
    expect(isDraft({ ...draftPull, state: 'merged' })).toBe(false)
    expect(mergeBlockers(draftPull, 'jamie')).toEqual(['draft'])
    expect(mergeStatus(draftPull).title).toBe('This pull request is still a draft')
  })

  it('says a lock override is coming when the viewer may merge over locks', () => {
    const s = mergeStatus(lockedPull, 'jamie', { overrideLocks: true })
    expect(s.title).toBe('Merging will override locks')
    expect(s.text).toContain('1 changed path is locked by someone else')
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

  it('edits the title inline and closes once the new title arrives', async () => {
    const w = make(PynPullRequestHeader, { props: { pull: openPull, now, editable: true } })
    await w.find('button[aria-label="Edit title"]').trigger('click')
    const input = w.find('[data-title-editor] input')
    expect((input.element as HTMLInputElement).value).toBe(openPull.title)
    await input.setValue('  Level two  ')
    await w.find('[data-title-editor]').trigger('submit')
    expect(w.emitted('saveTitle')![0]).toEqual(['Level two'])
    await w.setProps({ titleError: 'Failed.' })
    expect(w.find('[data-title-editor] [role=alert]').text()).toBe('Failed.')
    await w.setProps({ pull: { ...openPull, title: 'Level two' }, titleError: undefined })
    expect(w.find('[data-title-editor]').exists()).toBe(false)
    expect(w.find('h1').text()).toContain('Level two')
  })

  it('cancels the title edit without saving', async () => {
    const w = make(PynPullRequestHeader, { props: { pull: openPull, now, editable: true } })
    await w.find('button[aria-label="Edit title"]').trigger('click')
    await w.find('[data-title-editor] button[type=button]').trigger('click')
    expect(w.find('[data-title-editor]').exists()).toBe(false)
    expect(w.emitted('saveTitle')).toBeUndefined()
  })

  it('shows a draft chip', () => {
    const w = make(PynPullRequestHeader, { props: { pull: draftPull, now } })
    expect(w.find('[data-draft]').text()).toBe('Draft')
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

  it('says not supported yet on segments without data', () => {
    const w = make(PynMergeBox, { props: { pull: emptyPull } })
    expect(w.find('[data-segment=comments]').text()).toContain('Not supported yet')
    expect(w.find('[data-segment=approvals]').text()).toContain('Not supported yet')
    const d = make(PynMergeBox, { props: { pull: openPull } })
    expect(d.find('[data-segment=comments]').text()).not.toContain('Not supported yet')
  })

  it('offers Ready for review on a draft instead of the merge', async () => {
    const w = make(PynMergeBox, { props: { pull: draftPull, now } })
    expect(w.find('[data-status]').text()).toBe('This pull request is still a draft')
    expect(w.find('[data-merge]').exists()).toBe(false)
    await w.find('[data-ready]').trigger('click')
    expect(w.emitted('ready')).toHaveLength(1)
    const ro = make(PynMergeBox, { props: { pull: draftPull, canMerge: false } })
    expect(ro.find('[data-ready]').exists()).toBe(false)
    const author = make(PynMergeBox, {
      props: { pull: draftPull, canMerge: false, canMarkReady: true },
    })
    expect(author.find('[data-ready]').exists()).toBe(true)
  })

  it('merges over locks after a confirm, keeping the locks listed', async () => {
    const w = make(PynMergeBox, {
      props: { pull: lockedPull, me: 'jamie', now, canOverrideLocks: true },
    })
    expect(w.findAll('[data-lock]')).toHaveLength(1)
    expect(w.find('[data-override-warning]').exists()).toBe(true)
    const button = w.find('[data-merge]')
    expect(button.attributes('disabled')).toBeUndefined()
    expect(button.text()).toBe('Merge over locks')
    await button.trigger('click')
    expect(w.emitted('merge')).toBeUndefined()
    const confirm = w.find('[role=dialog]').findAll('button').at(-1)!
    expect(confirm.text()).toBe('Merge over locks')
    await confirm.trigger('click')
    expect(w.emitted('merge')![0]).toEqual(['allow'])
    expect(w.find('[role=dialog]').exists()).toBe(false)
  })

  it('still blocks conflicts when it may override locks', () => {
    const w = make(PynMergeBox, {
      props: { pull: { ...conflictedPull, locks: lockedPull.locks }, canOverrideLocks: true },
    })
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

  it('shows the sticky bar only after the header scrolls away', async () => {
    const w = make(PynPullRequestPage, { props: base })
    const bar = w.find('[data-pull-bar]')
    expect(bar.isVisible()).toBe(false)
    const header = w.find('header').element.parentElement!
    header.getBoundingClientRect = () => ({ bottom: 10 }) as DOMRect
    bar.element.parentElement!.getBoundingClientRect = () => ({ top: 64 }) as DOMRect
    window.dispatchEvent(new Event('scroll'))
    await w.vm.$nextTick()
    expect(bar.isVisible()).toBe(true)
  })

  it('puts notices above the header', () => {
    const w = make(PynPullRequestPage, {
      props: base,
      slots: { notices: '<p data-note>Draft</p>' },
    })
    const head = w.find('[data-note]').element.parentElement!.parentElement!
    expect(head.querySelector('h1')).not.toBeNull()
  })

  it('edits the description and closes once the new body arrives', async () => {
    const w = make(PynPullRequestPage, { props: { ...base, editable: true } })
    await w.find('[data-kind=comment] [data-edit]').trigger('click')
    const area = w.find('[data-comment-form] textarea')
    expect((area.element as HTMLTextAreaElement).value).toBe(openPull.body)
    await area.setValue('New body')
    await w.find('[data-comment-form]').trigger('submit')
    expect(w.emitted('saveBody')![0]).toEqual(['New body'])
    await w.setProps({ pull: { ...openPull, body: 'New body' } })
    expect(w.find('[data-comment-form]').exists()).toBe(false)
  })

  it('passes the title save and Ready for review up', async () => {
    const w = make(PynPullRequestPage, { props: { ...base, pull: draftPull, editable: true } })
    expect(w.find('[data-pull-bar] [data-draft]').exists()).toBe(true)
    await w.find('[data-ready]').trigger('click')
    expect(w.emitted('ready')).toHaveLength(1)
    await w.find('button[aria-label="Edit title"]').trigger('click')
    await w.find('[data-title-editor] input').setValue('Renamed')
    await w.find('[data-title-editor]').trigger('submit')
    expect(w.emitted('saveTitle')![0]).toEqual(['Renamed'])
  })

  it('passes merge, close and reopen up', async () => {
    const w = make(PynPullRequestPage, { props: { ...base, canManage: true } })
    await w.find('[data-merge]').trigger('click')
    await w.find('[data-close]').trigger('click')
    expect(w.emitted('merge')![0]).toEqual(['allow'])
    expect(w.emitted('close')).toHaveLength(1)
  })
})

describe('pull request search', () => {
  it('splits qualifiers from the text', () => {
    expect(parsePullQuery('is:open author:sam lease timer')).toEqual({
      text: 'lease timer',
      is: 'open',
      author: 'sam',
    })
    expect(parsePullQuery('is:bogus head:fix/x')).toEqual({ text: 'is:bogus', head: 'fix/x' })
  })

  it('matches by state, author, branch and title', () => {
    const [open, , , merged] = [pullList[0]!, pullList[1]!, pullList[2]!, pullList[3]!]
    expect(matchesPullQuery(open, 'is:open')).toBe(true)
    expect(matchesPullQuery(merged, 'is:open')).toBe(false)
    expect(matchesPullQuery(merged, 'is:closed')).toBe(true)
    expect(matchesPullQuery(merged, 'is:merged readme')).toBe(true)
    expect(matchesPullQuery(open, 'author:SAM')).toBe(false)
    expect(matchesPullQuery(open, 'head:feature/level-two base:main')).toBe(true)
    expect(matchesPullQuery(open, '#42')).toBe(true)
  })
})

describe('PynPullRequestList', () => {
  const rows = pullList.filter((p) => p.state === 'open')
  const props = { pulls: rows, count: rows.length, counts: { open: 3, closed: 2 }, now }

  it('shows bordered rows with number, author, review state, comments and locks', () => {
    const w = make(PynPullRequestList, { props })
    const items = w.findAll('[data-pull]')
    expect(items).toHaveLength(3)
    expect(items[0]!.text()).toContain('#42')
    expect(items[0]!.text()).toContain('Jamie Park')
    expect(items[0]!.find('[data-review]').text()).toBe('Review required')
    expect(items[2]!.find('[data-locked]').text()).toBe('2 paths locked')
    expect(w.text()).toContain('3 pull requests')
  })

  it('marks a draft row', () => {
    const items = make(PynPullRequestList, { props }).findAll('[data-pull]')
    expect(items[1]!.attributes('data-draft')).toBeDefined()
    expect(items[1]!.find('[data-draft-label]').text()).toBe('Draft')
    expect(items[0]!.attributes('data-draft')).toBeUndefined()
  })

  it('switches between Open and Closed with the counts', async () => {
    const w = make(PynPullRequestList, { props })
    expect(w.find('[data-status-tab=open]').attributes('aria-pressed')).toBe('true')
    expect(w.find('[data-status-tab=closed]').text()).toContain('2')
    await w.find('[data-status-tab=closed]').trigger('click')
    expect(w.emitted('update:status')![0]).toEqual(['closed'])
  })

  it('has the left sub-nav only when groups are given', () => {
    const groups = [{ id: 'g', items: [{ id: 'a', label: 'All', href: '#' }] }]
    const w = make(PynPullRequestList, { props: { ...props, navGroups: groups, navCurrent: 'a' } })
    expect(w.find('nav[aria-label="Pull request views"]').exists()).toBe(true)
    expect(
      make(PynPullRequestList, { props }).find('nav[aria-label="Pull request views"]').exists(),
    ).toBe(false)
  })

  it('shows the empty and no-match states and the New button', () => {
    const e = make(PynPullRequestList, {
      props: { ...props, pulls: [], count: 0, newHref: '/n' },
    })
    expect(e.text()).toContain('No pull requests')
    expect(e.find('a[href="/n"]').text()).toBe('New pull request')
    const f = make(PynPullRequestList, { props: { ...props, pulls: [], count: 0, filtered: true } })
    expect(f.text()).toContain('No matches')
  })
})

describe('PynPullRequestForm', () => {
  it('starts on the default branch and submits the pull request', async () => {
    const w = make(PynPullRequestForm, { props: { branches: prBranches } })
    expect(w.emitted('update:base')![0]).toEqual(['main'])
    await w.setProps({ base: 'main', head: 'feature/level-two' })
    await w.find('input[type=text]').setValue(' Level two ')
    await w.find('textarea').setValue('Body')
    await w.find('[data-draft]').setValue(true)
    expect(w.find('[data-submit]').text()).toBe('Create draft pull request')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')![0]).toEqual([
      { title: 'Level two', body: 'Body', draft: true, base: 'main', head: 'feature/level-two' },
    ])
  })

  it('refuses the same branch twice and a missing title', async () => {
    const w = make(PynPullRequestForm, {
      props: { branches: prBranches, base: 'main', head: 'main' },
    })
    expect(w.find('[data-branch-problem]').text()).toBe('Choose two different branches.')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')).toBeUndefined()
    expect(w.text()).toContain('Enter a title.')
  })

  it('shows the compare slot, the error and the busy state', () => {
    const w = make(PynPullRequestForm, {
      props: { branches: prBranches, busy: true, error: 'Already open.' },
      slots: { compare: '<p data-summary>3 commits</p>' },
    })
    expect(w.find('[data-summary]').exists()).toBe(true)
    expect(w.find('[role=alert]').text()).toBe('Already open.')
    expect(w.find('[data-submit]').text()).toBe('Creating…')
  })
})

describe('PynRepoShell pull request count', () => {
  it('counts open pull requests on the Pull requests tab', () => {
    const w = make(PynRepoShell, {
      props: {
        owner: 'acme',
        name: 'castle-quest',
        visibility: 'private',
        tabs: [
          { section: '', label: 'Code' },
          { section: 'pulls', label: 'Pull requests' },
        ],
        pullCount: 3,
      },
    })
    expect(w.find('a[href="/acme/castle-quest/pulls"] [data-count]').text()).toBe('3')
  })
})
