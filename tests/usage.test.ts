import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import {
  PynOwnerUsage,
  PynStorageCapForm,
  PynUsageBreakdown,
  PynUsageMeter,
  capToBytes,
  formatBytes,
  splitCap,
} from '../src'
import {
  breakdown,
  emptyBreakdown,
  ownerUsage,
  unlimitedOwnerUsage,
} from '../src/stories/usage-data'

const GB = 1024 ** 3

describe('formatBytes', () => {
  it('formats with 1024-based units', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(formatBytes(10 * GB)).toBe('10 GB')
  })
})

describe('PynUsageMeter', () => {
  const meter = (used: number, limit: number | null) =>
    mount(PynUsageMeter, { props: { label: 'Storage', unit: 'bytes', used, limit } })

  it('exposes a meter with aria values', () => {
    const track = meter(4 * GB, 10 * GB).find('[role="meter"]')
    expect(track.attributes('aria-valuemin')).toBe('0')
    expect(track.attributes('aria-valuemax')).toBe(String(10 * GB))
    expect(track.attributes('aria-valuenow')).toBe(String(4 * GB))
    expect(track.attributes('aria-valuetext')).toBe('4 GB of 10 GB')
  })

  it('warns near the limit and flags danger at or over it', () => {
    expect(meter(5 * GB, 10 * GB).attributes('data-level')).toBe('ok')
    expect(meter(8 * GB, 10 * GB).attributes('data-level')).toBe('warning')
    expect(meter(10 * GB, 10 * GB).attributes('data-level')).toBe('danger')
    const over = meter(12 * GB, 10 * GB)
    expect(over.attributes('data-level')).toBe('danger')
    expect(over.find('[role="meter"]').attributes('aria-valuenow')).toBe(String(10 * GB))
  })

  it('says unlimited and draws no fill when the limit is null', () => {
    const w = meter(4 * GB, null)
    expect(w.text()).toContain('4 GB used, unlimited')
    expect(w.find('[role="meter"]').exists()).toBe(false)
    expect(w.find('span[style]').exists()).toBe(false)
  })
})

describe('PynOwnerUsage', () => {
  it('shows the owner meters and the repositories in the given order', () => {
    const w = mount(PynOwnerUsage, { props: { usage: ownerUsage } })
    expect(w.text()).toContain('13 GB of 20 GB')
    expect(w.text()).toContain('3 of 10')
    expect(w.text()).toContain('12 of 25')
    const names = w.findAll('li button').map((b) => b.text())
    expect(names).toEqual(['studio/game', 'studio/assets', 'studio/tools'])
    const rows = w.findAll('li')
    expect(rows[0].text()).toContain('9 GB of 10 GB')
    expect(rows[1].text()).toContain('unlimited')
    expect(rows[2].find('[data-level]').attributes('data-level')).toBe('danger')
  })

  it('emits open with the repository row', async () => {
    const w = mount(PynOwnerUsage, { props: { usage: ownerUsage } })
    await w.findAll('li button')[1].trigger('click')
    expect(w.emitted('open')).toEqual([[ownerUsage.repositories[1]]])
  })

  it('leaves out members for a user and handles no repositories', () => {
    const w = mount(PynOwnerUsage, {
      props: { usage: { ...unlimitedOwnerUsage, repositories: [] } },
    })
    expect(w.text()).not.toContain('Members')
    expect(w.text()).toContain('No repositories yet.')
  })
})

describe('PynUsageBreakdown', () => {
  it('lists folders and largest paths with the shared-content note', () => {
    const w = mount(PynUsageBreakdown, { props: { breakdown } })
    expect(w.find('[data-note]').text()).toContain('more than the stored total')
    const rows = w.findAll('tbody tr').map((r) => r.text())
    expect(rows[0]).toContain('art')
    expect(rows.some((r) => r.includes('(repository root)'))).toBe(true)
    expect(rows.some((r) => r.includes('art/hero.psd') && r.includes('14'))).toBe(true)
  })

  it('shows empty states', () => {
    const w = mount(PynUsageBreakdown, { props: { breakdown: emptyBreakdown } })
    expect(w.find('table').exists()).toBe(false)
    expect(w.text()).toContain('No folders')
    expect(w.text()).toContain('No paths')
  })
})

describe('PynStorageCapForm', () => {
  it('converts the unit to bytes on save', async () => {
    const w = mount(PynStorageCapForm, { props: { cap: null } })
    await w.find('input').setValue('2')
    await w.find('select').setValue('GB')
    await w.find('form').trigger('submit')
    expect(w.emitted('save')).toEqual([[{ storage_bytes: 2 * GB }]])
  })

  it('shows the current cap in its largest exact unit and can clear it', async () => {
    const w = mount(PynStorageCapForm, { props: { cap: 10 * GB } })
    expect((w.find('input').element as HTMLInputElement).value).toBe('10')
    expect((w.find('select').element as HTMLSelectElement).value).toBe('GB')
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('clear')).toHaveLength(1)
  })

  it('offers no clear without a cap and rejects a negative value', async () => {
    const w = mount(PynStorageCapForm, { props: { cap: null } })
    expect(w.findAll('button')).toHaveLength(1)
    await w.find('input').setValue('-1')
    await w.find('form').trigger('submit')
    expect(w.emitted('save')).toBeUndefined()
    expect(w.find('[role="alert"]').exists()).toBe(true)
  })

  it('shows the error and disables the buttons while busy', () => {
    const w = mount(PynStorageCapForm, { props: { cap: 1, busy: true, error: 'No.' } })
    expect(w.text()).toContain('No.')
    expect(w.findAll('button').every((b) => b.attributes('disabled') !== undefined)).toBe(true)
  })

  it('writes nothing when readonly', async () => {
    const w = mount(PynStorageCapForm, { props: { cap: 10 * GB, readonly: true } })
    expect(w.text()).toContain('10 GB')
    for (const el of w.findAll('button, input, select')) {
      expect(el.attributes('disabled')).toBeDefined()
    }
    await w.find('form').trigger('submit')
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('save')).toBeUndefined()
    expect(w.emitted('clear')).toBeUndefined()
  })
})

describe('cap conversion', () => {
  it('round-trips and rejects bad input', () => {
    expect(splitCap(1536)).toEqual({ value: '1536', unit: 'B' })
    expect(capToBytes('1.5', 'KB')).toBe(1536)
    expect(capToBytes('', 'GB')).toBeNull()
    expect(capToBytes('-1', 'GB')).toBeNull()
  })
})
