import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import {
  PynCommandPalette,
  PynShortcutsHelp,
  createShortcutMatcher,
  filterCommands,
  groupCommands,
  moveActive,
  resultsText,
} from '../src/index'
import type { CommandItem } from '../src/index'

const items: CommandItem[] = [
  { id: 'a', label: 'Repositories', group: 'Go to', href: '#/repos' },
  { id: 'b', label: 'Organizations', group: 'Go to', href: '#/orgs', keywords: ['teams'] },
  { id: 'c', label: 'acme/textures', group: 'Repos', href: '#/acme', hint: 'repo' },
  { id: 'd', label: 'New repository', group: 'Actions', keywords: ['create'] },
]

describe('filterCommands', () => {
  it('keeps everything in order for empty text', () => {
    expect(filterCommands(items, '  ').map((i) => i.id)).toEqual(['a', 'b', 'c', 'd'])
  })
  it('ranks prefix above substring above subsequence, ties stable', () => {
    const list: CommandItem[] = [
      { id: '1', label: 'my-repo', group: 'g' },
      { id: '2', label: 'repo list', group: 'g' },
      { id: '3', label: 'r-e-p-o', group: 'g' },
      { id: '4', label: 'repo two', group: 'g' },
    ]
    expect(filterCommands(list, 'repo').map((i) => i.id)).toEqual(['2', '4', '1', '3'])
  })
  it('matches keywords below labels and drops non-matches', () => {
    expect(filterCommands(items, 'teams').map((i) => i.id)).toEqual(['b'])
    expect(filterCommands(items, 'zzz')).toEqual([])
    const both: CommandItem[] = [
      { id: 'k', label: 'Other', group: 'g', keywords: ['alpha'] },
      { id: 'l', label: 'Alpha', group: 'g' },
    ]
    expect(filterCommands(both, 'alpha').map((i) => i.id)).toEqual(['l', 'k'])
  })
  it('is case insensitive and fuzzy', () => {
    expect(filterCommands(items, 'ORGS').map((i) => i.id)).toEqual(['b'])
    expect(filterCommands(items, 'nwrp').map((i) => i.id)).toEqual(['d'])
  })
  it('does not mutate the input', () => {
    const copy = [...items]
    filterCommands(items, 'o')
    expect(items).toEqual(copy)
  })
})

describe('command palette helpers', () => {
  it('groups by first appearance', () => {
    const g = groupCommands([items[0], items[2], items[1]])
    expect(g.map((x) => [x.group, x.items.length])).toEqual([
      ['Go to', 2],
      ['Repos', 1],
    ])
  })
  it('words the result count', () => {
    expect(resultsText(1, false, 'None')).toBe('1 result')
    expect(resultsText(3, false, 'None')).toBe('3 results')
    expect(resultsText(0, false, 'None')).toBe('None')
    expect(resultsText(0, true, 'None')).toBe('Loading…')
  })
  it('moves the active index', () => {
    expect(moveActive(0, 3, 'ArrowUp')).toBe(2)
    expect(moveActive(2, 3, 'ArrowDown')).toBe(0)
    expect(moveActive(1, 3, 'Home')).toBe(0)
    expect(moveActive(0, 3, 'End')).toBe(2)
    expect(moveActive(0, 0, 'ArrowDown')).toBe(-1)
  })
})

const mounted: { unmount(): void }[] = []
function palette(props: Record<string, unknown> = {}) {
  const w = mount(PynCommandPalette, {
    props: { open: true, items, label: 'Command palette', ...props },
    attachTo: document.body,
  })
  mounted.push(w)
  return w
}
afterEach(() => {
  while (mounted.length) mounted.pop()?.unmount()
  document.body.style.overflow = ''
  document.body.innerHTML = ''
})

