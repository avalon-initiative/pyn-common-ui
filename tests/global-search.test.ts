import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { PynGlobalSearch, PynTopBar, groupSearchResults, searchHint } from '../src'
import { searchResults } from '../src/stories/global-search-data'

const make = (props: Record<string, unknown> = {}) =>
  mount(PynGlobalSearch, { props: { results: searchResults, ...props }, attachTo: document.body })

async function type(w: ReturnType<typeof make>, value: string) {
  const input = w.find('input')
  await input.trigger('focusin')
  await input.setValue(value)
  return input
}

describe('global search results', () => {
  it('groups in a fixed order and drops empty groups', () => {
    expect(groupSearchResults([...searchResults].reverse()).map((g) => g.title)).toEqual([
      'Owners',
      'Repositories',
      'Suggestions',
    ])
    expect(groupSearchResults(searchResults.slice(0, 2)).map((g) => g.title)).toEqual(['Owners'])
  })

  it('defaults the hint to Jump to except for suggestions', () => {
    expect(searchHint(searchResults[0]!)).toBe('Jump to')
    expect(searchHint({ ...searchResults[4]!, hint: undefined })).toBe('')
    expect(searchHint(searchResults[4]!)).toBe('Explore')
  })
})

describe('PynGlobalSearch dropdown', () => {
  it('stays closed until there is text and opens on focus', async () => {
    const w = make()
    expect(w.find('[role="listbox"]').isVisible()).toBe(false)
    await type(w, 'co')
    expect(w.find('[role="listbox"]').isVisible()).toBe(true)
    expect(w.findAll('[data-group]').map((g) => g.text())).toEqual([
      'Owners',
      'Repositories',
      'Suggestions',
    ])
    expect(w.findAll('[role="option"]')).toHaveLength(5)
    expect(w.find('[role="option"]').attributes('href')).toBe('/studio')
    expect(w.find('[role="option"]').text()).toContain('Jump to')
  })

  it('moves with the arrow keys and activates with Enter instead of searching', async () => {
    const w = make()
    const input = await type(w, 'co')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toBe(
      w.findAll('[role="option"]')[1]!.attributes('id'),
    )
    await input.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('select')![0]).toEqual([searchResults[1]])
    expect(w.emitted('search')).toBeUndefined()
  })

  it('submits a search on Enter when nothing is highlighted', async () => {
    const w = make()
    const input = await type(w, ' co ')
    await input.trigger('keydown', { key: 'Enter' })
    await w.find('form').trigger('submit')
    expect(w.emitted('search')![0]).toEqual(['co'])
  })

  it('closes on Escape and when the form loses focus', async () => {
    const w = make()
    const input = await type(w, 'co')
    await input.trigger('keydown', { key: 'Escape' })
    expect(w.find('[role="listbox"]').isVisible()).toBe(false)
    await input.setValue('cor')
    expect(w.find('[role="listbox"]').isVisible()).toBe(true)
    await w.find('form').trigger('focusout')
    expect(w.find('[role="listbox"]').isVisible()).toBe(false)
  })

  it('keeps the datalist when no results are given', () => {
    const w = mount(PynGlobalSearch, { props: { options: ['a/b'] } })
    expect(w.find('datalist option').exists()).toBe(true)
    expect(w.find('[role="listbox"]').exists()).toBe(false)
  })

  it('is forwarded by the top bar', async () => {
    const w = mount(PynTopBar, {
      props: { user: 'alice', theme: 'system', searchResults },
      attachTo: document.body,
    })
    const input = w.find('input[type="search"]')
    await input.trigger('focusin')
    await input.setValue('co')
    await w.findAll('[role="option"]')[0]!.trigger('click')
    expect(w.emitted('selectResult')![0]).toEqual([searchResults[0]])
  })
})
