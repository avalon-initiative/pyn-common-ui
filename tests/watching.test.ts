import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { PynWatchedRepos, UNWATCH, watchMenu, watchedButton } from '../src'
import { watched, watchingNow } from '../src/stories/watching-data'

const mounted: ReturnType<typeof mount>[] = []
const make = (props: Record<string, unknown> = {}) => {
  const w = mount(PynWatchedRepos, {
    props: { repos: watched, now: watchingNow, ...props },
    attachTo: document.body,
  })
  mounted.push(w)
  return w
}
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()))
const row = (w: ReturnType<typeof make>, level: string) => w.find(`[data-level="${level}"]`)

describe('watch menu', () => {
  it('checks the current level and offers stop watching only while one is set', () => {
    const m = watchMenu('locks')
    expect(m.filter((i) => i.checked).map((i) => i.id)).toEqual(['locks'])
    expect(m.at(-1)?.id).toBe(UNWATCH)
    expect(watchMenu(null).map((i) => i.id)).toEqual(['all', 'locks', 'ignore'])
  })

  it('labels the button with the level and leaves ignoring inactive', () => {
    expect(watchedButton(watched[0]!)).toMatchObject({ active: true, text: 'Watching' })
    expect(watchedButton(watched[1]!)).toMatchObject({ active: true, text: 'Locks only' })
    expect(watchedButton(watched[2]!)).toMatchObject({ active: false, text: 'Ignoring' })
    expect(watchedButton(watched[0]!).count).toBeUndefined()
  })
})

describe('watched repositories list', () => {
  it('shows each repository on the repository row with its level', () => {
    const w = make()
    expect(w.findAll('li[data-level]')).toHaveLength(3)
    expect(row(w, 'all').text()).toContain('studio/game')
    expect(row(w, 'all').find('[data-description]').exists()).toBe(true)
    expect(row(w, 'all').find('[data-repo-icon]').exists()).toBe(true)
    expect(row(w, 'locks').find('[aria-pressed]').text()).toContain('Locks only')
    expect(row(w, 'ignore').find('[aria-pressed="false"]').text()).toContain('Ignoring')
    expect(w.find('[data-count]').exists()).toBe(false)
    expect(row(w, 'all').find('[role=group]').attributes('aria-label')).toBe('Watch studio/game')
  })

  it('emits a level change and unwatch from the menu', async () => {
    const w = make()
    await row(w, 'all').find('button[aria-label="Watch options"]').trigger('click')
    const items = () => row(w, 'all').findAll('[role^=menuitem]')
    await items()
      .find((b) => b.text().includes('Locks only'))!
      .trigger('click')
    expect(w.emitted('level')?.[0]).toEqual([{ owner: 'studio', name: 'game' }, 'locks'])
    await row(w, 'all').find('button[aria-label="Watch options"]').trigger('click')
    await items()
      .find((b) => b.text().includes('Stop watching'))!
      .trigger('click')
    expect(w.emitted('unwatch')?.[0]).toEqual([{ owner: 'studio', name: 'game' }])
  })

  it('toggles from the button: watching stops, ignoring watches all activity', async () => {
    const w = make()
    await row(w, 'locks').find('[aria-pressed]').trigger('click')
    expect(w.emitted('unwatch')?.[0]).toEqual([{ owner: 'studio', name: 'art' }])
    await row(w, 'ignore').find('[aria-pressed]').trigger('click')
    expect(w.emitted('level')?.[0]).toEqual([{ owner: 'bob', name: 'tools' }, 'all'])
  })

  it('disables a row while its request runs', async () => {
    const w = make({ repos: watched.map((r, i) => (i === 0 ? { ...r, busy: true } : r)) })
    const button = row(w, 'all').find('[aria-pressed]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('shows loading, error and empty states', () => {
    expect(make({ repos: [], loading: true }).find('[role=status]').exists()).toBe(true)
    expect(make({ repos: [], error: 'Failed' }).find('[role=alert]').text()).toBe('Failed')
    const empty = make({ repos: [] })
    expect(empty.text()).toContain('Not watching any repositories')
    expect(make({ repos: [], empty: 'Nothing.' }).text()).toContain('Nothing.')
  })

  it('offers load more and emits it', async () => {
    expect(make().text()).not.toContain('Load more')
    const w = make({ hasMore: true })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Load more')!
      .trigger('click')
    expect(w.emitted('more')).toHaveLength(1)
    const busy = make({ hasMore: true, busy: true })
    expect(
      busy
        .findAll('button')
        .find((b) => b.text() === 'Loading…')!
        .attributes('disabled'),
    ).toBeDefined()
  })
})
