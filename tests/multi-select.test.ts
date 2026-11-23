import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PynMultiSelect } from '../src'

const options = [
  { value: 'read', label: 'Read', description: 'See files' },
  { value: 'write', label: 'Write', description: 'Push commits' },
  { value: 'lock', label: 'Lock' },
]

function mountIt(props = {}) {
  return mount(PynMultiSelect, {
    props: { options, modelValue: [], label: 'Roles', ...props },
    attachTo: document.body,
  })
}

const trigger = (w: ReturnType<typeof mountIt>) => w.find('button[role="combobox"]')

describe('PynMultiSelect', () => {
  it('shows chips and the empty label, with a label tied to the control', async () => {
    const empty = mountIt({ emptyLabel: 'None yet' })
    expect(empty.text()).toContain('None yet')
    expect(empty.find('label').attributes('for')).toBe(trigger(empty).attributes('id'))
    empty.unmount()
    const w = mountIt({ modelValue: ['read', 'lock'], id: 'roles' })
    expect(w.findAll('[data-test="chip"]').map((c) => c.text().replace('×', '').trim())).toEqual([
      'Read',
      'Lock',
    ])
    expect(w.text()).not.toContain('None yet')
    expect(trigger(w).attributes('id')).toBe('roles')
    w.unmount()
  })

  it('opens, focuses the filter and exposes combobox and listbox attributes', async () => {
    const w = mountIt({ modelValue: ['read'] })
    expect(trigger(w).attributes('aria-expanded')).toBe('false')
    await trigger(w).trigger('click')
    expect(trigger(w).attributes('aria-expanded')).toBe('true')
    const filter = w.find('input')
    expect(document.activeElement).toBe(filter.element)
    const list = w.find('[role="listbox"]')
    expect(list.attributes('aria-multiselectable')).toBe('true')
    expect(trigger(w).attributes('aria-controls')).toBe(list.attributes('id'))
    expect(filter.attributes('aria-controls')).toBe(list.attributes('id'))
    expect(filter.attributes('aria-activedescendant')).toBe(
      w.findAll('[role="option"]')[0]!.attributes('id'),
    )
    const selected = w.findAll('[role="option"]').map((o) => o.attributes('aria-selected'))
    expect(selected).toEqual(['true', 'false', 'false'])
    expect(w.text()).toContain('See files')
    w.unmount()
  })

  it('filters by label and description and reports no results', async () => {
    const w = mountIt({ noResultsLabel: 'Nothing here' })
    await trigger(w).trigger('click')
    await w.find('input').setValue('push')
    expect(w.findAll('[role="option"]')).toHaveLength(1)
    await w.find('input').setValue('zzz')
    expect(w.findAll('[role="option"]')).toHaveLength(0)
    expect(w.text()).toContain('Nothing here')
    w.unmount()
  })

  it('chooses with the mouse and toggles a chosen option off, keeping the list open', async () => {
    const w = mountIt()
    await trigger(w).trigger('click')
    await w.findAll('[role="option"]')[1]!.trigger('click')
    expect(w.emitted('update:modelValue')![0]).toEqual([['write']])
    await w.setProps({ modelValue: ['write'] })
    expect(w.find('[role="listbox"]').exists()).toBe(true)
    await w.findAll('[role="option"]')[1]!.trigger('click')
    expect(w.emitted('update:modelValue')![1]).toEqual([[]])
    expect(w.find('[role="status"]').text()).toBe('Removed Write')
    w.unmount()
  })

  it('removes a chip with its labelled button', async () => {
    const w = mountIt({ modelValue: ['read', 'write'] })
    await w.find('button[aria-label="Remove Read"]').trigger('click')
    expect(w.emitted('update:modelValue')![0]).toEqual([['write']])
    expect(w.find('[role="status"]').text()).toBe('Removed Read')
    w.unmount()
  })

  it('opens with Enter or ArrowDown and chooses with the keyboard', async () => {
    const w = mountIt()
    await trigger(w).trigger('keydown', { key: 'Enter' })
    expect(w.find('[role="listbox"]').exists()).toBe(true)
    const filter = w.find('input')
    await filter.trigger('keydown', { key: 'ArrowDown' })
    await filter.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')![0]).toEqual([['write']])
    expect(w.find('[role="status"]').text()).toBe('Added Write')
    await filter.trigger('keydown', { key: 'ArrowUp' })
    await filter.trigger('keydown', { key: 'ArrowUp' })
    expect(filter.attributes('aria-activedescendant')).toBe(
      w.findAll('[role="option"]')[2]!.attributes('id'),
    )
    await filter.trigger('keydown', { key: 'Escape' })
    expect(w.find('[role="listbox"]').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger(w).element)
    await trigger(w).trigger('keydown', { key: 'ArrowDown' })
    expect(w.find('[role="listbox"]').exists()).toBe(true)
    w.unmount()
  })

  it('removes the last chip with Backspace only when the filter is empty', async () => {
    const w = mountIt({ modelValue: ['read', 'write'] })
    await trigger(w).trigger('click')
    await w.find('input').setValue('w')
    await w.find('input').trigger('keydown', { key: 'Backspace' })
    expect(w.emitted('update:modelValue')).toBeUndefined()
    await w.find('input').setValue('')
    await w.find('input').trigger('keydown', { key: 'Backspace' })
    expect(w.emitted('update:modelValue')![0]).toEqual([['read']])
    w.unmount()
  })

  it('closes on an outside mousedown but not on one inside', async () => {
    const w = mountIt()
    await trigger(w).trigger('click')
    await w.find('input').trigger('mousedown')
    expect(w.find('[role="listbox"]').exists()).toBe(true)
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await w.vm.$nextTick()
    expect(w.find('[role="listbox"]').exists()).toBe(false)
    w.unmount()
  })

  it('does nothing when disabled', async () => {
    const w = mountIt({ disabled: true, modelValue: ['read'] })
    expect(trigger(w).attributes('disabled')).toBeDefined()
    expect(w.find('button[aria-label="Remove Read"]').attributes('disabled')).toBeDefined()
    await trigger(w).trigger('keydown', { key: 'Enter' })
    expect(w.find('[role="listbox"]').exists()).toBe(false)
    w.unmount()
  })
})
