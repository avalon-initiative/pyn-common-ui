// Sign-in page structure, setup and second-factor pages, and the field and banner styles.
import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { compileString } from 'sass'
import { describe, expect, it } from 'vitest'
import { PynSecondFactor, PynSetup, PynSettingsLayout, PynSignIn } from '../src'

describe('PynSignIn page', () => {
  it('shows the mark, title, form box and the secondary create-account box', async () => {
    const w = mount(PynSignIn, { props: { registration: 'open' } })
    expect(w.find('h2').text()).toBe('Sign in')
    expect(w.find('form').exists()).toBe(true)
    const aside = w.find('p')
    expect(aside.text()).toContain('Create an account')
    await aside.find('button').trigger('click')
    expect(w.find('h2').text()).toBe('Create an account')
    expect(w.findAll('p').at(-1)!.text()).toContain('Sign in')
  })

  it('shows the error above the form and has no secondary box when registration is closed', () => {
    const w = mount(PynSignIn, { props: { registration: 'closed', error: 'Nope.' } })
    const html = w.html()
    expect(html.indexOf('role="alert"')).toBeLessThan(html.indexOf('<form'))
    expect(w.findAll('p')).toHaveLength(0)
  })

  it('keeps the register name hint and the remember option inside the form box', async () => {
    const w = mount(PynSignIn, {
      props: { registration: 'open', rememberOption: true, nameCanonical: 'new-user' },
    })
    expect(w.find('form [data-remember]').exists()).toBe(true)
    await w
      .findAll('button')
      .find((b) => b.text() === 'Create an account')!
      .trigger('click')
    expect(w.find('form [data-canonical]').text()).toContain('new-user')
  })
})

describe('PynSetup and PynSecondFactor pages', () => {
  it('puts the error above the setup form and keeps the step title outside it', () => {
    const w = mount(PynSetup, { props: { registration: 'open', error: 'Bad token.' } })
    const html = w.html()
    expect(html.indexOf('role="alert"')).toBeLessThan(html.indexOf('<form'))
    expect(w.find('form h2').exists()).toBe(false)
  })

  it('keeps the back link outside the second-factor form and emits cancel', async () => {
    const w = mount(PynSecondFactor, { props: {} })
    expect(w.find('form').text()).not.toContain('Back to sign in')
    await w
      .findAll('button')
      .find((b) => b.text() === 'Back to sign in')!
      .trigger('click')
    expect(w.emitted('cancel')).toHaveLength(1)
  })
})

describe('PynSettingsLayout nav', () => {
  it('marks only the open section as current', () => {
    const w = mount(PynSettingsLayout, {
      props: {
        label: 'Settings',
        current: 'b',
        sections: [
          { id: 'a', label: 'A', href: '/a' },
          { id: 'b', label: 'B', href: '/b' },
        ],
      },
    })
    expect(w.findAll('a[aria-current=page]').map((a) => a.text())).toEqual(['B'])
  })
})

describe('form styles', () => {
  const css = compileString(
    `@use 'mixins' as m;
     .msg { @include m.field-message; }
     .err { @include m.error; }
     .ok { @include m.success; }
     .primary { @include m.button-primary; }
     .danger { @include m.button-danger; }`,
    { loadPaths: ['src/styles'] },
  ).css

  it('draws an icon on validation messages and banners', () => {
    expect(css).toMatch(/\.msg::before\s*\{[^}]*mask/)
    expect(css).toMatch(/\.err::before\s*\{[^}]*mask/)
    expect(css).toMatch(/\.ok::before\s*\{[^}]*mask/)
  })

  it('fills the primary button green and outlines the danger button in red text', () => {
    expect(css).toMatch(/\.primary\s*\{[^}]*--pyn-success-fill/)
    expect(css).toMatch(/\.danger\s*\{[^}]*color:\s*var\(--pyn-danger\)/)
  })

  it('keeps the shared token for control height on inputs', () => {
    expect(readFileSync('src/styles/_mixins.scss', 'utf8')).toContain('--pyn-control-md')
  })
})
