import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PynBranchList, PynLoading, PynPolicyView, PynSignInPrompt, branchCounts } from '../src'

const now = new Date('2026-11-22T12:00:00Z')

describe('PynLoading', () => {
  it('is a polite status with a hidden label and a default text', () => {
    const w = mount(PynLoading)
    expect(w.attributes('role')).toBe('status')
    expect(w.attributes('aria-live')).toBe('polite')
    expect(w.text()).toBe('Loading')
    expect(w.find('[aria-hidden="true"]').exists()).toBe(true)
  })

  it('takes a label and variants; the block variant draws skeleton lines', () => {
    const inline = mount(PynLoading, { props: { label: 'Loading files' } })
    expect(inline.text()).toBe('Loading files')
    expect(inline.attributes('data-variant')).toBe('inline')
    const compact = mount(PynLoading, { props: { variant: 'compact' } })
    expect(compact.attributes('data-variant')).toBe('compact')
    const block = mount(PynLoading, { props: { variant: 'block' } })
    expect(block.attributes('data-variant')).toBe('block')
    expect(block.find('[aria-hidden="true"]').element.children).toHaveLength(3)
    expect(block.attributes('role')).toBe('status')
  })
})

describe('PynPolicyView', () => {
  const rules = [
    { pattern: '*.psd', mode: 'exclusive' as const, comment: 'Binary' },
    { pattern: 'docs/**', mode: 'shared' as const },
  ]
  const make = (props: Record<string, unknown> = {}) =>
    mount(PynPolicyView, { props: { mode: 'shared', rules, ...props } })

  it('lists the rules in order with the default file name and mode', () => {
    const w = make()
    expect(w.find('[data-file]').text()).toBe('.pyn/pyn.toml')
    expect(w.text()).toContain('Default mode:')
    const rows = w.findAll('tbody tr')
    expect(rows.map((r) => r.find('code').text())).toEqual(['*.psd', 'docs/**'])
    expect(rows[0]!.text()).toContain('Binary')
    expect(w.text()).toContain('Shared')
    expect(w.text()).toContain('Exclusive')
    expect(w.find('caption').exists()).toBe(true)
    expect(w.find('[data-match]').exists()).toBe(false)
  })

  it('shows a custom file name and the edit link only when given', () => {
    expect(make().find('[data-edit]').exists()).toBe(false)
    const w = make({ file: 'pyn.toml', editHref: '/x/settings' })
    expect(w.find('[data-file]').text()).toBe('pyn.toml')
    expect(w.find('[data-edit]').attributes('href')).toBe('/x/settings')
  })

  it('highlights the matched rule by index or pattern and says which', () => {
    const byIndex = make({ path: 'a.psd', matched: 0 })
    expect(byIndex.find('[data-match]').text()).toContain('Matches rule 1')
    const rows = byIndex.findAll('tbody tr')
    expect(rows[0]!.attributes('data-matched')).toBeDefined()
    expect(rows[0]!.attributes('aria-current')).toBe('true')
    expect(rows[0]!.text()).toContain('Matched')
    expect(rows[1]!.attributes('data-matched')).toBeUndefined()
    const byPattern = make({ path: 'docs/a.md', matched: 'docs/**' })
    expect(byPattern.find('[data-match]').text()).toContain('Matches rule 2')
  })

  it('says the default applies when no rule matches', () => {
    const w = make({ path: 'README.md' })
    expect(w.find('[data-match]').text()).toContain('Matches no rule')
    expect(w.find('[data-matched]').exists()).toBe(false)
  })

  it('has an empty state naming the default mode', () => {
    const w = make({ rules: [], mode: 'exclusive' })
    expect(w.find('[data-empty]').text()).toBe('No rules: every path is exclusive')
    expect(w.find('table').exists()).toBe(false)
  })

  it('shows loading and error states', () => {
    expect(make({ loading: true }).find('[role=status]').text()).toBe('Loading policy')
    const e = make({ error: 'Nope' })
    expect(e.find('[role=alert]').text()).toBe('Nope')
    expect(e.find('table').exists()).toBe(false)
  })

  it('labels the section by its heading level', () => {
    const w = make({ headingLevel: 3 })
    expect(w.find('h3').text()).toBe('Path policy')
    expect(w.find('section').attributes('aria-labelledby')).toBe(w.find('h3').attributes('id'))
  })
})

