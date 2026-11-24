import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { PynAccessPage, PynSettingsSection, accessControls, accessCounts } from '../src'
import { accessRoles, directRows } from '../src/stories/access-page-data'

const make = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(PynAccessPage, {
    props: {
      rows: directRows,
      count: directRows.length,
      roles: accessRoles,
      canManage: true,
      ...props,
    },
    slots,
    attachTo: document.body,
  })

describe('access page state', () => {
  it('words counts', () => {
    expect(accessCounts(1, 0)).toBe('1 person and 0 teams')
    expect(accessCounts(3, 1)).toBe('3 people and 1 team')
  })
  it('builds type and role controls', () => {
    const c = accessControls(['a', 'b'], 'team', 'b')
    expect(c.map((x) => [x.id, x.value])).toEqual([
      ['type', 'team'],
      ['role', 'b'],
    ])
    expect(c[1]!.options.map((o) => o.value)).toEqual(['all', 'a', 'b'])
  })
})

describe('PynAccessPage', () => {
  it('shows the visibility row and the three cards', () => {
    const w = make({
      canManageVisibility: true,
      baseRole: 'reader',
      directPeople: 3,
      directTeams: 1,
    })
    expect(w.find('[data-visibility]').text()).toContain('Private repository')
    expect(w.findAll('[data-card]').map((c) => c.attributes('data-card'))).toEqual([
      'base-role',
      'direct',
      'organization',
    ])
    expect(w.find('[data-card="base-role"]').text()).toContain('reader')
    expect(w.find('[data-card="direct"]').text()).toContain('3 people and 1 team')
    const btn = w.findAll('button').find((b) => b.text() === 'Manage visibility')!
    return btn.trigger('click').then(() => expect(w.emitted('manageVisibility')).toHaveLength(1))
  })

  it('says so when no base role is set and when owned by a person', () => {
    const w = make({ baseRoleHref: '/s' })
    expect(w.find('[data-card="base-role"]').text()).toContain('No base role set')
    expect(w.find('[data-card="base-role"] a').attributes('href')).toBe('/s')
    expect(w.find('[data-card="organization"]').text()).toContain('Owned by a person')
  })

  it('reuses the settings section and lists rows with the count header', () => {
    const w = make()
    expect(w.findComponent(PynSettingsSection).exists()).toBe(true)
    expect(w.findAll('li[class*="row"]')).toHaveLength(4)
    expect(w.find('[data-count]').text()).toContain('4')
    expect(w.findAll('select').map((s) => s.attributes('aria-label'))).toEqual(
      expect.arrayContaining(['Type', 'Role', 'Role of alice']),
    )
  })

  it('switches tabs with the arrow keys', async () => {
    const w = make()
    const tabs = w.findAll('[role="tab"]')
    expect(tabs.map((t) => t.attributes('aria-selected'))).toEqual(['true', 'false'])
    await tabs[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:tab')![0]).toEqual(['organization'])
  })

  it('emits filters, role changes and revokes', async () => {
    const w = make()
    await w.find('select[aria-label="Role"]').setValue('writer')
    expect(w.emitted('filter')![0]).toEqual(['role', 'writer'])
    await w.find('select[aria-label="Role of bob"]').setValue('reader')
    expect(w.emitted('setRole')![0]).toEqual([{ name: 'bob', role: 'reader' }])
    await w.find('button[aria-label="Revoke bob"]').trigger('click')
    expect(w.emitted('revoke')![0]).toEqual(['bob'])
  })

  it('shows the empty state and the no-match text', () => {
    expect(make({ rows: [], count: 0 }).text()).toContain('No people or teams have direct access')
    expect(make({ rows: [], count: 0, tab: 'organization' }).text()).toContain('organization-based')
    expect(make({ rows: [], count: 0, type: 'team' }).find('[data-no-match]').exists()).toBe(true)
  })

  it('opens the add panels and the invitations slot', async () => {
    const w = make({}, { addPeople: 'PEOPLE', addTeams: 'TEAMS', invites: 'INV' })
    expect(w.find('[data-add]').exists()).toBe(false)
    await w
      .findAll('button')
      .find((b) => b.text() === 'Add people')!
      .trigger('click')
    expect(w.emitted('add')![0]).toEqual(['people'])
    expect(w.emitted('update:adding')![0]).toEqual(['people'])
    expect(w.text()).toContain('Invitations')
    expect(w.text()).toContain('INV')
  })

  it('hides write controls without canManage', () => {
    const w = make({ canManage: false })
    expect(w.text()).not.toContain('Add people')
    expect(w.find('button[aria-label^="Revoke"]').exists()).toBe(false)
    expect(w.find('select[aria-label="Role of bob"]').exists()).toBe(false)
  })
})
