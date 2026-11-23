import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PynCloneMenu } from '../src'

const props = { httpsUrl: 'https://h.example/a/b.pyn', command: 'pyn clone a/b' }
const mounted: ReturnType<typeof mount>[] = []
const make = (extra: Record<string, unknown> = {}) => {
  const w = mount(PynCloneMenu, { props: { ...props, ...extra }, attachTo: document.body })
  mounted.push(w)
  return w
}
afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount())
  vi.unstubAllGlobals()
})

describe('PynCloneMenu', () => {
  it('shows the trigger closed, then the address and command read-only', async () => {
    const w = make()
    expect(w.find('button').text()).toBe('Clone')
    expect(w.find('[role=dialog]').exists()).toBe(false)
    await w.find('button').trigger('click')
    const inputs = w.findAll('input')
    expect(inputs.map((i) => (i.element as HTMLInputElement).value)).toEqual([
      props.httpsUrl,
      props.command,
    ])
    expect(inputs.every((i) => i.attributes('readonly') !== undefined)).toBe(true)
  })

  it('focuses the address without scrolling and shows its start selected', async () => {
    const focus = vi.spyOn(HTMLElement.prototype, 'focus')
    const w = make()
    await w.find('button').trigger('click')
    await flushPromises()
    const input = w.find('input').element as HTMLInputElement
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
    expect(document.activeElement).toBe(input)
    expect(input.selectionEnd! - input.selectionStart!).toBe(props.httpsUrl.length)
    expect(input.scrollLeft).toBe(0)
    focus.mockRestore()
  })

  it('uses a custom label', () => {
    expect(make({ label: 'Get code' }).find('button').text()).toBe('Get code')
  })

  it('copies and emits the kind', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const w = make({ sshUrl: 'ssh://h/a/b' })
    await w.find('button').trigger('click')
    for (const [label, value] of [
      ['Copy HTTPS', props.httpsUrl],
      ['Copy SSH', 'ssh://h/a/b'],
      ['Copy pyn', props.command],
    ]) {
      await w.find(`button[aria-label="${label}"]`).trigger('click')
      await flushPromises()
      expect(writeText).toHaveBeenLastCalledWith(value)
    }
    expect(w.emitted('copy')).toEqual([['https'], ['ssh'], ['command']])
    expect(w.find('button[aria-label="Copy pyn"]').text()).toBe('Copied')
  })

  it('reports a failed copy without emitting', async () => {
    vi.stubGlobal('navigator', {})
    document.execCommand = () => false
    const w = make()
    await w.find('button').trigger('click')
    await w.find('button[aria-label="Copy HTTPS"]').trigger('click')
    await flushPromises()
    expect(w.text()).toContain('Could not copy')
    expect(w.emitted('copy')).toBeUndefined()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const w = make()
    await w.find('button').trigger('click')
    await flushPromises()
    expect(document.activeElement).toBe(w.find('input').element)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()
    expect(w.find('[role=dialog]').exists()).toBe(false)
    expect(document.activeElement).toBe(w.find('button').element)
  })

  it('closes on an outside click', async () => {
    const w = make()
    await w.find('button').trigger('click')
    document.body.click()
    await flushPromises()
    expect(w.find('[role=dialog]').exists()).toBe(false)
  })

  it('shows the SSH row only with sshUrl', async () => {
    const without = make()
    await without.find('button').trigger('click')
    expect(without.find('button[aria-label="Copy SSH"]').exists()).toBe(false)
    const withSsh = make({ sshUrl: 'ssh://h/a/b' })
    await withSsh.find('button').trigger('click')
    expect(withSsh.find('button[aria-label="Copy SSH"]').exists()).toBe(true)
  })
})
