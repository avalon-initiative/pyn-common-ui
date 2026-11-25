import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  PynRepoAbout,
  PynRepoForm,
  PynSettingsSection,
  PynTopicsInput,
  addTopics,
  languageShares,
  splitTopics,
} from '../src'

describe('languages in About', () => {
  it('computes shares largest first and folds the tail into Other', () => {
    const shares = languageShares(
      [
        { name: 'Shell', bytes: 19 },
        { name: 'Rust', bytes: 978 },
        { name: 'Zig', bytes: 0 },
        { name: 'Vue', bytes: 3 },
      ],
      2,
    )
    expect(shares.map((s) => [s.name, s.percent])).toEqual([
      ['Rust', 97.8],
      ['Other', 2.2],
    ])
    expect(languageShares([])).toEqual([])
  })

  it('draws the bar and list only when languages are given', () => {
    expect(mount(PynRepoAbout, { props: {} }).find('[data-languages]').exists()).toBe(false)
    expect(
      mount(PynRepoAbout, { props: { languages: [] } })
        .find('[data-languages]')
        .exists(),
    ).toBe(false)
    const w = mount(PynRepoAbout, {
      props: {
        languages: [
          { name: 'Rust', bytes: 3 },
          { name: 'Shell', bytes: 1 },
        ],
      },
    })
    expect(w.find('[data-languages] h3').text()).toBe('Languages')
    expect(w.findAll('[data-language]').map((l) => l.text())).toEqual(['Rust75%', 'Shell25%'])
    const tiny = mount(PynRepoAbout, {
      props: {
        languages: [
          { name: 'Rust', bytes: 10000 },
          { name: 'Vue', bytes: 1 },
        ],
      },
    })
    expect(tiny.findAll('[data-language]')[1].text()).toBe('Vue<0.1%')
  })
})

describe('topics input', () => {
  it('splits, validates, de-duplicates and caps topics', () => {
    expect(splitTopics(' Game-Dev, rust  vue,')).toEqual(['game-dev', 'rust', 'vue'])
    expect(addTopics(['rust'], ['rust', 'vue'])).toEqual({ topics: ['rust', 'vue'], rest: [] })
    const bad = addTopics([], ['ok', '-no', 'later'])
    expect(bad.topics).toEqual(['ok'])
    expect(bad.rest).toEqual(['-no', 'later'])
    expect(bad.error).toMatch(/lowercase letters/)
    expect(addTopics(['a'], ['b'], 1).error).toBe('At most 1 topics.')
    expect(addTopics([], ['x'.repeat(51)]).error).toBeDefined()
  })

  it('adds on Enter and comma, removes on Backspace and the chip button', async () => {
    const w = mount(PynTopicsInput, { props: { modelValue: ['rust'] } })
    const input = w.find('input')
    await input.setValue('game')
    await input.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([['rust', 'game']])
    await w.setProps({ modelValue: ['rust', 'game'] })
    await input.setValue('vue,')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([['rust', 'game', 'vue']])
    await w.setProps({ modelValue: ['rust', 'game', 'vue'] })
    await input.trigger('keydown', { key: 'Backspace' })
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([['rust', 'game']])
    await w.setProps({ modelValue: ['rust', 'game'] })
    await w.find('button[aria-label="Remove rust"]').trigger('click')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([['game']])
  })

  it('keeps invalid text with an error and shows the count', async () => {
    const w = mount(PynTopicsInput, { props: { modelValue: [] } })
    await w.find('input').setValue('C++')
    await w.find('input').trigger('keydown', { key: 'Enter' })
    expect(w.find('[role=alert]').text()).toMatch(/lowercase letters/)
    expect(w.find('input').attributes('aria-invalid')).toBe('true')
    expect((w.find('input').element as HTMLInputElement).value).toBe('c++')
    expect(w.find('[data-counter]').text()).toBe('0 / 20')
  })
})

describe('PynRepoForm website and topics', () => {
  const make = (props: Record<string, unknown> = {}) =>
    mount(PynRepoForm, { props: { owner: 'alice', steps: true, ...props } })

  it('sends neither without the fields', async () => {
    const w = make()
    expect(w.find('[data-website]').exists()).toBe(false)
    await w.find('input:not([readonly])').setValue('game')
    await w.find('form').trigger('submit')
    const sent = w.emitted('submit')![0][0] as object
    expect('website' in sent || 'topics' in sent).toBe(false)
  })

  it('sends the website and topics, including a topic still being typed', async () => {
    const w = make({ websiteField: true, topicsField: true })
    await w.find('input:not([readonly])').setValue('game')
    await w.find('[data-website]').setValue(' https://game.example ')
    const topic = w.findComponent(PynTopicsInput).find('input')
    await topic.setValue('rust')
    await topic.trigger('keydown', { key: 'Enter' })
    await topic.setValue('gamedev')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')![0][0]).toMatchObject({
      website: 'https://game.example',
      topics: ['rust', 'gamedev'],
    })
  })

  it('does not submit while a typed topic is invalid', async () => {
    const w = make({ topicsField: true })
    await w.find('input:not([readonly])').setValue('game')
    await w.findComponent(PynTopicsInput).find('input').setValue('-bad')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')).toBeUndefined()
  })
})

describe('PynSettingsSection width and actions row', () => {
  it('adds the form width and a footer row only on request', () => {
    const bare = mount(PynSettingsSection, { props: { title: 'T', plain: true } })
    expect(bare.find('[data-footer]').exists()).toBe(false)
    const w = mount(PynSettingsSection, {
      props: { title: 'T', plain: true, formWidth: true },
      slots: { default: '<p>x</p>', footer: '<button>Save</button>' },
    })
    expect(w.find('[data-footer] button').text()).toBe('Save')
    expect(w.find('[data-footer]').element.parentElement!.className).toMatch(/formWidth/)
  })
})
