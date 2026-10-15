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

const members = await renderToString(
  createSSRApp({
    render: () =>
      h(built.PynMembers, {
        grantees: built.teamGrantees('studio', [{ slug: 'artists', name: 'Artists', description: '', role: 'writer' }]),
        roles: ['reader'],
        kind: 'team',
      }),
  }),
)
if (!members.includes('/studio/-/teams/artists')) throw new Error(`PynMembers did not render: ${members}`)
const locks = await renderToString(createSSRApp({ render: () => h(built.PynMyLocks, { locks: [] }) }))
if (!locks.includes('You hold no locks')) throw new Error(`PynMyLocks did not render: ${locks}`)
if (built.parseLockLimit('7') !== 7) throw new Error('parseLockLimit did not run from dist')
const teamList = await renderToString(
  createSSRApp({
    render: () =>
      h(built.PynTeamList, {
        org: 'studio',
        teams: [{ slug: 'qa', name: 'qa', description: '', created_at: '2026-09-12T14:30:00Z', members: [], repos: [] }],
      }),
  }),
)
if (!teamList.includes('/studio/-/teams/qa')) throw new Error(`PynTeamList did not render: ${teamList}`)
const orgList = await renderToString(createSSRApp({ render: () => h(built.PynOrgList, { orgs: [] }) }))
if (!orgList.includes('not in any organization')) throw new Error(`PynOrgList did not render: ${orgList}`)
if (built.ruleSubjects('role', 'deny', [], []).join() !== 'member') throw new Error('ruleSubjects did not run from dist')
const signIn = await renderToString(createSSRApp({ render: () => h(built.PynSignIn, { registration: 'closed' }) }))
if (!signIn.includes('Sign in')) throw new Error(`PynSignIn did not render: ${signIn}`)
const keys = await renderToString(createSSRApp({ render: () => h(built.PynKeys, { keys: [] }) }))
if (!keys.includes('No keys yet')) throw new Error(`PynKeys did not render: ${keys}`)
const accounts = await renderToString(createSSRApp({ render: () => h(built.PynAccounts, { accounts: [], status: '', self: 'root' }) }))
if (!accounts.includes('No accounts match')) throw new Error(`PynAccounts did not render: ${accounts}`)
if (built.accountActions({ user: 'a', status: 'disabled' }, 'b').join() !== 'enable') throw new Error('accountActions did not run from dist')

const targets = Object.values(pkg.exports).flatMap((v) => (typeof v === 'string' ? [v] : Object.values(v)))
const absent = targets.filter((t) => !existsSync(t))
if (absent.length > 0) throw new Error(`package.json exports point at missing files: ${absent.join(', ')}`)

console.log(`smoke: ${expected.length} components and ${helpers.length} helpers exported, render ok, ${targets.length} export paths present`)
