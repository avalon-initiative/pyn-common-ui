import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PynAddPerson from '../src/components/PynAddPerson.vue'
import PynInvites from '../src/components/PynInvites.vue'
import PynMembers from '../src/components/PynMembers.vue'
import PynOrgDelete from '../src/components/PynOrgDelete.vue'
import PynOrgRepoPolicy from '../src/components/PynOrgRepoPolicy.vue'
import PynRepoDelete from '../src/components/PynRepoDelete.vue'
import PynRepoForm from '../src/components/PynRepoForm.vue'
import PynTeamGrant from '../src/components/PynTeamGrant.vue'

const roles = ['reader', 'writer']
const writes = ['setRole', 'revoke', 'addUser', 'grant', 'create', 'submit', 'remove']
const sent = (w: ReturnType<typeof mount>) =>
  writes.filter((e) => (w.emitted(e) ?? []).some((a) => !(a[0] instanceof Event)))
const enabled = (w: ReturnType<typeof mount>) =>
  w.findAll('input, select, button').filter((el) => el.attributes('disabled') === undefined)

describe('readonly mode', () => {
  it('PynMembers disables the role pickers and drops revoke', async () => {
    const grantees = [{ name: 'bob', role: 'writer', source: 'direct' as const }]
    const w = mount(PynMembers, { props: { grantees, roles, revocable: true, readonly: true } })
    expect(w.text()).toContain('bob')
    expect(w.find('select').attributes('disabled')).toBeDefined()
    expect(w.find('button').exists()).toBe(false)
    await w.find('select').setValue('reader')
    expect(sent(w)).toEqual([])
    const open = mount(PynMembers, { props: { grantees, roles, revocable: true } })
    expect(open.find('button').exists()).toBe(true)
  })

  it('PynAddPerson disables every control and emits nothing', async () => {
    const w = mount(PynAddPerson, { props: { roles, readonly: true } })
    expect(enabled(w)).toEqual([])
    await w.find('form').trigger('submit')
    expect(sent(w)).toEqual([])
  })

  it('PynTeamGrant disables every control and emits nothing', async () => {
    const w = mount(PynTeamGrant, { props: { teams: ['qa'], roles, readonly: true } })
    expect(enabled(w)).toEqual([])
    await w.find('form').trigger('submit')
    expect(sent(w)).toEqual([])
  })

  it('PynInvites keeps the list, disables the form and drops revoke', async () => {
    const invites = [
      {
        id: 'a',
        role: 'writer',
        created_by: 'alice',
        created_at: '',
        expires_at: '2026-10-11T09:00:00Z',
      },
    ]
    const w = mount(PynInvites, { props: { invites, roles, readonly: true } })
    expect(w.text()).toContain('writer')
    expect(w.findAll('button').every((b) => b.attributes('disabled') !== undefined)).toBe(true)
    expect(enabled(w)).toEqual([])
    await w.find('form').trigger('submit')
    expect(sent(w)).toEqual([])
  })

  it('PynRepoForm shows current values but cannot submit', async () => {
    const repo = { name: 'game', visibility: 'public' as const, lease_hours: 24 }
    const w = mount(PynRepoForm, { props: { owner: 'alice', repo, readonly: true } })
    expect((w.find('input').element as HTMLInputElement).value).toBe('game')
    expect(enabled(w)).toEqual([])
    await w.find('form').trigger('submit')
    expect(sent(w)).toEqual([])
  })

  it.each([
    ['PynRepoDelete', PynRepoDelete, { slug: 'alice/game' }],
    ['PynOrgDelete', PynOrgDelete, { name: 'studio' }],
  ])('%s cannot confirm or delete', async (_n, comp, props) => {
    const w = mount(comp, { props: { ...props, readonly: true } })
    expect(enabled(w)).toEqual([])
    await w.find('form').trigger('submit')
    expect(sent(w)).toEqual([])
  })

  it('PynOrgRepoPolicy shows rules but cannot edit, add or remove', async () => {
    const policy = {
      member_creation: 'private' as const,
      rules: [
        { effect: 'allow' as const, kind: 'team' as const, subject: 'qa', scope: 'both' as const },
      ],
    }
    const w = mount(PynOrgRepoPolicy, {
      props: { policy, teams: ['qa'], members: ['bob'], readonly: true },
    })
    expect(w.text()).toContain('qa')
    expect(w.findAll('button')).toHaveLength(0)
    expect(w.find('form').exists()).toBe(false)
    expect(enabled(w)).toEqual([])
    await w.find('select').setValue('none')
    expect(sent(w)).toEqual([])
  })
})
