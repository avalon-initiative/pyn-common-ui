import { describe, expect, it } from 'vitest'
import { highlightToml } from '../src/utils/toml-highlight'

const flat = (text: string) => highlightToml(text).map((l) => l.map((t) => `${t.kind}:${t.text}`))

describe('highlightToml', () => {
  it('splits keys, strings, numbers, booleans and comments', () => {
    expect(flat('a.b = "x" # note')).toEqual([
      ['key:a.b', 'plain: = ', 'string:"x"', 'plain: ', 'comment:# note'],
    ])
    expect(flat('n = -3\nd = 2026-10-26\nok = false')).toEqual([
      ['key:n', 'plain: = ', 'number:-3'],
      ['key:d', 'plain: = ', 'number:2026-10-26'],
      ['key:ok', 'plain: = ', 'boolean:false'],
    ])
  })

  it('handles table headers and single-quoted and escaped strings', () => {
    expect(flat('[[rule]]')[0]).toEqual(['table:[[rule]]'])
    expect(flat(`s = 'a"b' \n t = "q\\"z"`)[1]).toContain('string:"q\\"z"')
  })

  it('carries multi-line strings and arrays across lines', () => {
    const lines = flat('a = """\n[not.table]\n"""\nb = [\n  "x",\n  [1],\n]\n[t]')
    expect(lines[1]).toEqual(['string:[not.table]'])
    expect(lines[4].some((t) => t.startsWith('string:'))).toBe(true)
    expect(lines[6][0]).not.toMatch(/^table/)
    expect(lines[7]).toEqual(['table:[t]'])
  })

  it('colours keys inside inline tables and keeps them off values', () => {
    expect(flat('m = { a = 1, "q k" = "x", b.c = true, d = [1, 2] }')[0]).toEqual([
      'key:m',
      'plain: = { ',
      'key:a',
      'plain: = ',
      'number:1',
      'plain:, ',
      'key:"q k"',
      'plain: = ',
      'string:"x"',
      'plain:, ',
      'key:b',
      'plain:.',
      'key:c',
      'plain: = ',
      'boolean:true',
      'plain:, ',
      'key:d',
      'plain: = [',
      'number:1',
      'plain:, ',
      'number:2',
      'plain:] }',
    ])
  })

  it('leaves malformed lines plain', () => {
    expect(flat('not toml at all')).toEqual([['plain:not toml at all']])
  })

  it('keeps the original text intact', () => {
    const src = 'x = "a" # c\n\n[a.b]\nk = [1, 2]\n'
    expect(
      highlightToml(src)
        .map((l) => l.map((t) => t.text).join(''))
        .join('\n'),
    ).toBe(src)
  })
})
