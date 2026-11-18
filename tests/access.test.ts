import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PynAccessMode from '../src/components/PynAccessMode.vue'
import type { AccessCheckItem } from '../src/types/access.types'

const checklist: AccessCheckItem[] = [
  { id: 'url', label: 'Public address and HTTPS', status: 'ok' },
  { id: 'reg', label: 'Sign-up protections', status: 'todo', href: '/_/admin/accounts' },
]

describe('PynAccessMode', () => {
  it('shows the mode and what public changes, with the checklist', () => {
    const w = mount(PynAccessMode, { props: { mode: 'private', checklist } })
    expect(w.find('h2').text()).toContain('Private')
    expect(w.text()).toContain('people directory')
    expect(w.text()).toContain('rate limited')
    expect(w.findAll('li').length).toBeGreaterThanOrEqual(2)
    expect(w.find('a').attributes('href')).toBe('/_/admin/accounts')
  })

  it('says nothing is visible signed out when going private, without the checklist', () => {
    const w = mount(PynAccessMode, { props: { mode: 'public', checklist } })
    expect(w.text()).toContain('Nothing is visible')
    expect(w.text()).not.toContain('Before going public')
  })

  it('emits change only after the target mode is typed', async () => {
    const w = mount(PynAccessMode, { props: { mode: 'private' } })
    await w.find('form').trigger('submit')
    expect(w.emitted('change')).toBeUndefined()
    const confirm = w.find('button[type="submit"]')
    expect(confirm.attributes('disabled')).toBeDefined()
    await w.find('input').setValue('privat')
    await w.find('form').trigger('submit')
    expect(w.emitted('change')).toBeUndefined()
    await w.find('input').setValue('public')
    await w.find('form').trigger('submit')
    expect(w.emitted('change')).toEqual([['public']])
    expect(w.find('input').exists()).toBe(false)
  })

  it('cancels the confirmation and disables controls while busy', async () => {
    const w = mount(PynAccessMode, { props: { mode: 'public' } })
    await w.find('form').trigger('submit')
    await w.find('input').setValue('private')
    await w.find('button[type="button"]').trigger('click')
    expect(w.find('input').exists()).toBe(false)
    await w.find('form').trigger('submit')
    await w.find('input').setValue('private')
    await w.setProps({ busy: true })
    await w.find('form').trigger('submit')
    expect(w.emitted('change')).toBeUndefined()
  })

  it('shows an error', () => {
    const w = mount(PynAccessMode, { props: { mode: 'private', error: 'nope' } })
    expect(w.find('[role="alert"]').text()).toBe('nope')
  })
})
