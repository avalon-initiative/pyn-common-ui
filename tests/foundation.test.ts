// Tests for tokens, theme handling, mixins and the pure helpers.
import { readFileSync } from 'node:fs'
import { compileString } from 'sass'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  EXPIRING_SOON_MS,
  applyTheme,
  formatDate,
  formatDateTime,
  formatLease,
  formatWait,
  loadTheme,
  lockState,
  saveTheme,
  themeChoices,
} from '../src'
import type { LockInfo } from '../src'

const tokens = readFileSync('src/styles/tokens.css', 'utf8')

function names(block: string): string[] {
  return [...block.matchAll(/(--pyn-[\w-]+):/g)].map((m) => m[1]).sort()
}

describe('tokens.css', () => {
  it('defines the same colors in the OS-light, light and dark blocks', () => {
    const dark = names(tokens.split(":root[data-theme='dark']")[1])
    const light = names(tokens.split(":root[data-theme='light']")[1].split(":root[data-theme='dark']")[0])
    const osLight = names(tokens.split('@media (prefers-color-scheme: light)')[1].split(":root[data-theme='light']")[0])
    expect(light).toEqual(dark)
    expect(osLight).toEqual(dark)
  })
})

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('offers system, light and dark', () => {
    expect(themeChoices.map((c) => c.id)).toEqual(['system', 'light', 'dark'])
  })

  it('persists light and dark and clears the key for system', () => {
    saveTheme('dark')
    expect(loadTheme()).toBe('dark')
    saveTheme('system')
    expect(localStorage.getItem('pyn-theme')).toBeNull()
    expect(loadTheme()).toBe('system')
  })

  it('ignores an unknown stored value', () => {
    localStorage.setItem('pyn-theme', 'sepia')
    expect(loadTheme()).toBe('system')
  })

  it('pins data-theme, and system removes the pin', () => {
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    applyTheme('system')
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })
})

describe('mixins', () => {
  it('compile with their dependencies resolved', () => {
    const css = compileString(
      `@use 'mixins' as m;
       .a { @include m.button; @include m.narrow { display: none; } }
       .b { @include m.list; @include m.syntax; }`,
      { loadPaths: ['src/styles'] },
    ).css
    expect(css).toContain(':focus-visible')
    expect(css).toContain('max-width: 40rem')
    expect(css).toContain('.hljs-keyword')
  })
})

describe('date formatting', () => {
  it('prints Mon DD YYYY and HH:MM in the given timezone', () => {
    expect(formatDate('2026-06-09T14:05:33.652Z', 'UTC')).toBe('Jun 09 2026')
    expect(formatDateTime('2026-06-09T14:05:33.652Z', 'UTC')).toBe('Jun 09 2026 14:05')
  })

  it('converts from UTC across the date line', () => {
    expect(formatDateTime('2026-06-09T23:30:00Z', 'Asia/Tokyo')).toBe('Jun 10 2026 08:30')
    expect(formatDateTime('2026-01-01T03:00:00Z', 'America/New_York')).toBe('Dec 31 2025 22:00')
  })

  it('uses a 24-hour clock at midnight', () => {
    expect(formatDateTime('2026-06-09T00:05:00Z', 'UTC')).toBe('Jun 09 2026 00:05')
  })
})

describe('formatWait', () => {
  it('rounds up and picks the unit', () => {
    expect(formatWait(undefined)).toBe('a moment')
    expect(formatWait(0)).toBe('a moment')
    expect(formatWait(1)).toBe('1 second')
    expect(formatWait(30.2)).toBe('31 seconds')
    expect(formatWait(61)).toBe('2 minutes')
    expect(formatWait(3600)).toBe('1 hour')
    expect(formatWait(7201)).toBe('3 hours')
  })
})

describe('lease text and lock state', () => {
  const now = new Date('2026-06-09T12:00:00Z')
  const at = (ms: number) => new Date(now.getTime() + ms).toISOString()
  const lock = (ms: number, owner = 'ana'): LockInfo => ({
    path: 'a.bin',
    owner,
    acquired_at: at(-1000),
    expires_at: at(ms),
  })

  it('formats the time left', () => {
    expect(formatLease(at(3 * 3600_000 + 42 * 60_000), now)).toBe('3h 42m')
    expect(formatLease(at(12 * 60_000), now)).toBe('12m')
    expect(formatLease(at(30_000), now)).toBe('<1m')
    expect(formatLease(at(0), now)).toBe('expired')
  })

  it('derives the state a viewer sees', () => {
    expect(lockState(null, 'bo', now)).toBe('available')
    expect(lockState(lock(-1), 'bo', now)).toBe('available')
    expect(lockState(lock(3600_000, 'bo'), 'bo', now)).toBe('mine')
    expect(lockState(lock(EXPIRING_SOON_MS - 1), 'bo', now)).toBe('expiring')
    expect(lockState(lock(EXPIRING_SOON_MS + 1), 'bo', now)).toBe('locked')
  })
})
