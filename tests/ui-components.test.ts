// Component render tests for every exported component. Run with `make test`.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PynButton } from '../src'

describe('PynButton', () => {
  it('renders its label as a button', () => {
    const wrapper = mount(PynButton, { props: { label: 'Check out' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toBe('Check out')
  })

  it('applies the variant class', () => {
    const primary = mount(PynButton, { props: { label: 'a' } })
    const danger = mount(PynButton, { props: { label: 'a', variant: 'danger' } })
    expect(primary.classes().join(' ')).toContain('primary')
    expect(danger.classes().join(' ')).toContain('danger')
  })

  it('honours disabled', () => {
    const wrapper = mount(PynButton, { props: { label: 'a', disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
