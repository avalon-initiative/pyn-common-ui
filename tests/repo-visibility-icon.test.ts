// Tests for the danger-zone visibility change, the repository icon and the explore row extras.
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  PynAvatarUpload,
  PynMenu,
  PynRepoForm,
  PynRepoIconUpload,
  PynRepoRow,
  PynRepoShell,
  PynRepoVisibility,
  PynSettingsSection,
  imageProblem,
} from '../src'
import { forkMenu } from '../src/state/repo-social.state'

const png = () => new File(['x'], 'a.png', { type: 'image/png' })
async function choose(input: ReturnType<ReturnType<typeof mount>['find']>, file: File) {
  Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
  await input.trigger('change')
}

describe('PynRepoVisibility', () => {
  it('shows the current state and emits the other visibility after the confirmation', async () => {
    const w = mount(PynRepoVisibility, { props: { slug: 'studio/game', visibility: 'private' } })
    expect(w.find('[data-current]').text()).toBe('private')
    await w.find('button').trigger('click')
    expect(w.emitted('change')).toBeUndefined()
    const dialog = w.find('[role=dialog]')
    expect(dialog.text()).toContain('Make studio/game public?')
    expect(dialog.find('[data-effects]').text()).toContain('stay private')
    expect(dialog.find('[data-effects]').text()).toContain('Stars and watchers are kept')
    const confirm = dialog.findAll('button').at(-1)!
    expect(confirm.text()).toBe('Make public')
    await confirm.trigger('click')
    expect(w.emitted('change')).toEqual([['public']])
    expect(w.find('[role=dialog]').exists()).toBe(false)
  })

  it('explains making a public repository private and closes on cancel', async () => {
    const w = mount(PynRepoVisibility, { props: { slug: 'studio/game', visibility: 'public' } })
    await w.find('button').trigger('click')
    const effects = w.find('[data-effects]').text()
    expect(effects).toContain('Only its members')
    expect(effects).toContain('Forks of a private repository stay private')
    await w.find('[role=dialog]').findAll('button').at(-2)!.trigger('click')
    expect(w.find('[role=dialog]').exists()).toBe(false)
    expect(w.emitted('change')).toBeUndefined()
  })

  it('disables the button when read-only or busy and shows an error', () => {
    const w = mount(PynRepoVisibility, {
      props: { slug: 'a/b', visibility: 'private', readonly: true, error: 'No.' },
    })
    expect(w.find('button').attributes('disabled')).toBeDefined()
    expect(w.find('[role=alert]').text()).toBe('No.')
  })

  it('drops its own border inside a danger section', () => {
    const inner = mount({
      components: { PynSettingsSection, PynRepoVisibility },
      template: `<PynSettingsSection title="Danger zone" danger plain><PynRepoVisibility slug="a/b" visibility="public" /></PynSettingsSection>`,
    })
    expect(inner.find('[data-visibility-change]').attributes('data-bare')).toBe('true')
  })
})

describe('PynRepoForm visibility', () => {
  const repo = { name: 'game', visibility: 'public' as const, lease_hours: 8 }

  it('has no visibility field when editing and keeps the current visibility', async () => {
    const w = mount(PynRepoForm, { props: { owner: 'alice', repo } })
    expect(w.find('select').exists()).toBe(false)
    expect(w.text()).not.toContain('Visibility')
    await w.setProps({ repo: { ...repo, visibility: 'private' } })
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')![0]![0]).toMatchObject({ name: 'game', visibility: 'private' })
  })

  it('keeps the visibility field on both create layouts', async () => {
    const compact = mount(PynRepoForm, { props: { owner: 'alice' } })
    await compact.find('input').setValue('game')
    await compact.find('select').setValue('public')
    await compact.find('form').trigger('submit')
    expect(compact.emitted('submit')![0]![0]).toMatchObject({ visibility: 'public' })
    const steps = mount(PynRepoForm, { props: { owner: 'alice', steps: true } })
    expect(steps.text()).toContain('Choose visibility')
  })
})

