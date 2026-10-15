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

const notFound = await renderToString(createSSRApp({ render: () => h(built.PynRepoNotFound, { slug: 'a/b' }) }))
if (!notFound.includes('Repository not found')) throw new Error(`PynRepoNotFound did not render: ${notFound}`)
if (built.matchRepos(['a/b', 'c/d'], 'c')[0] !== 'c/d') throw new Error('matchRepos did not run from dist')

const side = await renderToString(
  createSSRApp({ render: () => h(built.PynSideNav, { account: 'alice', items: built.mainNav, current: 'home', repos: [{ owner: 'alice', name: 'game' }] }) }),
)
if (!side.includes('alice/game')) throw new Error(`PynSideNav did not render: ${side}`)
const orgHeader = await renderToString(
  createSSRApp({ render: () => h(built.PynOrgHeader, { name: 'studio', createdAt: '2026-09-02T08:00:00Z', role: 'owner' }) }),
)
if (!orgHeader.includes('studio')) throw new Error(`PynOrgHeader did not render: ${orgHeader}`)
if (built.repoTabs(['read'], false).length !== 3) throw new Error('repoTabs did not run from dist')

const tree = await renderToString(
  createSSRApp({
    render: () =>
      h(built.PynTree, {
        owner: 'a',
        name: 'b',
        entries: [{ kind: 'file', name: 'x.ts', path: 'src/x.ts', mode: 'shared' }],
      }),
  }),
)
if (!tree.includes('/a/b/blob/src/x.ts')) throw new Error(`PynTree did not render: ${tree}`)
// renderMarkdown needs a DOM (DOMPurify), so node only checks the code highlighter.
if (!built.highlight('const a = 1', 'javascript').includes('hljs-keyword')) throw new Error('highlight did not run from dist')
if (built.parseLineHash('#L3-L1').start !== 1) throw new Error('parseLineHash did not run from dist')
const code = await renderToString(createSSRApp({ render: () => h(built.PynCodeView, { text: 'a\nb', language: null }) }))
if (!code.includes('id="L2"')) throw new Error(`PynCodeView did not render: ${code}`)

const targets = Object.values(pkg.exports).flatMap((v) => (typeof v === 'string' ? [v] : Object.values(v)))
const absent = targets.filter((t) => !existsSync(t))
if (absent.length > 0) throw new Error(`package.json exports point at missing files: ${absent.join(', ')}`)

console.log(`smoke: ${expected.length} components and ${helpers.length} helpers exported, render ok, ${targets.length} export paths present`)
