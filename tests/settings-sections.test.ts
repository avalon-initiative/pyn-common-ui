import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { accessRoles, directRows } from '../src/stories/access-page-data'
import { orgMembers, repoPolicy, teams } from '../src/stories/org-data'
import {
  PynInvites,
  PynOrgDelete,
  PynOrgRepoPolicy,
  PynOrgSettings,
  PynAccessPage,
  PynRepoCollaborators,
  PynRepoDelete,
  PynTeamDelete,
  PynTeamForm,
  PynTwoFactorRequirement,
  PynSettingsGeneral,
  PynSettingsLayout,
  PynSettingsRow,
  PynSettingsSection,
  PynSettingsToggle,
} from '../src'

describe('settings section patterns', () => {
  it('names a section by its title and shows the description and rows', () => {
    const w = mount(PynSettingsSection, {
      props: { title: 'Access', description: 'Who gets in.' },
      slots: { default: '<p>row</p>' },
    })
    const section = w.find('section')
    expect(section.attributes('aria-labelledby')).toBe(w.find('h3').attributes('id'))
    expect(w.find('h3').text()).toBe('Access')
    expect(w.text()).toContain('Who gets in.')
    expect(w.text()).toContain('row')
  })

  it('marks a danger section', () => {
    const w = mount(PynSettingsSection, { props: { title: 'Danger zone', danger: true } })
    expect(w.find('section').classes().join(' ')).toMatch(/danger/)
  })

  it('shows row title, help and control, labelling the control when `labelFor` is set', () => {
    const w = mount(PynSettingsRow, {
      props: { title: 'Lease', help: 'Hours', labelFor: 'lease' },
      slots: { default: '<input id="lease">' },
    })
    expect(w.find('label').attributes('for')).toBe('lease')
    expect(w.text()).toContain('Hours')
    expect(w.find('input').exists()).toBe(true)
    expect(
      mount(PynSettingsRow, { props: { title: 'X' } })
        .find('label')
        .exists(),
    ).toBe(false)
  })

  it('toggles through v-model and honours disabled', async () => {
    const w = mount(PynSettingsToggle, { props: { title: 'Read-only', modelValue: false } })
    const input = w.find('input')
    expect(input.attributes('role')).toBe('switch')
    expect(w.find('label').attributes('for')).toBe(input.attributes('id'))
    await input.setValue(true)
    expect(w.emitted('update:modelValue')?.[0]).toEqual([true])
    await w.setProps({ disabled: true })
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('renders the picture column only when the slot is given', () => {
    const plain = mount(PynSettingsGeneral, { slots: { default: '<p>fields</p>' } })
    expect(plain.find('aside').exists()).toBe(false)
    const w = mount(PynSettingsGeneral, {
      props: { pictureTitle: 'Profile picture' },
      slots: { default: '<p>fields</p>', picture: '<img alt="">' },
    })
    expect(w.find('aside h4').text()).toBe('Profile picture')
    expect(w.find('aside img').exists()).toBe(true)
  })

  it('builds the layout navigation with PynSubNav, headings and icons', () => {
    const w = mount(PynSettingsLayout, {
      props: {
        label: 'Repository settings',
        current: 'b',
        sections: [
          { id: 'a', label: 'General', href: '/a', icon: 'settings' },
          { id: 'b', label: 'Members', group: 'Access', href: '/b', icon: 'user' },
        ],
      },
    })
    expect(w.find('nav h2').text()).toBe('Access')
    expect(w.findAll('nav svg')).toHaveLength(2)
    expect(w.find('[aria-current=page]').text()).toBe('Members')
  })
})

describe('organization settings sections', () => {
  it('wraps exclusive files and repository creation in titled sections', () => {
    const files = mount(PynOrgSettings, { props: { settings: { exclusive_read_only: null } } })
    expect(files.find('section h3').text()).toBe('Exclusive files')
    const policy = mount(PynOrgRepoPolicy, {
      props: {
        policy: repoPolicy,
        teams: teams.map((t) => t.slug),
        members: orgMembers.map((m) => m.user),
      },
    })
    expect(policy.find('section h3').text()).toBe('Repository creation')
  })

  it('wraps the two-factor requirement only when given a title', () => {
    const setting = { required: false, grace_days: null, since: null }
    const bare = mount(PynTwoFactorRequirement, { props: { setting } })
    expect(bare.find('section').exists()).toBe(false)
    const titled = mount(PynTwoFactorRequirement, {
      props: { setting, title: 'Two-factor authentication' },
    })
    expect(titled.find('section h3').text()).toBe('Two-factor authentication')
  })
})

describe('delete components in a danger section', () => {
  const inDanger = (component: object, props: object) =>
    mount({
      components: { PynSettingsSection, C: component },
      props: { p: { type: Object, default: () => props } },
      template:
        '<PynSettingsSection title="Danger zone" danger><C v-bind="p" /></PynSettingsSection>',
    })

  it.each([
    ['organization', PynOrgDelete, { name: 'studio' }],
    ['team', PynTeamDelete, { slug: 'qa' }],
    ['repository', PynRepoDelete, { slug: 'studio/game' }],
  ])('renders the %s delete without its own border', (_n, component, props) => {
    expect(inDanger(component, props).find('form').attributes('data-bare')).toBeDefined()
    expect(mount(component, { props }).find('form').attributes('data-bare')).toBeUndefined()
  })
})

describe('PynRepoCollaborators', () => {
  const make = (props: Record<string, unknown> = {}) =>
    mount(PynRepoCollaborators, {
      props: {
        rows: directRows,
        count: directRows.length,
        roles: accessRoles,
        teams: ['engine'],
        invites: [],
        canManage: true,
        ...props,
      },
      attachTo: document.body,
    })

  it('shows the access page with the add forms, team grant and invitations in place', async () => {
    const w = make()
    expect(w.text()).toContain('Manage access')
    expect(w.text()).toContain('Invitations')
    await w
      .findAll('button')
      .find((b) => b.text() === 'Add people')!
      .trigger('click')
    expect(w.find('[data-add=people] input').exists()).toBe(true)
    await w
      .findAll('button')
      .find((b) => b.text() === 'Add teams')!
      .trigger('click')
    expect(w.find('[data-add=teams] select').exists()).toBe(true)
  })

  it('emits grant, invite and access page events', async () => {
    const onSetRole = vi.fn()
    const w = make({ adding: 'teams', onSetRole })
    await w.find('[data-add=teams] form').trigger('submit')
    expect(w.emitted('grant')?.[0]).toEqual([{ name: 'engine', role: 'reader' }])
    await w.find('select[aria-label="Role of alice"]').setValue('reader')
    expect(onSetRole).toHaveBeenCalledWith({ name: 'alice', role: 'reader' })
  })

  it('omits invitations without an invites list', () => {
    expect(make({ invites: undefined }).text()).not.toContain('Invitations')
  })
})

describe('settings polish', () => {
  it('gives the organization policy page Repository creation, Rules and Add a rule sections', () => {
    const w = mount(PynOrgRepoPolicy, {
      props: { policy: repoPolicy, teams: ['artists'], members: ['bob'] },
    })
    expect(w.findAll('h3').map((h) => h.text())).toEqual([
      'Repository creation',
      'Rules',
      'Add a rule',
    ])
    expect(w.findAll('section[aria-labelledby]')).toHaveLength(3)
  })

  it('keeps the rules but drops Add a rule when read-only', () => {
    const w = mount(PynOrgRepoPolicy, {
      props: { policy: repoPolicy, teams: [], members: [], readonly: true },
    })
    expect(w.findAll('h3').map((h) => h.text())).toEqual(['Repository creation', 'Rules'])
    expect(w.findAll('li')).toHaveLength(3)
  })

  it('shows the policy error even when read-only', () => {
    const w = mount(PynOrgRepoPolicy, {
      props: { policy: repoPolicy, teams: [], members: [], readonly: true, error: 'no' },
    })
    expect(w.find('[role=alert]').text()).toBe('no')
  })

  it('renders Edit team as a settings section and Create a team without one', () => {
    const edit = mount(PynTeamForm, { props: { team: teams[0] } })
    expect(edit.find('section h3').text()).toBe('Edit team')
    const create = mount(PynTeamForm, { props: { adding: true } })
    expect(create.find('section').exists()).toBe(false)
    expect(create.find('h3').text()).toBe('Create a team')
  })

  it('shows an avatar on every access row, people and teams', () => {
    const w = mount(PynAccessPage, {
      props: {
        rows: [
          ...directRows,
          {
            kind: 'person',
            name: 'erin',
            role: 'reader',
            identity: { user: 'erin', display_name: 'Erin E', avatar_url: '/a.png' },
          },
        ],
        count: 5,
        roles: accessRoles,
        canManage: true,
      },
    })
    expect(w.findAll('[data-avatar]')).toHaveLength(5)
    expect(
      w
        .findAll('li')
        .find((r) => r.text().includes('artists'))!
        .find('[data-avatar]')
        .exists(),
    ).toBe(true)
    expect(w.find('[data-avatar] img').attributes('src')).toBe('/a.png')
    expect(w.findAll('li')[0]!.findAll('[role=img]')).toHaveLength(1)
  })

  it('shows an empty invitations card and the new-invitation form', () => {
    const w = mount(PynInvites, {
      props: { invites: [], roles: ['reader', 'writer'], adding: true },
    })
    expect(w.find('[data-empty]').text()).toBe('No invitations.')
    expect(w.find('form h3').text()).toBe('New invitation')
  })
})
