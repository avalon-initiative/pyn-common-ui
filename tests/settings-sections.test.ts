import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
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
