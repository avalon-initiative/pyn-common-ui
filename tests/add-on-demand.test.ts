import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  PynAddAccount,
  PynAddPerson,
  PynEmailAddresses,
  PynKeys,
  PynServerInvitations,
  PynTokens,
  PynInvites,
  PynOrgMembers,
  PynRepoCollaborators,
  PynTeamDetail,
  PynTeamForm,
  PynTeamGrant,
  PynTeamList,
  teamSlug,
} from '../src'
import { teams } from '../src/stories/org-data'

const byText = (w: ReturnType<typeof mount>, text: string) =>
  w.findAll('button').find((b) => b.text() === text)

describe('teamSlug', () => {
  it('trims, turns whitespace runs into one dash and lowercases', () => {
    expect(teamSlug('  Level   Design Team ')).toBe('level-design-team')
    expect(teamSlug('QA')).toBe('qa')
    expect(teamSlug('   ')).toBe('')
  })

  it('follows the server rule on the shared cases', () => {
    const cases: [string, string][] = [
      ['Art & Sound', 'art-sound'],
      ['Équipe Son', 'equipe-son'],
      ['Straße', 'strasse'],
      ['Smørrebrød', 'smorrebrod'],
      ['Łódź Team', 'lodz-team'],
      ['  Ünïcödé  ', 'unicode'],
      ['日本', ''],
    ]
    for (const [name, slug] of cases) expect(teamSlug(name), name).toBe(slug)
  })

  it('keeps underscores, collapses dashes and is empty past 39 characters', () => {
    expect(teamSlug('QA_Team 2')).toBe('qa_team-2')
    expect(teamSlug('--Ops--')).toBe('ops')
    expect(teamSlug('ÆTHER Þing Œuvre Đorđe')).toBe('aether-thing-oeuvre-dorde')
    expect(teamSlug('x'.repeat(39))).toBe('x'.repeat(39))
    expect(teamSlug('x'.repeat(40))).toBe('')
  })
})

describe('PynTeamForm create', () => {
  it('shows New team until pressed, then the name form with a slug preview', async () => {
    const w = mount(PynTeamForm, { attachTo: document.body })
    expect(w.find('form').exists()).toBe(false)
    await byText(w, 'New team')!.trigger('click')
    await flushPromises()
    const input = w.find('input')
    expect(document.activeElement).toBe(input.element)
    expect(w.findAll('input')).toHaveLength(1)
    expect(w.find('[data-slug]').exists()).toBe(false)
    await input.setValue(' Level Design ')
    expect(w.find('[data-slug]').text()).toBe('Will be created as: level-design')
    expect(input.attributes('aria-describedby')).toBe(w.find('[data-slug]').attributes('id'))
    expect(w.emitted('update:adding')?.[0]).toEqual([true])
    w.unmount()
  })

  it('Cancel closes, clears the fields and returns focus to New team', async () => {
    const w = mount(PynTeamForm, { props: { adding: true }, attachTo: document.body })
    await w.find('input').setValue('Artists')
    await byText(w, 'Cancel')!.trigger('click')
    expect(w.emitted('cancel')).toHaveLength(1)
    expect(w.emitted('update:adding')?.at(-1)).toEqual([false])
    await w.setProps({ adding: false })
    await flushPromises()
    expect(w.find('form').exists()).toBe(false)
    expect(document.activeElement).toBe(byText(w, 'New team')!.element)
    await w.setProps({ adding: true })
    expect((w.find('input').element as HTMLInputElement).value).toBe('')
    w.unmount()
  })

  it('closes when the app clears adding after a success', async () => {
    const w = mount(PynTeamForm, { props: { adding: true } })
    await w.setProps({ adding: false })
    expect(w.find('form').exists()).toBe(false)
    expect(byText(w, 'New team')).toBeDefined()
  })

  it('edit mode is always open and has no New team or Cancel', () => {
    const w = mount(PynTeamForm, { props: { team: teams[0] } })
    expect(w.find('form').exists()).toBe(true)
    expect(byText(w, 'New team')).toBeUndefined()
    expect(byText(w, 'Cancel')).toBeUndefined()
    expect(w.find('[data-slug]').exists()).toBe(false)
  })
})

describe('PynTeamList rows', () => {
  it('makes the name link the row target, one link per row', () => {
    const w = mount(PynTeamList, { props: { org: 'studio', teams } })
    const rows = w.findAll('[data-team]')
    expect(rows).toHaveLength(teams.length)
    for (const row of rows) expect(row.findAll('a')).toHaveLength(1)
    expect(rows[0]!.find('a').classes().join(' ')).toMatch(/link/)
  })
})

