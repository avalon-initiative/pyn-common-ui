import { mount } from '@vue/test-utils'
import type { Component } from 'vue'
import { describe, expect, it } from 'vitest'
import {
  PynEmptyState,
  PynMyLocks,
  PynOrgForm,
  PynOrgInvitations,
  PynOrgList,
  PynRepoForm,
  PynRepoList,
  PynRepoShell,
} from '../src'

describe('PynRepoShell hidePath', () => {
  const props = {
    owner: 'alice',
    name: 'game',
    visibility: 'public' as const,
    tabs: [
      { section: '', label: 'Code' },
      { section: 'locks', label: 'Locks' },
    ],
    current: '',
  }

  it('keeps the path nav and an h1 by default', () => {
    const w = mount(PynRepoShell, { props })
    expect(w.find('nav[aria-label="Repository path"]').exists()).toBe(true)
    expect(w.find('h1 nav').exists()).toBe(true)
    expect(w.findAll('h1')).toHaveLength(1)
  })

  it('drops the path and the empty heading but keeps badge, tabs and actions', () => {
    const w = mount(PynRepoShell, {
      props: { ...props, hidePath: true },
      slots: { actions: '<button>Clone</button>' },
    })
    expect(w.find('nav[aria-label="Repository path"]').exists()).toBe(false)
    expect(w.find('a[href="/alice"]').exists()).toBe(false)
    expect(w.find('h1').exists()).toBe(false)
    expect(w.find('[data-visibility]').text()).toBe('Public')
    expect(w.findAll('nav[aria-label="Repository"] a')).toHaveLength(2)
    expect(w.find('button').text()).toBe('Clone')
  })
})

describe('PynEmptyState commands', () => {
  it('renders each command as its own code element under the description', () => {
    const w = mount(PynEmptyState, {
      props: { title: 'Empty', description: 'Push first.', commands: ['pyn init', 'pyn push'] },
    })
    const codes = w.findAll('ul[aria-label="Commands"] li code')
    expect(codes.map((c) => c.text())).toEqual(['pyn init', 'pyn push'])
    const html = w.html()
    expect(html.indexOf('Push first.')).toBeLessThan(html.indexOf('pyn init'))
  })

  it('renders no list without commands', () => {
    expect(
      mount(PynEmptyState, { props: { title: 'T' } })
        .find('ul')
        .exists(),
    ).toBe(false)
    expect(
      mount(PynEmptyState, { props: { title: 'T', commands: [] } })
        .find('ul')
        .exists(),
    ).toBe(false)
  })
})

describe('empty text of the lists', () => {
  const cases = [
    ['PynRepoList', PynRepoList, { repos: [] }, 'not in any repository'],
    ['PynOrgList', PynOrgList, { orgs: [] }, 'not in any organization'],
    ['PynMyLocks', PynMyLocks, { locks: [] }, 'You hold no locks.'],
    ['PynOrgInvitations', PynOrgInvitations, { invitations: [] }, 'No pending invitations.'],
  ] as const

  for (const [name, component, props, text] of cases) {
    it(`${name}: default text, custom text, silenced, and slot`, () => {
      const c = component as Component
      const p = props as Record<string, unknown>
      expect(mount(c, { props: p }).text()).toContain(text)
      expect(mount(c, { props: { ...p, empty: 'Custom.' } }).text()).toBe('Custom.')
      expect(mount(c, { props: { ...p, empty: '' } }).text()).toBe('')
      const slotted = mount(c, { props: p, slots: { empty: '<i data-slot>Mine</i>' } })
      expect(slotted.find('[data-slot]').exists()).toBe(true)
      expect(slotted.text()).not.toContain(text)
    })
  }

  it('does not render the empty slot when there are items', () => {
    const w = mount(PynOrgInvitations, {
      props: {
        invitations: [
          {
            org: 'studio',
            user: 'dave',
            role: 'member',
            invited_by: 'alice',
            created_at: '2026-10-20T09:00:00Z',
            expires_at: '2026-11-19T09:00:00Z',
          },
        ],
      },
      slots: { empty: '<i data-slot>Mine</i>' },
    })
    expect(w.find('[data-slot]').exists()).toBe(false)
  })
})

describe('form cancel action', () => {
  const forms = [
    ['PynRepoForm', PynRepoForm, { owner: 'alice' }, 'Create repository'],
    ['PynOrgForm', PynOrgForm, {}, 'Create organization'],
  ] as const

  for (const [name, component, props, submit] of forms) {
    it(`${name}: no cancel by default`, () => {
      const w = mount(component as Component, { props })
      expect(w.findAll('button')).toHaveLength(1)
      expect(w.find('button').text()).toBe(submit)
      expect(w.find('a').exists()).toBe(false)
    })

    it(`${name}: cancelHref renders a link and emits cancel`, async () => {
      const w = mount(component as Component, { props: { ...props, cancelHref: '/back' } })
      const a = w.find('a')
      expect(a.text()).toBe('Cancel')
      expect(a.attributes('href')).toBe('/back')
      await a.trigger('click')
      expect(w.emitted('cancel')).toHaveLength(1)
      expect(w.emitted('submit')).toBeUndefined()
    })

    it(`${name}: cancelLabel alone renders a button`, async () => {
      const w = mount(component as Component, { props: { ...props, cancelLabel: 'Back' } })
      const b = w.find('button[type="button"]')
      expect(b.text()).toBe('Back')
      await b.trigger('click')
      expect(w.emitted('cancel')).toHaveLength(1)
    })
  }
})
