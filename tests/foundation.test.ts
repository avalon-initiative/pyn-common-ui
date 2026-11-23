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

type Theme = 'light' | 'dark'

/** Resolves a token to a hex color for one theme, following var() aliases. */
function color(name: string, theme: Theme): string {
  const m = new RegExp(`${name}:\\s*([^;]+);`).exec(tokens)
  if (!m) throw new Error(`missing token ${name}`)
  const value = m[1].trim()
  const alias = /^var\((--pyn-[\w-]+)\)$/.exec(value)
  if (alias) return color(alias[1], theme)
  const pair = /^light-dark\(\s*(#\w+)\s*,\s*(#\w+)\s*\)$/.exec(value)
  if (pair) return theme === 'light' ? pair[1] : pair[2]
  return value
}

function rgba(hex: string): [number, number, number, number] {
  let h = hex.slice(1)
  if (h.length === 3) h = [...h].map((c) => c + c).join('')
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16)
  return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1]
}

function luminance([r, g, b]: number[]): number {
  const lin = (v: number) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** WCAG contrast of fg on bg; translucent colors are composited over the canvas. */
function contrast(fg: string, bg: string, theme: Theme): number {
  const canvas = rgba(color('--pyn-bg', theme))
  const over = (top: number[], under: number[]) => {
    const a = top[3] ?? 1
    return [0, 1, 2].map((i) => top[i] * a + under[i] * (1 - a))
  }
  const base = over(rgba(color(bg, theme)), canvas)
  const front = over(rgba(color(fg, theme)), base)
  const [hi, lo] = [luminance(front), luminance(base)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const textPairs: [string, string][] = [
  ['--pyn-text', '--pyn-bg'],
  ['--pyn-text', '--pyn-bg-subtle'],
  ['--pyn-text', '--pyn-control-bg'],
  ['--pyn-text', '--pyn-selected'],
  ['--pyn-text-muted', '--pyn-bg'],
  ['--pyn-text-muted', '--pyn-bg-subtle'],
  ['--pyn-text-muted', '--pyn-bg-inset'],
  ['--pyn-accent', '--pyn-bg'],
  ['--pyn-accent', '--pyn-bg-subtle'],
  ['--pyn-accent', '--pyn-accent-bg'],
  ['--pyn-success', '--pyn-bg'],
  ['--pyn-success', '--pyn-success-bg'],
  ['--pyn-attention', '--pyn-bg'],
  ['--pyn-attention', '--pyn-attention-bg'],
  ['--pyn-danger', '--pyn-bg'],
  ['--pyn-danger', '--pyn-danger-bg'],
  ['--pyn-on-accent', '--pyn-accent-fill'],
  ['--pyn-on-accent', '--pyn-success-fill'],
  ['--pyn-on-accent', '--pyn-danger-fill'],
  ['--pyn-syntax-keyword', '--pyn-bg'],
  ['--pyn-syntax-string', '--pyn-bg'],
  ['--pyn-syntax-comment', '--pyn-bg'],
  ['--pyn-syntax-number', '--pyn-bg'],
  ['--pyn-syntax-name', '--pyn-bg'],
  ['--pyn-syntax-comment', '--pyn-bg-inset'],
]

const nonTextPairs: [string, string][] = [
  ['--pyn-focus', '--pyn-bg'],
  ['--pyn-border-strong', '--pyn-bg'],
]

describe('tokens.css', () => {
  it('declares every color once, as a light/dark pair or an alias', () => {
    expect(tokens).not.toContain('prefers-color-scheme')
    const decls = [...tokens.split('@media')[0].matchAll(/^\s+(--pyn-[\w-]+):/gm)].map((m) => m[1])
    expect(new Set(decls).size).toBe(decls.length)
  })

  it('follows the OS and lets data-theme pin a scheme', () => {
    expect(tokens).toMatch(/color-scheme: light dark;/)
    expect(tokens).toMatch(/:root\[data-theme='light'\] \{\s*color-scheme: light;/)
    expect(tokens).toMatch(/:root\[data-theme='dark'\] \{\s*color-scheme: dark;/)
  })

  it('keeps the older token names', () => {
    for (const name of [
      '--pyn-surface',
      '--pyn-surface-raised',
      '--pyn-available',
      '--pyn-available-bg',
      '--pyn-locked',
      '--pyn-locked-bg',
      '--pyn-mine',
      '--pyn-mine-bg',
    ]) {
      expect(() => color(name, 'light')).not.toThrow()
    }
  })

  it('sets a 14px base on the body', () => {
    expect(color('--pyn-text-base', 'light')).toBe('0.875rem')
    expect(readFileSync('src/styles/global.css', 'utf8')).toContain(
      'font-size: var(--pyn-text-base)',
    )
  })

  for (const theme of ['light', 'dark'] as const) {
    it.each(textPairs)(`${theme}: %s on %s meets AA text contrast (4.5)`, (fg, bg) => {
      expect(contrast(fg, bg, theme)).toBeGreaterThanOrEqual(4.5)
    })

    it.each(nonTextPairs)(`${theme}: %s on %s meets non-text contrast (3)`, (fg, bg) => {
      expect(contrast(fg, bg, theme)).toBeGreaterThanOrEqual(3)
    })
  }
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
