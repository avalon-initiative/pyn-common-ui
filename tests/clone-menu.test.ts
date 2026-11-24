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
    expect(w.find('button').text()).toBe('Code')
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

  it('keeps the panel open through a pointer press on a copy button', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const w = make()
    await w.find('button').trigger('click')
    const outside = document.createElement('main')
    outside.tabIndex = -1
    document.body.appendChild(outside)
    const copyBtn = w.find('button[aria-label="Copy HTTPS"]')
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    copyBtn.element.dispatchEvent(down)
    if (!down.defaultPrevented) {
      w.find('input').element.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }),
      )
    }
    await flushPromises()
    await copyBtn.trigger('click')
    await flushPromises()
    expect(w.find('[role=dialog]').exists()).toBe(true)
    expect(w.emitted('copy')).toEqual([['https']])
    outside.remove()
  })

  it('copies and emits the kind', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const w = make({ sshUrl: 'ssh://h/a/b' })
    await w.find('button').trigger('click')
    for (const [tab, label, value] of [
      [0, 'Copy HTTPS', props.httpsUrl],
      [1, 'Copy SSH', 'ssh://h/a/b'],
      [1, 'Copy pyn', props.command],
    ] as const) {
      await w.findAll('[role=tab]')[tab]!.trigger('click')
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
    expect(without.find('[role=tablist]').exists()).toBe(false)
    const withSsh = make({ sshUrl: 'ssh://h/a/b', sshCommand: 'pyn clone ssh://h/a/b' })
    await withSsh.find('button').trigger('click')
    expect(withSsh.findAll('[role=tab]').map((t) => t.text())).toEqual(['HTTPS', 'SSH'])
    expect(withSsh.find('button[aria-label="Copy SSH"]').exists()).toBe(false)
    await withSsh.findAll('[role=tab]')[1]!.trigger('click')
    const values = withSsh.findAll('input').map((i) => (i.element as HTMLInputElement).value)
    expect(values).toEqual(['ssh://h/a/b', 'pyn clone ssh://h/a/b'])
    expect(withSsh.find('[role=tab][aria-selected=true]').text()).toBe('SSH')
    await withSsh.find('[role=tablist]').trigger('keydown', { key: 'ArrowLeft' })
    expect(withSsh.find('[role=tab][aria-selected=true]').text()).toBe('HTTPS')
  })

  it('adds a Download ZIP row that emits download and closes the panel', async () => {
    const none = make()
    await none.find('button').trigger('click')
    expect(none.text()).not.toContain('Download ZIP')
    const w = make({ downloadZip: true })
    await w.find('button').trigger('click')
    const row = w.findAll('button').find((b) => b.text().includes('Download ZIP'))!
    await row.trigger('click')
    expect(w.emitted('download')).toHaveLength(1)
    expect(w.find('[role=dialog]').exists()).toBe(false)
  })
})
