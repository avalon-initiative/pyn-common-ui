import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PynAccessSessionBanner from '../src/components/PynAccessSessionBanner.vue'
import PynAccessSessionHistory from '../src/components/PynAccessSessionHistory.vue'
import PynAccessSessionList from '../src/components/PynAccessSessionList.vue'
import PynAccessSessionStartForm from '../src/components/PynAccessSessionStartForm.vue'
import { accessSessions } from '../src/stories/access-session-data'

describe('PynAccessSessionBanner', () => {
  it('renders nothing when no session is active', () => {
    const w = mount(PynAccessSessionBanner, { props: { sessions: accessSessions.slice(1) } })
    expect(w.html()).toBe('<!--v-if-->')
  })

  it('names the administrator, the reason as text, the notes and the end, with no dismiss', () => {
    const w = mount(PynAccessSessionBanner, { props: { sessions: accessSessions } })
    expect(w.attributes('role')).toBe('status')
    expect(w.text()).toContain('root')
    expect(w.text()).toContain('Support request')
    expect(w.text()).not.toContain('support_request')
    expect(w.text()).toContain('Ticket 4412')
    expect(w.text()).toContain('Nov 20 2026')
    expect(w.find('button').exists()).toBe(false)
  })
})

describe('PynAccessSessionHistory', () => {
  it('says plainly when nobody has acted', () => {
    const w = mount(PynAccessSessionHistory, { props: { sessions: [] } })
    expect(w.text()).toContain('No administrator has acted as this account')
  })

  it('lists newest first with state, notes, routes and a refused marker', () => {
    const w = mount(PynAccessSessionHistory, {
      props: { sessions: [...accessSessions].reverse() },
    })
    const items = w.findAll('li')
    expect(items).toHaveLength(3)
    expect(items[0].text()).toContain('Active')
    expect(items[1].text()).toContain('Ended by an administrator')
    expect(items[2].text()).toContain('Expired')
    expect(items[0].text()).toContain('Ticket 4412')
    expect(items[0].text()).toContain('2 routes called')
    expect(items[0].text()).toContain('/v1/repos/{owner}/{name}/files')
    expect(items[0].text()).toContain('alice/game')
    expect(items[0].findAll('tbody tr')[1].text()).toContain('Refused')
    expect(items[0].findAll('tbody tr')[0].text()).not.toContain('Refused')
    expect(items[1].text()).toContain('No routes called')
  })
})

describe('PynAccessSessionStartForm', () => {
  it('requires notes for other and shows the problem inline', async () => {
    const w = mount(PynAccessSessionStartForm, { props: { user: 'alice' } })
    await w.find('select').setValue('other')
    await w.find('form').trigger('submit')
    expect(w.find('[role="alert"]').text()).toContain('Notes are required')
    expect(w.emitted('submit')).toBeUndefined()
  })

  it('requires a reason', async () => {
    const w = mount(PynAccessSessionStartForm, { props: { user: 'alice' } })
    await w.find('form').trigger('submit')
    expect(w.find('[role="alert"]').text()).toContain('Choose a reason')
  })

  it('emits the reason and trimmed notes, and caps notes with a counter', async () => {
    const w = mount(PynAccessSessionStartForm, { props: { user: 'alice' } })
    await w.find('select').setValue('support_request')
    await w.find('textarea').setValue('  ticket 1  ')
    expect(w.find('textarea').attributes('maxlength')).toBe('500')
    expect(w.text()).toContain('12 / 500')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')).toEqual([[{ reason: 'support_request', notes: 'ticket 1' }]])
  })

  it('omits empty notes, disables while busy and shows the error', async () => {
    const w = mount(PynAccessSessionStartForm, {
      props: { user: 'alice', busy: true, error: 'refused' },
    })
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    expect(w.text()).toContain('refused')
    await w.find('select').setValue('legal_request')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')).toEqual([[{ reason: 'legal_request' }]])
  })
})

describe('PynAccessSessionList', () => {
  it('offers End only for an active session, after a confirm step', async () => {
    const w = mount(PynAccessSessionList, { props: { sessions: accessSessions } })
    const ends = w.findAll('button').filter((b) => b.text() === 'End')
    expect(ends).toHaveLength(1)
    await ends[0].trigger('click')
    expect(w.emitted('end')).toBeUndefined()
    await w.find('form').trigger('submit')
    expect(w.emitted('end')).toEqual([['s3']])
  })

  it('cancelling the confirm emits nothing', async () => {
    const w = mount(PynAccessSessionList, { props: { sessions: accessSessions } })
    await w
      .findAll('button')
      .filter((b) => b.text() === 'End')[0]
      .trigger('click')
    await w
      .findAll('button')
      .filter((b) => b.text() === 'Cancel')[0]
      .trigger('click')
    expect(w.emitted('end')).toBeUndefined()
    expect(w.find('form').exists()).toBe(false)
  })

  it('shows the secret once, with the bearer-token note, until dismissed', async () => {
    const started = { secret: 'pyn_as_secret', info: accessSessions[0] }
    const w = mount(PynAccessSessionList, { props: { sessions: accessSessions, started } })
    expect(w.text()).toContain('pyn_as_secret')
    expect(w.text()).toContain('shown once')
    expect(w.text()).toContain('bearer token')
    await w
      .findAll('button')
      .filter((b) => b.text() === 'Done')[0]
      .trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
    await w.setProps({ started: undefined })
    expect(w.text()).not.toContain('pyn_as_secret')
  })

  it('shows an empty state and an error', () => {
    const w = mount(PynAccessSessionList, { props: { sessions: [], error: 'boom' } })
    expect(w.text()).toContain('No administrator has acted as any account')
    expect(w.find('[role="alert"]').text()).toBe('boom')
  })
})
