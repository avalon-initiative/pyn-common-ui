// Auto-dismiss of transient messages, branch picker footprint and the sign-in remember options.
import { readFileSync } from 'node:fs'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  FADE_MS,
  PynBranchPicker,
  PynOrgForm,
  PynSignIn,
  PynUsernameChange,
  PynViewError,
  PynViewNotice,
} from '../src'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const elapse = async (ms: number) => {
  await vi.advanceTimersByTimeAsync(ms)
  await flushPromises()
}

describe('PynViewError auto-dismiss', () => {
  const props = { dismissible: true }

  it('does nothing unless dismissible', async () => {
    const w = mount(PynViewError, { slots: { default: 'Boom' } })
    await elapse(60_000)
    expect(w.text()).toBe('Boom')
    expect(w.find('button').exists()).toBe(false)
    expect(w.attributes('role')).toBe('alert')
  })

  it('fades after ten seconds, then removes itself and emits dismiss', async () => {
    const w = mount(PynViewError, { props, slots: { default: 'Boom' } })
    expect(w.find('button').attributes('aria-label')).toBe('Dismiss message')
    await elapse(9_999)
    expect(w.attributes('class')).not.toMatch(/fading/)
    await elapse(1)
    expect(w.attributes('class')).toMatch(/fading/)
    expect(w.attributes('role')).toBe('alert')
    await elapse(FADE_MS)
    expect(w.find('[role=alert]').exists()).toBe(false)
    expect(w.emitted('dismiss')).toHaveLength(1)
  })

  it('honours a custom delay, 0 to disable and persistent', async () => {
    const quick = mount(PynViewError, { props: { ...props, autoDismissMs: 1000 } })
    await elapse(1000 + FADE_MS)
    expect(quick.emitted('dismiss')).toHaveLength(1)
    for (const extra of [{ autoDismissMs: 0 }, { persistent: true }]) {
      const w = mount(PynViewError, { props: { ...props, ...extra } })
      await elapse(60_000)
      expect(w.find('[role=alert]').exists()).toBe(true)
      expect(w.find('button').exists()).toBe(true)
    }
  })

  it('closes at once with the button', async () => {
    const w = mount(PynViewError, { props })
    await w.find('button').trigger('click')
    expect(w.find('[role=alert]').exists()).toBe(false)
    expect(w.emitted('dismiss')).toHaveLength(1)
  })

  it('waits while hovered or focused and restarts the full delay after', async () => {
    const w = mount(PynViewError, { props, attachTo: document.body })
    await elapse(9_000)
    await w.trigger('pointerenter')
    await elapse(30_000)
    expect(w.find('[role=alert]').exists()).toBe(true)
    await w.trigger('pointerleave')
    await elapse(9_999)
    expect(w.attributes('class')).not.toMatch(/fading/)
    await w.find('button').trigger('focusin')
    await elapse(30_000)
    expect(w.attributes('class')).not.toMatch(/fading/)
    await w.trigger('focusout')
    await elapse(10_000)
    expect(w.attributes('class')).toMatch(/fading/)
    await w.trigger('pointerenter')
    expect(w.attributes('class')).not.toMatch(/fading/)
    w.unmount()
  })

  it('clears its timers on unmount', async () => {
    const w = mount(PynViewError, { props })
    expect(vi.getTimerCount()).toBe(1)
    w.unmount()
    expect(vi.getTimerCount()).toBe(0)
    await elapse(60_000)
    expect(w.emitted('dismiss')).toBeUndefined()
  })
})

