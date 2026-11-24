import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { PynLocksPage, filterLockRows, lockRowFromMine, lockRowState, lockViews } from '../src'
import { locksPageLocks as locks, locksPageNow as now } from '../src/stories/locks-page-data'

const make = (props: Record<string, unknown> = {}) =>
  mount(PynLocksPage, { props: { locks, now, me: 'alice', ...props }, attachTo: document.body })

describe('locks page state', () => {
  it('classifies rows', () => {
    expect(locks.map((l) => lockRowState(l, 'alice', now))).toEqual([
      'mine',
      'expiring',
      'locked',
      'stale',
    ])
  })

  it('hides Mine when the viewer is unknown', () => {
    expect(lockViews()).toEqual(['all', 'expiring', 'stale'])
    expect(lockViews('a')).toContain('mine')
  })

  it('filters by view and search', () => {
    const paths = (view: 'all' | 'mine' | 'expiring' | 'stale', q = '') =>
      filterLockRows(locks, view, q, 'alice', now).map((l) => l.path)
    expect(paths('mine')).toEqual(['Content/Maps/Main.umap'])
    expect(paths('expiring')).toEqual(['Content/Art/Hero.psd'])
    expect(paths('stale')).toEqual(['Content/Art/Old/Concept.psd'])
    expect(paths('all', 'BOB')).toHaveLength(2)
  })

  it('turns a personal lock into a row with its repository', () => {
    const r = lockRowFromMine(
      { owner: 'o', name: 'n', path: 'a', acquired_at: 'x', expires_at: 'y' },
      'me',
    )
    expect(r).toMatchObject({ owner: 'me', repo: 'o/n', repoHref: '/o/n' })
  })
})

describe('PynLocksPage', () => {
  it('lists the views and the columns', () => {
    const w = make()
    expect(w.findAll('nav a').map((l) => l.text())).toEqual([
      'All',
      'Mine',
      'Expiring soon',
      'Stale',
    ])
    expect(w.findAll('th').map((h) => h.text())).toEqual([
      'Path',
      'Holder',
      'Mode',
      'Taken',
      'Expires',
      'Actions',
    ])
    expect(w.findAll('tbody tr')).toHaveLength(4)
  })

  it('reads lock state at a glance', () => {
    const rows = make().findAll('tbody tr')
    expect(rows.map((r) => r.attributes('data-state'))).toEqual([
      'mine',
      'expiring',
      'locked',
      'stale',
    ])
    expect(rows[0].find('td:nth-child(2)').text()).toBe('You')
    expect(rows[1].find('[data-lease]').text()).toContain('12m')
    expect(rows[3].find('[data-lease]').text()).toContain('expired')
    expect(rows[0].text()).toContain('Exclusive')
  })

  it('releases own locks and offers force release only with permission', async () => {
    const w = make()
    expect(w.find('button[aria-label^="Force release"]').exists()).toBe(false)
    await w.find('button[aria-label="Release Content/Maps/Main.umap"]').trigger('click')
    expect(w.emitted('release')![0][0]).toMatchObject({ path: 'Content/Maps/Main.umap' })
  })

  it('asks for a reason before force releasing', async () => {
    const w = make({ canForce: true })
    expect(w.find('button[aria-label="Force release Content/Maps/Main.umap"]').exists()).toBe(false)
    await w.find('button[aria-label="Force release Content/Art/Hero.psd"]').trigger('click')
    await w.find('input[aria-label^="Reason"]').setValue(' stuck ')
    await w.find('form').trigger('submit')
    expect(w.emitted('forceRelease')![0][0]).toMatchObject({
      lock: { path: 'Content/Art/Hero.psd' },
      reason: 'stuck',
    })
    expect(w.find('form').exists()).toBe(false)
  })

  it('shows a repository column for personal rows', () => {
    const w = make({
      locks: [
        lockRowFromMine(
          {
            owner: 'o',
            name: 'n',
            path: 'p',
            acquired_at: '2026-11-22T10:00:00Z',
            expires_at: '2026-11-22T14:00:00Z',
          },
          'alice',
        ),
      ],
    })
    expect(w.findAll('th').map((h) => h.text())).toContain('Repository')
    expect(w.find('tbody a').attributes('href')).toBe('/o/n')
  })

  it('opens the chosen view and searches', async () => {
    const w = make({ view: 'stale' })
    expect(w.find('nav a[aria-current=page]').text()).toBe('Stale')
    expect(w.findAll('tbody tr')).toHaveLength(1)
    await w.find('input[type=search]').setValue('zzz')
    expect(w.text()).toContain('No matching locks')
  })

  it('uses the shared empty state, loading and error', () => {
    expect(make({ locks: [] }).text()).toContain('No locks held')
    expect(make({ loading: true }).find('[role=status]').exists()).toBe(true)
    expect(make({ error: 'boom' }).find('[role=alert]').text()).toBe('boom')
  })
})