describe('PynCommandPalette', () => {
  it('renders a labelled modal dialog with a combobox and grouped listbox', async () => {
    const w = palette()
    await nextTick()
    const dialog = w.get('[role="dialog"]')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-label')).toBe('Command palette')
    const input = w.get('input')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-label')).toBe('Command palette')
    expect(input.attributes('aria-controls')).toBe(w.get('[role="listbox"]').attributes('id'))
    expect(w.findAll('[role="group"]').map((g) => g.get('div').text())).toEqual([
      'Go to',
      'Repos',
      'Actions',
    ])
    expect(w.findAll('[role="option"]')).toHaveLength(4)
    expect(w.findAll('a[role="option"]')).toHaveLength(3)
    expect(document.activeElement).toBe(input.element)
  })

  it('locks page scroll while open and restores it', async () => {
    document.body.style.overflow = 'auto'
    const w = palette()
    expect(document.body.style.overflow).toBe('hidden')
    await w.setProps({ open: false })
    expect(document.body.style.overflow).toBe('auto')
  })

  it('points aria-activedescendant at the active option and moves with keys', async () => {
    const w = palette()
    const input = w.get('input')
    const ids = () => w.findAll('[role="option"]').map((o) => o.attributes('id'))
    const selected = () =>
      w.findAll('[role="option"]').findIndex((o) => o.attributes('aria-selected') === 'true')
    expect(input.attributes('aria-activedescendant')).toBe(ids()[0])
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(selected()).toBe(1)
    expect(input.attributes('aria-activedescendant')).toBe(ids()[1])
    await input.trigger('keydown', { key: 'End' })
    expect(selected()).toBe(3)
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(selected()).toBe(0)
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(selected()).toBe(3)
    await input.trigger('keydown', { key: 'Home' })
    expect(selected()).toBe(0)
  })

  it('filters while typing, emits input and resets the active option', async () => {
    const w = palette()
    const input = w.get('input')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.setValue('org')
    expect(w.emitted('input')?.[0]).toEqual(['org'])
    expect(w.findAll('[role="option"]').map((o) => o.text())).toEqual(['Organizations'])
    expect(w.findAll('[role="option"]')[0].attributes('aria-selected')).toBe('true')
    expect(w.get('[role="status"]').text()).toBe('1 result')
  })

  it('announces the result count', async () => {
    const w = palette()
    expect(w.get('[role="status"]').text()).toBe('4 results')
    await w.get('input').setValue('zzz')
    expect(w.get('[role="status"]').text()).toBe('No results')
    expect(w.text()).toContain('No results')
  })

  it('shows custom empty and loading states', async () => {
    const w = palette({ items: [], emptyLabel: 'Nothing here' })
    expect(w.text()).toContain('Nothing here')
    await w.setProps({ loading: true })
    expect(w.get('[role="listbox"]').attributes('aria-busy')).toBe('true')
    expect(w.get('[role="status"]').text()).toBe('Loading…')
    expect(w.text()).not.toContain('Nothing here')
  })

  it('Enter chooses the active item and follows a real anchor', async () => {
    const w = palette()
    const anchor = w.get('a[role="option"]').element as HTMLAnchorElement
    const click = vi.fn((e: Event) => e.preventDefault())
    anchor.addEventListener('click', click)
    await w.get('input').trigger('keydown', { key: 'Enter' })
    expect(click).toHaveBeenCalled()
    expect(anchor.getAttribute('href')).toBe('#/repos')
    expect(w.emitted('select')?.[0]).toEqual([items[0]])
  })

  it('Enter on an item without href emits select, and click selects too', async () => {
    const w = palette()
    const input = w.get('input')
    await input.trigger('keydown', { key: 'End' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('select')?.[0]).toEqual([items[3]])
    await w.findAll('[role="option"]')[2].trigger('click')
    expect(w.emitted('select')?.[1]).toEqual([items[2]])
  })

  it('Enter with no results does nothing', async () => {
    const w = palette({ items: [] })
    await w.get('input').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('select')).toBeUndefined()
  })

  it('Escape and the backdrop close', async () => {
    const w = palette()
    await w.get('input').trigger('keydown', { key: 'Escape' })
    await w.get('[data-test="backdrop"]').trigger('click')
    expect(w.emitted('close')).toHaveLength(2)
  })

  it('keeps focus on the field for Tab and Shift+Tab', async () => {
    const w = palette()
    const input = w.get('input').element
    const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    input.dispatchEvent(ev)
    expect(ev.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(input)
  })

  it('returns focus to the opener on close', async () => {
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()
    const w = palette({ open: false })
    await w.setProps({ open: true })
    await nextTick()
    expect(document.activeElement).toBe(w.get('input').element)
    await w.setProps({ open: false })
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(button)
  })

  it('clears the text when reopened', async () => {
    const w = palette()
    await w.get('input').setValue('org')
    await w.setProps({ open: false })
    await w.setProps({ open: true })
    await nextTick()
    expect((w.get('input').element as HTMLInputElement).value).toBe('')
  })
})

describe('PynShortcutsHelp', () => {
  const groups = [
    { title: 'Site', shortcuts: [{ keys: ['?'], label: 'Show shortcuts' }] },
    { title: 'Go to', shortcuts: [{ keys: ['g', 'h'], label: 'Home' }] },
  ]
  function help(props: Record<string, unknown> = {}) {
    const w = mount(PynShortcutsHelp, {
      props: { open: true, groups, label: 'Keyboard shortcuts', ...props },
      attachTo: document.body,
    })
    mounted.push(w)
    return w
  }

  it('renders a labelled modal with kbd elements', () => {
    const w = help()
    const dialog = w.get('[role="dialog"]')
    expect(dialog.attributes('aria-modal')).toBe('true')
    const title = w.get('h2')
    expect(dialog.attributes('aria-labelledby')).toBe(title.attributes('id'))
    expect(title.text()).toBe('Keyboard shortcuts')
    expect(w.findAll('kbd').map((k) => k.text())).toEqual(['?', 'g', 'h'])
    expect(w.findAll('h3').map((h) => h.text())).toEqual(['Site', 'Go to'])
  })

  it('closes on Escape, the button and the backdrop; renders nothing when closed', async () => {
    const w = help()
    await w.get('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    await w.get('button').trigger('click')
    await w.get('[data-test="backdrop"]').trigger('click')
    expect(w.emitted('close')).toHaveLength(3)
    await w.setProps({ open: false })
    expect(w.find('[role="dialog"]').exists()).toBe(false)
  })

  it('traps Tab on the close button and returns focus', async () => {
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()
    const w = help({ open: false })
    await w.setProps({ open: true })
    await nextTick()
    expect(document.activeElement).toBe(w.get('[role="dialog"]').element)
    const close = w.get('button').element
    close.focus()
    const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    close.dispatchEvent(ev)
    expect(ev.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(close)
    await w.setProps({ open: false })
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(button)
  })
})

describe('createShortcutMatcher', () => {
  const bindings = [
    { id: 'search', keys: ['/'] },
    { id: 'help', keys: ['?'] },
    { id: 'home', keys: ['g', 'h'] },
    { id: 'repos', keys: ['g', 'r'] },
  ]
  function key(k: string, init: KeyboardEventInit = {}, target?: Element): KeyboardEvent {
    const e = new KeyboardEvent('keydown', { key: k, bubbles: true, ...init })
    if (target) Object.defineProperty(e, 'target', { value: target })
    return e
  }

  it('matches single keys, with Shift allowed for ?', () => {
    const m = createShortcutMatcher(bindings, { timeoutMs: 1000 })
    expect(m.handle(key('/'))).toBe('search')
    expect(m.handle(key('?', { shiftKey: true }))).toBe('help')
    expect(m.handle(key('x'))).toBeNull()
  })

  it('matches a two-key sequence and resets afterwards', () => {
    const m = createShortcutMatcher(bindings)
    expect(m.handle(key('g'))).toBeNull()
    expect(m.handle(key('h'))).toBe('home')
    expect(m.handle(key('h'))).toBeNull()
    expect(m.handle(key('g'))).toBeNull()
    expect(m.handle(key('r'))).toBe('repos')
  })

  it('ignores modifier-only key presses inside a sequence', () => {
    const m = createShortcutMatcher(bindings)
    m.handle(key('g'))
    expect(m.handle(key('Shift', { shiftKey: true }))).toBeNull()
    expect(m.handle(key('h'))).toBe('home')
  })

  it('resets on a non-matching key, which can start a new sequence', () => {
    const m = createShortcutMatcher(bindings)
    m.handle(key('g'))
    expect(m.handle(key('x'))).toBeNull()
    expect(m.handle(key('h'))).toBeNull()
    m.handle(key('g'))
    expect(m.handle(key('g'))).toBeNull()
    expect(m.handle(key('h'))).toBe('home')
    m.handle(key('g'))
    expect(m.handle(key('/'))).toBe('search')
  })

  it('times out between keys', () => {
    vi.useFakeTimers()
    try {
      const m = createShortcutMatcher(bindings, { timeoutMs: 500 })
      m.handle(key('g'))
      vi.advanceTimersByTime(501)
      expect(m.handle(key('h'))).toBeNull()
      m.handle(key('g'))
      vi.advanceTimersByTime(499)
      expect(m.handle(key('h'))).toBe('home')
    } finally {
      vi.useRealTimers()
    }
  })

  it('ignores events while typing', () => {
    const m = createShortcutMatcher(bindings)
    for (const html of [
      '<input>',
      '<textarea></textarea>',
      '<select></select>',
      '<div contenteditable="true"><span id="in"></span></div>',
      '<div contenteditable=""></div>',
    ]) {
      document.body.innerHTML = html
      const el = document.body.querySelector('#in') ?? document.body.firstElementChild!
      expect(m.handle(key('/', {}, el))).toBeNull()
    }
    document.body.innerHTML = '<div contenteditable="false"></div>'
    expect(m.handle(key('/', {}, document.body.firstElementChild!))).toBe('search')
  })

  it('typing in the middle of a sequence cancels it', () => {
    const m = createShortcutMatcher(bindings)
    document.body.innerHTML = '<input>'
    m.handle(key('g'))
    m.handle(key('h', {}, document.body.firstElementChild!))
    expect(m.handle(key('h'))).toBeNull()
  })

  it('ignores Ctrl, Meta and Alt', () => {
    const m = createShortcutMatcher(bindings)
    expect(m.handle(key('/', { ctrlKey: true }))).toBeNull()
    expect(m.handle(key('/', { metaKey: true }))).toBeNull()
    expect(m.handle(key('/', { altKey: true }))).toBeNull()
    m.handle(key('g'))
    m.handle(key('x', { ctrlKey: true }))
    expect(m.handle(key('h'))).toBeNull()
  })

  it('reset clears a pending sequence', () => {
    const m = createShortcutMatcher(bindings)
    m.handle(key('g'))
    m.reset()
    expect(m.handle(key('h'))).toBeNull()
  })
})

describe('PynCommandPalette unfiltered prop', () => {
  const items = [
    { id: 'a', label: 'Alpha', group: 'G' },
    { id: 'b', label: 'Beta', group: 'G' },
  ]
  it('filters locally by default and shows the items as given when unfiltered', async () => {
    const w = mount(PynCommandPalette, { props: { open: true, items, label: 'Palette' } })
    await w.find('input').setValue('zzz')
    expect(w.findAll('[role=option]')).toHaveLength(0)
    await w.setProps({ unfiltered: true })
    expect(w.findAll('[role=option]')).toHaveLength(2)
  })
})