describe('PynBranchList', () => {
  const branches = [
    { name: 'main', isDefault: true, updatedAt: '2026-11-22T10:00:00Z', href: '/r' },
    {
      name: 'topic',
      ahead: 4,
      behind: 0,
      updatedAt: '2026-11-20T12:00:00Z',
      href: '/r/topic',
      compareHref: '/r/compare/topic',
    },
    { name: 'plain' },
  ]
  const make = (props: Record<string, unknown> = {}) =>
    mount(PynBranchList, { props: { branches, now, ...props } })

  it('lists rows with links, the default marker as text, counts, time and compare', () => {
    const w = make()
    const rows = w.findAll('li')
    expect(rows).toHaveLength(3)
    expect(rows[0]!.find('[data-default-marker]').text()).toBe('default')
    expect(rows[0]!.find('a').attributes('href')).toBe('/r')
    expect(rows[0]!.find('[data-ahead-behind]').exists()).toBe(false)
    expect(rows[0]!.find('[data-compare]').exists()).toBe(false)
    expect(rows[1]!.find('[data-ahead-behind]').text()).toBe('4 ahead, 0 behind')
    expect(rows[1]!.find('[data-updated]').text()).toBe('Updated 2 days ago')
    expect(rows[1]!.find('[data-compare]').attributes('href')).toBe('/r/compare/topic')
    expect(rows[1]!.find('[data-compare]').text()).toContain('Compare')
    expect(rows[2]!.find('a').exists()).toBe(false)
    expect(rows[2]!.find('[data-default-marker]').exists()).toBe(false)
  })

  it('marks the default branch by name', () => {
    const w = make({ branches: [{ name: 'trunk' }, { name: 'x' }], defaultBranch: 'trunk' })
    const rows = w.findAll('li')
    expect(rows[0]!.find('[data-default-marker]').exists()).toBe(true)
    expect(rows[1]!.find('[data-default-marker]').exists()).toBe(false)
  })

  it('formats counts from what is given', () => {
    expect(branchCounts({})).toBe('')
    expect(branchCounts({ ahead: 2 })).toBe('2 ahead')
    expect(branchCounts({ behind: 0 })).toBe('0 behind')
    expect(branchCounts({ ahead: 1, behind: 3 })).toBe('1 ahead, 3 behind')
  })

  it('shows an empty state, a loading state and an error', () => {
    const empty = make({ branches: [] })
    expect(empty.find('h3').text()).toBe('No branches')
    expect(empty.find('ul').exists()).toBe(false)
    expect(make({ loading: true }).find('[role=status]').text()).toBe('Loading branches')
    expect(make({ error: 'Failed' }).find('[role=alert]').text()).toBe('Failed')
  })
})

describe('PynSignInPrompt', () => {
  const props = { message: 'Sign in to watch.', signInHref: '/_/sign-in' }

  it('is a labelled, non-modal region with the message and a sign-in link', () => {
    const w = mount(PynSignInPrompt, { props })
    expect(w.attributes('role')).toBe('region')
    expect(w.attributes('aria-modal')).toBeUndefined()
    expect(w.find('h2').text()).toBe('Sign in to continue')
    expect(w.attributes('aria-labelledby')).toBe(w.find('h2').attributes('id'))
    expect(w.text()).toContain('Sign in to watch.')
    expect(w.find('[data-sign-in]').attributes('href')).toBe('/_/sign-in')
    expect(w.find('[data-register]').exists()).toBe(false)
  })

  it('offers registration, a heading level and emits signIn with the click', async () => {
    const w = mount(PynSignInPrompt, {
      props: { ...props, registerHref: '/_/register', headingLevel: 3 },
    })
    expect(w.find('h3').exists()).toBe(true)
    expect(w.find('[data-register]').attributes('href')).toBe('/_/register')
    await w.find('[data-sign-in]').trigger('click')
    expect(w.emitted('signIn')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
  })
})