describe('PynAvatarUpload', () => {
  it('previews the image, falls back, and emits a valid file', async () => {
    const w = mount(PynAvatarUpload, { props: { name: 'studio', fallbackSrc: '/owner.png' } })
    expect(w.find('img').attributes('src')).toBe('/owner.png')
    expect(w.find('img').attributes('data-fallback')).toBe('true')
    expect(w.text()).not.toContain('Remove')
    const file = png()
    await choose(w.find('input[type=file]'), file)
    expect(w.emitted('upload')).toEqual([[file]])
  })

  it('names the noun in labels and refusals', async () => {
    const w = mount(PynAvatarUpload, { props: { name: 'a', src: '/i.png', noun: 'icon' } })
    expect(w.text()).toContain('Change icon')
    await choose(w.find('input[type=file]'), new File(['x'], 'a.gif', { type: 'image/gif' }))
    expect(w.emitted('upload')).toBeUndefined()
    expect(w.find('[role=alert]').text()).toBe('The icon must be a PNG, JPEG or WebP image.')
    await w.find('button').trigger('click')
    expect(w.emitted('remove')).toHaveLength(1)
    expect(imageProblem({ type: 'image/png', size: 2 * 1024 * 1024 }, 'icon')).toContain('1 MiB')
  })
})

describe('PynRepoIconUpload', () => {
  it('shows the owner avatar without an icon and emits upload and clear', async () => {
    const w = mount(PynRepoIconUpload, {
      props: { owner: 'studio', ownerAvatarUrl: '/o.png' },
    })
    expect(w.find('h3').text()).toBe('Repository icon')
    expect(w.find('img').attributes('src')).toBe('/o.png')
    expect(w.text()).toContain('200 × 200')
    const file = png()
    await choose(w.find('input[type=file]'), file)
    expect(w.emitted('upload')).toEqual([[file]])
    await w.setProps({ iconUrl: '/icon.png' })
    expect(w.find('img').attributes('src')).toBe('/icon.png')
    await w.find('button').trigger('click')
    expect(w.emitted('clear')).toHaveLength(1)
  })

  it('disables the controls when read-only', () => {
    const w = mount(PynRepoIconUpload, { props: { owner: 's', iconUrl: '/i.png', readonly: true } })
    expect(w.find('input[type=file]').attributes('disabled')).toBeDefined()
    expect(w.find('button').attributes('disabled')).toBeDefined()
  })
})

describe('repository icon in the header, rows and forks menu', () => {
  const base = {
    id: '1',
    owner_id: 'o',
    owner: 'studio',
    name: 'game',
    visibility: 'public' as const,
    lease_hours: 8,
    created_at: '2026-10-01T09:00:00Z',
  }

  it('prefers the icon over the owner avatar in the header', () => {
    const w = mount(PynRepoShell, {
      props: { owner: 'studio', name: 'game', visibility: 'public', ownerAvatarUrl: '/o.png' },
    })
    expect(w.find('img').attributes('src')).toBe('/o.png')
    const icon = mount(PynRepoShell, {
      props: {
        owner: 'studio',
        name: 'game',
        visibility: 'public',
        ownerAvatarUrl: '/o.png',
        iconUrl: '/i.png',
      },
    })
    expect(icon.find('img').attributes('src')).toBe('/i.png')
  })

  it('shows stars, forks and the icon in a row only when given', () => {
    const plain = mount(PynRepoRow, { props: { repo: base } })
    expect(plain.find('[data-repo-icon]').exists()).toBe(false)
    expect(plain.find('[data-stars]').exists()).toBe(false)
    const w = mount(PynRepoRow, {
      props: {
        repo: { ...base, star_count: 1, fork_count: 4, icon_url: null, owner_avatar_url: '/o.png' },
      },
    })
    expect(w.find('[data-repo-icon] img').attributes('src')).toBe('/o.png')
    expect(w.find('[data-stars]').text()).toContain('1')
    expect(w.find('[data-stars]').text()).toContain('star')
    expect(w.find('[data-forks]').text()).toContain('4')
    expect(w.find('[data-forks]').text()).toContain('forks')
    const own = mount(PynRepoRow, { props: { repo: { ...base, icon_url: '/i.png' } } })
    expect(own.find('[data-repo-icon] img').attributes('src')).toBe('/i.png')
  })

  it('lists forks with their icon or owner avatar when given', async () => {
    const items = forkMenu({ count: 2 }, [
      { owner: 'bob', name: 'game', iconUrl: '/b.png' },
      { owner: 'sam', name: 'game', iconUrl: null, ownerAvatarUrl: '/s.png' },
      { owner: 'lee', name: 'game' },
    ])
    expect(items[1]).toMatchObject({ avatar: { name: 'bob', src: '/b.png' } })
    expect(items[2]).toMatchObject({ avatar: { name: 'sam', src: '/s.png' } })
    expect(items[3]).toMatchObject({ icon: 'fork' })
    const w = mount(PynMenu, { props: { label: 'Fork options', items }, attachTo: document.body })
    await w.find('button').trigger('click')
    expect(w.findAll('[role=menuitem] img').map((i) => i.attributes('src'))).toEqual([
      '/b.png',
      '/s.png',
    ])
    w.unmount()
  })
})
