import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { PynCommentForm, PynTextArea, PynTextField } from '../src'

const mounted: ReturnType<typeof mount>[] = []
const make = ((c: object, o: object) => {
  const w = mount(c as never, { attachTo: document.body, ...o })
  mounted.push(w)
  return w
}) as typeof mount
afterEach(() => mounted.splice(0).forEach((w) => w.unmount()))

describe('PynTextField', () => {
  it('labels the input and binds the value', async () => {
    const w = make(PynTextField, { props: { label: 'Title', modelValue: 'a' } })
    const input = w.find('input')
    expect(w.find(`label[for="${input.attributes('id')}"]`).text()).toBe('Title')
    await input.setValue('abc')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['abc'])
  })

  it('describes the input with help, error and a counter', () => {
    const w = make(PynTextField, {
      props: { label: 'Name', modelValue: 'abc', help: 'Short.', error: 'Taken.', maxlength: 10 },
    })
    const input = w.find('input')
    const id = input.attributes('id')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(`${id}-error ${id}-help ${id}-count`)
    expect(w.find('[role=alert]').text()).toBe('Taken.')
    expect(w.find('[data-counter]').text()).toBe('3 / 10')
    expect(
      make(PynTextField, { props: { label: 'N', maxlength: 5, counter: false } })
        .find('[data-counter]')
        .exists(),
    ).toBe(false)
  })

  it('marks optional and disabled fields', () => {
    const w = make(PynTextField, { props: { label: 'Site', optional: true, disabled: true } })
    expect(w.find('label').text()).toBe('Site (optional)')
    expect(w.find('input').attributes('disabled')).toBeDefined()
  })
})

describe('PynTextArea', () => {
  it('counts over the limit and submits on Ctrl+Enter', async () => {
    const w = make(PynTextArea, {
      props: { label: 'Body', modelValue: 'too long here', maxlength: 4, hideLabel: true },
    })
    expect(w.find('[data-counter]').attributes('data-over')).toBeDefined()
    expect(w.find('textarea').attributes('aria-invalid')).toBe('true')
    await w.find('textarea').trigger('keydown', { key: 'Enter', ctrlKey: true })
    expect(w.emitted('submit')).toHaveLength(1)
  })
})

describe('PynCommentForm', () => {
  it('submits a typed comment, not an empty one', async () => {
    const w = make(PynCommentForm, { props: { modelValue: '  ' } })
    expect(w.find('[data-submit]').attributes('disabled')).toBeDefined()
    await w.setProps({ modelValue: 'Nice.' })
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')![0]).toEqual(['Nice.'])
  })

  it('closes with or without a comment and cancels', async () => {
    const w = make(PynCommentForm, { props: { modelValue: '', canClose: true, cancelable: true } })
    expect(w.find('[data-close]').text()).toBe('Close pull request')
    await w.setProps({ modelValue: 'Superseded.' })
    expect(w.find('[data-close]').text()).toBe('Close with comment')
    await w.find('[data-close]').trigger('click')
    await w.find('[data-cancel]').trigger('click')
    expect(w.emitted('close')![0]).toEqual(['Superseded.'])
    expect(w.emitted('cancel')).toHaveLength(1)
  })

  it('shows the error and disables while busy', () => {
    const w = make(PynCommentForm, { props: { modelValue: 'x', busy: true, error: 'Failed.' } })
    expect(w.find('[role=alert]').text()).toBe('Failed.')
    expect(w.find('[data-submit]').attributes('disabled')).toBeDefined()
    expect(w.find('textarea').attributes('disabled')).toBeDefined()
  })

  it('titles the form with a heading and frames the text area in a card', () => {
    const w = make(PynCommentForm, { props: { heading: 'Add a comment', card: true } })
    const h = w.find('h2')
    expect(h.text()).toBe('Add a comment')
    expect(w.find('form').attributes('aria-labelledby')).toBe(h.attributes('id'))
    expect(w.find('[data-card] textarea').exists()).toBe(true)
    const plain = make(PynCommentForm, {})
    expect(plain.find('h2').exists()).toBe(false)
    expect(plain.find('[data-card]').exists()).toBe(false)
  })
})