describe('PynOrgMembers add', () => {
  const props = {
    members: [{ user: 'alice', role: 'owner' as const }],
    self: 'alice',
    owner: true,
  }

  it('shows Add member until pressed; Cancel closes', async () => {
    const w = mount(PynOrgMembers, { props })
    expect(w.find('input').exists()).toBe(false)
    await byText(w, 'Add member')!.trigger('click')
    expect(w.find('input').exists()).toBe(true)
    await byText(w, 'Cancel')!.trigger('click')
    expect(w.find('input').exists()).toBe(false)
    expect(w.emitted('cancel')).toHaveLength(1)
  })

  it('shows an error outside the closed form', () => {
    const w = mount(PynOrgMembers, { props: { ...props, error: 'nope' } })
    expect(w.find('[role=alert]').text()).toBe('nope')
  })

  it('has no Add member for a non-owner', () => {
    const w = mount(PynOrgMembers, { props: { ...props, owner: false } })
    expect(byText(w, 'Add member')).toBeUndefined()
  })
})

describe('PynInvites create', () => {
  it('shows New invitation until pressed; Cancel closes', async () => {
    const w = mount(PynInvites, { props: { invites: [], roles: ['reader'] } })
    expect(w.find('form').exists()).toBe(false)
    await byText(w, 'New invitation')!.trigger('click')
    expect(w.find('form').exists()).toBe(true)
    await byText(w, 'Cancel')!.trigger('click')
    expect(w.find('form').exists()).toBe(false)
  })
})

describe('Cancel on the access panels', () => {
  it('PynAddPerson and PynTeamGrant add Cancel only with cancelLabel', async () => {
    const person = mount(PynAddPerson, { props: { roles: ['reader'], cancelLabel: 'Cancel' } })
    await byText(person, 'Cancel')!.trigger('click')
    expect(person.emitted('cancel')).toHaveLength(1)
    expect(byText(mount(PynAddPerson, { props: { roles: ['reader'] } }), 'Cancel')).toBeUndefined()
    const grant = mount(PynTeamGrant, {
      props: { teams: ['qa'], roles: ['reader'], cancelLabel: 'Cancel' },
    })
    await byText(grant, 'Cancel')!.trigger('click')
    expect(grant.emitted('cancel')).toHaveLength(1)
  })

  it('PynRepoCollaborators closes the add panel and opens invitations on demand', async () => {
    const w = mount(PynRepoCollaborators, {
      props: {
        rows: [],
        count: 0,
        roles: ['reader'],
        canManage: true,
        invites: [],
        adding: 'people',
      },
    })
    expect(w.find('[data-add=people]').exists()).toBe(true)
    await byText(w, 'Cancel')!.trigger('click')
    expect(w.emitted('update:adding')?.at(-1)).toEqual([undefined])
    expect(w.find('[data-add=people]').exists()).toBe(false)
    expect(w.findAll('form')).toHaveLength(0)
    await byText(w, 'New invitation')!.trigger('click')
    expect(w.emitted('update:inviting')?.at(-1)).toEqual([true])
    expect(w.findAll('form')).toHaveLength(1)
  })

  it('PynTeamDetail Cancel closes the add panel', async () => {
    const w = mount(PynTeamDetail, {
      props: { team: teams[0]!, candidates: ['zoe'], owner: true, adding: true },
    })
    await byText(w, 'Cancel')!.trigger('click')
    expect(w.emitted('update:adding')?.at(-1)).toEqual([false])
  })
})

describe('account and administrator forms', () => {
  it.each([
    ['PynKeys', PynKeys, { keys: [] }, 'New SSH key'],
    ['PynEmailAddresses', PynEmailAddresses, { emails: [] }, 'Add email address'],
    ['PynAddAccount', PynAddAccount, {}, 'Add account'],
    ['PynServerInvitations', PynServerInvitations, { invitations: [] }, 'New invitation'],
  ] as const)('%s shows its button until pressed; Cancel closes', async (_, c, props, label) => {
    const w = mount(c as never, { props: props as never, attachTo: document.body })
    expect(w.find('form').exists()).toBe(false)
    await byText(w, label)!.trigger('click')
    await flushPromises()
    expect(w.find('form').exists()).toBe(true)
    expect(document.activeElement?.tagName).toBe('INPUT')
    await byText(w, 'Cancel')!.trigger('click')
    await flushPromises()
    expect(w.find('form').exists()).toBe(false)
    expect(w.emitted('cancel')).toHaveLength(1)
    expect(document.activeElement).toBe(byText(w, label)!.element)
    w.unmount()
  })

  it('shows a remove error with the key form closed', () => {
    const w = mount(PynKeys, { props: { keys: [], error: 'gone' } })
    expect(w.find('[role=alert]').text()).toBe('gone')
  })

  it('PynServerInvitations closes once the new code arrives', async () => {
    const w = mount(PynServerInvitations, { props: { invitations: [], adding: true } })
    await w.setProps({ created: 'pyni_x' })
    expect(w.emitted('update:adding')?.at(-1)).toEqual([false])
  })

  it('PynTokens opens from v-model:adding and shows errors while closed', () => {
    const props = { tokens: [], owners: [], repos: [] }
    expect(
      mount(PynTokens, { props: { ...props, adding: true } })
        .find('form')
        .exists(),
    ).toBe(true)
    const closed = mount(PynTokens, { props: { ...props, error: 'nope' } })
    expect(closed.find('form').exists()).toBe(false)
    expect(closed.find('[role=alert]').text()).toBe('nope')
  })
})
