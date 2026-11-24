import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { PynRepoForm } from '../src'

const make = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(PynRepoForm, { props: { owner: 'alice', steps: true, ...props }, slots: slots as never })

describe('PynRepoForm steps layout', () => {
  it('shows the title, intro and two numbered steps', () => {
    const w = make({ intro: 'About repositories.' })
    expect(w.find('h1').text()).toBe('Create a new repository')
    expect(w.text()).toContain('About repositories.')
    const items = w.findAll('ol > li')
    expect(items.map((i) => i.find('h2').text())).toEqual(['General', 'Configuration'])
    expect(items.map((i) => i.find('span[aria-hidden]').text())).toEqual(['1', '2'])
  })

  it('puts the owner select beside the name with a slash', async () => {
    const w = make({ owners: ['alice', 'studio'] })
    expect(w.text()).toContain('/')
    await w.find('select').setValue('studio')
    expect(w.emitted('update:owner')?.[0]).toEqual(['studio'])
    expect(w.find('label[for]').text()).toBe('Owner *')
  })

  it('shows a fixed owner without a choice', () => {
    const w = make({ owners: ['alice'] })
    const owner = w.find('input[readonly]')
    expect((owner.element as HTMLInputElement).value).toBe('alice')
    expect(w.findAll('select')).toHaveLength(1)
  })

  it('fills the name from the suggestion', async () => {
    const w = make({ suggestion: 'bookish-octo-winner' })
    await w.find('button[type=button]').trigger('click')
    expect((w.find('input[maxlength="100"]').element as HTMLInputElement).value).toBe(
      'bookish-octo-winner',
    )
  })

  it('counts the description and sends it with the settings', async () => {
    const w = make({ describable: true, descriptionMax: 20 })
    expect(w.text()).toContain('0 / 20 characters')
    await w.find('input[maxlength="20"]').setValue(' A fine game ')
    expect(w.text()).toContain('13 / 20 characters')
    await w.find('input[maxlength="100"]').setValue('game')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0]).toEqual([
      { name: 'game', visibility: 'private', lease_hours: 8, description: 'A fine game' },
    ])
  })

  it('has no description field unless asked', async () => {
    const w = make()
    await w.find('input[maxlength="100"]').setValue('game')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0]).toEqual([
      { name: 'game', visibility: 'private', lease_hours: 8 },
    ])
  })

  it('renders option rows from the options slot after the built-in ones', () => {
    const w = make({}, { options: '<div data-extra>Extra option</div>' })
    const opts = w.find('[class*=options]')
    expect(opts.findAll(':scope > *').length).toBe(4)
    expect(opts.text()).toContain('Choose visibility')
    expect(opts.find('[data-extra]').exists()).toBe(true)
  })

  it('keeps the plain layout without steps', () => {
    const w = mount(PynRepoForm, { props: { owner: 'alice' } })
    expect(w.find('h1').exists()).toBe(false)
    expect(w.find('ol').exists()).toBe(false)
  })

  it('refuses to submit when read-only and shows the error', async () => {
    const w = make({ readonly: true, error: 'No.' })
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')).toBeUndefined()
    expect(w.find('[role=alert]').text()).toBe('No.')
  })
})
