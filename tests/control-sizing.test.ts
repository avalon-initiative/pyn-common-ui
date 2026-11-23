// Control height scale: one pointer-based touch rule, no width-based min-height blocks.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { compileString } from 'sass'
import { describe, expect, it } from 'vitest'

const dir = 'src/styles'
const files = readdirSync(dir).filter((f) => f.endsWith('.scss'))
const source = (f: string) => readFileSync(join(dir, f), 'utf8')

// Body of every `@include narrow` / `@include m.narrow` block, nesting-aware.
function narrowBlocks(text: string): string[] {
  const out: string[] = []
  const re = /@include (?:m\.)?narrow\s*\{/g
  for (let m = re.exec(text); m; m = re.exec(text)) {
    let depth = 1
    let i = re.lastIndex
    while (depth > 0 && i < text.length) {
      if (text[i] === '{') depth++
      else if (text[i] === '}') depth--
      i++
    }
    out.push(text.slice(re.lastIndex, i - 1))
  }
  return out
}

describe('control sizing', () => {
  it('has no width-based min-height inside narrow blocks', () => {
    const offenders = files.filter((f) =>
      narrowBlocks(source(f)).some((b) => /min-height\s*:/.test(b)),
    )
    expect(offenders).toEqual([])
  })

  it('has no hard-coded 44px touch size outside the token', () => {
    const offenders = files.filter((f) => /2\.75rem/.test(source(f)))
    expect(offenders).toEqual([])
  })

  it('defines the touch rule once, on a coarse pointer, using the touch token', () => {
    const mixins = source('_mixins.scss')
    expect(mixins.match(/@media \(pointer: coarse\)/g)).toHaveLength(1)
    expect(mixins).toContain('min-height: var(--pyn-control-touch)')
  })

  it('compiles the control mixins to the shared heights', () => {
    const css = compileString(
      `@use 'mixins' as m;
       .btn { @include m.button; }
       .primary { @include m.button-primary; }
       .field { @include m.input; }
       .tab { @include m.tab; }
       .row { @include m.table-row; }
       .item { @include m.menu-item; }
       .box { @include m.density-hook; }`,
      { loadPaths: [dir] },
    ).css
    for (const sel of ['.btn', '.primary', '.field', '.tab']) {
      const block = new RegExp(`${sel.replace('.', '\\.')} \\{[^}]*\\}`).exec(css)?.[0] ?? ''
      expect(block, sel).toContain('min-height: var(--pyn-control-md)')
    }
    expect(css).toMatch(
      /@media \(pointer: coarse\)\s*\{\s*\.btn\s*\{\s*min-height: var\(--pyn-control-touch\)/,
    )
    expect(css).toContain('[data-density=comfortable]')
  })
})
