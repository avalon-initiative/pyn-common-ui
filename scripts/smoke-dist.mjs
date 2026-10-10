// Smoke test for the built package: imports dist/ the way a consumer would,
// checks every name exported from src/index.ts resolves, renders a component
// to HTML, and confirms every path in package.json's exports exists.
import { existsSync, readFileSync } from 'node:fs'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const built = await import(new URL('../dist/index.js', import.meta.url))

const source = readFileSync('src/index.ts', 'utf8')
const expected = [...source.matchAll(/export \{ default as (\w+) \}/g)].map((m) => m[1])
if (expected.length === 0) throw new Error('found no component exports in src/index.ts')
const missing = expected.filter((name) => !(name in built))
if (missing.length > 0) throw new Error(`missing from dist: ${missing.join(', ')}`)

// Functions and constants exported from src/index.ts must resolve too.
const helpers = [...source.matchAll(/^export \{([^}]+)\} from/gm)]
  .flatMap((m) => m[1].split(',').map((n) => n.trim()))
  .filter((n) => n && !n.startsWith('default as'))
const absentHelpers = helpers.filter((name) => !(name in built))
if (absentHelpers.length > 0) throw new Error(`missing from dist: ${absentHelpers.join(', ')}`)
if (built.formatWait(90) !== '2 minutes') throw new Error('formatWait did not run from dist')

const html = await renderToString(createSSRApp({ render: () => h(built.PynButton, { label: 'Smoke' }) }))
if (!html.includes('Smoke')) throw new Error(`PynButton did not render its label: ${html}`)

const targets = Object.values(pkg.exports).flatMap((v) => (typeof v === 'string' ? [v] : Object.values(v)))
const absent = targets.filter((t) => !existsSync(t))
if (absent.length > 0) throw new Error(`package.json exports point at missing files: ${absent.join(', ')}`)

console.log(`smoke: ${expected.length} components and ${helpers.length} helpers exported, render ok, ${targets.length} export paths present`)