describe('PynViewNotice auto-dismiss', () => {
  it('keeps its live region and fades only when dismissible', async () => {
    const plain = mount(PynViewNotice, { slots: { default: 'Hi' } })
    await elapse(60_000)
    expect(plain.attributes('role')).toBe('status')
    expect(plain.find('button').exists()).toBe(false)

    const w = mount(PynViewNotice, { props: { dismissible: true }, slots: { default: 'Hi' } })
    expect(w.attributes('role')).toBe('status')
    await elapse(10_000 + FADE_MS)
    expect(w.find('[role=status]').exists()).toBe(false)
    expect(w.emitted('dismiss')).toHaveLength(1)
  })

  it('stays when persistent and closes with the button', async () => {
    const w = mount(PynViewNotice, {
      props: { dismissible: true, persistent: true },
      slots: { default: 'Hi' },
    })
    await elapse(60_000)
    expect(w.text()).toBe('Hi')
    await w.find('button').trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
    w.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})

describe('PynSignIn error and options', () => {
  const props = { registration: 'open' as const, error: 'Nope.' }

  it('fades the error, restarts on a new attempt and can be made persistent', async () => {
    const w = mount(PynSignIn, { props })
    expect(w.find('[role=alert]').text()).toBe('Nope.')
    await elapse(10_000 + FADE_MS)
    expect(w.find('[role=alert]').exists()).toBe(false)
    expect(w.emitted('dismissError')).toHaveLength(1)
    await w.setProps({ busy: true })
    await w.setProps({ busy: false })
    expect(w.find('[role=alert]').text()).toBe('Nope.')

    const sticky = mount(PynSignIn, { props: { ...props, errorPersistent: true } })
    await elapse(60_000)
    expect(sticky.find('[role=alert]').exists()).toBe(true)
    sticky.unmount()
    w.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('hides the checkboxes and keeps the payload unless the options are on', async () => {
    const w = mount(PynSignIn, { props: { registration: 'open' } })
    expect(w.find('input[type=checkbox]').exists()).toBe(false)
    await w.find('input').setValue('lv')
    await w.find('input[type=password]').setValue('pw')
    await w.find('form').trigger('submit')
    expect(w.emitted('signIn')?.[0]).toEqual([{ username: 'lv', password: 'pw' }])
  })

  it('offers remember me and stay signed in, as v-models and in the sign-in payload', async () => {
    const w = mount(PynSignIn, {
      props: { registration: 'open', rememberOption: true, staySignedInOption: true },
    })
    const boxes = w.findAll('input[type=checkbox]')
    expect(boxes).toHaveLength(2)
    expect(w.text()).toContain('Remember me')
    expect(w.text()).toContain('Stay signed in')
    await w.find('[data-remember]').setValue(true)
    await w.find('[data-stay-signed-in]').setValue(true)
    expect(w.emitted('update:remember')?.[0]).toEqual([true])
    expect(w.emitted('update:staySignedIn')?.[0]).toEqual([true])
    await w.find('input').setValue('lv')
    await w.find('input[type=password]').setValue('pw')
    await w.find('form').trigger('submit')
    expect(w.emitted('signIn')?.[0]).toEqual([
      { username: 'lv', password: 'pw', remember: true, staySignedIn: true },
    ])
  })

  it('follows the bound values and stays out of registration', async () => {
    const w = mount(PynSignIn, {
      props: {
        registration: 'open',
        rememberOption: true,
        staySignedInOption: true,
        remember: true,
      },
    })
    expect((w.find('[data-remember]').element as HTMLInputElement).checked).toBe(true)
    expect((w.find('[data-stay-signed-in]').element as HTMLInputElement).checked).toBe(false)
    await w
      .findAll('button')
      .find((b) => b.text() === 'Create an account')!
      .trigger('click')
    expect(w.find('input[type=checkbox]').exists()).toBe(false)
  })
})

describe('PynBranchPicker footprint', () => {
  const branches = [{ name: 'main', isDefault: true }, { name: 'x' }]

  it('truncates a long name with a title and keeps the menu inside the picker', async () => {
    const long = 'feature/a-very-long-branch-name-that-keeps-going-and-going'
    const w = mount(PynBranchPicker, { props: { branches, current: long } })
    const name = w.find(`[title="${long}"]`)
    expect(name.text()).toBe(long)
    await w.find('button').trigger('click')
    expect(w.find('[role=listbox]').exists()).toBe(true)
    expect(w.element.contains(w.find('[role=listbox]').element)).toBe(true)
    w.unmount()
  })

  it('has a set width, and the page reserves its scrollbar track', () => {
    const scss = readFileSync('src/styles/PynBranchPicker.module.scss', 'utf8')
    expect(scss).toMatch(/\.picker \{[^}]*\n {2}width: /)
    expect(scss).toMatch(/\.panel \{[^}]*position: absolute/)
    expect(readFileSync('src/styles/global.css', 'utf8')).toMatch(/scrollbar-gutter: stable/)
  })
})

describe('name preview hint', () => {
  it('PynSignIn shows it in register mode only, apart from the validation message', async () => {
    const w = mount(PynSignIn, { props: { registration: 'open', nameCanonical: 'new-user' } })
    expect(w.find('[data-canonical]').exists()).toBe(false)
    await w
      .findAll('button')
      .find((b) => b.text() === 'Create an account')!
      .trigger('click')
    const hint = w.find('[data-canonical]')
    expect(hint.text()).toBe('Will be created as: new-user')
    const input = w.find('input')
    expect(input.attributes('aria-describedby')).toBe(hint.attributes('id'))
    expect(input.attributes('aria-invalid')).toBeUndefined()
    await w.setProps({ nameMessage: 'taken' })
    expect(input.attributes('aria-describedby')!.split(' ')).toHaveLength(2)
    expect(input.attributes('aria-invalid')).toBe('true')
  })

  it('PynOrgForm shows it, and describes the allowed characters', async () => {
    const w = mount(PynOrgForm, { props: { nameCanonical: 'my-studio' } })
    expect(w.find('[data-canonical]').text()).toBe('Will be created as: my-studio')
    expect(w.text()).toContain('Spaces become "-" and case is ignored')
    expect(w.text()).not.toContain('lowercase')
    expect(w.find('input').attributes('aria-describedby')!.split(' ')).toHaveLength(2)
    expect(mount(PynOrgForm).find('[data-canonical]').exists()).toBe(false)
  })

  it('PynUsernameChange emits nameInput and shows the rename preview', async () => {
    const w = mount(PynUsernameChange, { props: { current: 'alice', nameCanonical: 'alice-b' } })
    await w.find('input').setValue(' Alice B ')
    expect(w.emitted('nameInput')?.[0]).toEqual(['Alice B'])
    const hint = w.find('[data-canonical]')
    expect(hint.text()).toBe('Will be renamed to: alice-b')
    expect(w.find('input').attributes('aria-describedby')).toBe(hint.attributes('id'))
    await w.setProps({ nameCanonical: undefined })
    expect(w.find('[data-canonical]').exists()).toBe(false)
  })
})
