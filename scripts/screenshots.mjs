#!/usr/bin/env node
// Screenshots Storybook stories at 1280 and 390 px, light and dark.
// The narrow width uses a touch context so (pointer: coarse) matches.
//
// Playwright is not a dependency of this repo; point PLAYWRIGHT_CORE at an installed copy:
//   export PLAYWRIGHT_CORE=/path/to/node_modules/playwright-core/index.mjs
//   npx storybook build -o /tmp/sb                  # build the current stories first
//   node scripts/screenshots.mjs --dir /tmp/sb --out /tmp/shots [--font-set default|arcade|system] [story-id ...]
// Story ids are the keys of <dir>/index.json. Without ids, DEFAULT_STORIES is used.
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const DEFAULT_STORIES = [
  'shell-pynshell--repository-page',
  'shell-pynshell--signed-out-page',
  'repository-pynreposhell--counts',
  'browse-pynrepolanding--root',
  'browse-pynbranchbar--default',
  'locks-pynfilelist--game-repository',
  'dashboard-pyndashboard--default',
  'repositories-pynrepoform--create',
  'account-pynsignin--open-server',
  'primitives-pynemptystate--with-both-actions',
  'locks-pynmodechip--mixed',
  'locks-pynlockbadge--locked-by-other',
  'pyn-button--primary',
  'shell-pyntabs--default',
  'shell-pynmenu--links',
  'policy-pynpolicyeditor--clean',
]

const VIEWPORTS = [
  { width: 1280, height: 900, touch: false },
  { width: 390, height: 844, touch: true },
]

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

function parseArgs(argv) {
  const opts = { dir: 'storybook-static', out: '', fontSet: '', ids: [] }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dir') opts.dir = argv[++i]
    else if (argv[i] === '--out') opts.out = argv[++i]
    else if (argv[i] === '--font-set') opts.fontSet = argv[++i]
    else opts.ids.push(argv[i])
  }
  return opts
}

function serve(root) {
  const base = resolve(root)
  const server = createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname))
    const file = join(base, path === '/' ? 'index.html' : path)
    if (!file.startsWith(base) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404).end()
      return
    }
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
    createReadStream(file).pipe(res)
  })
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)))
}

const { dir, out, fontSet, ids } = parseArgs(process.argv.slice(2))
if (!process.env.PLAYWRIGHT_CORE || !out) {
  console.error(
    'usage: PLAYWRIGHT_CORE=<playwright-core/index.mjs> node scripts/screenshots.mjs --out <dir> [--dir <storybook build>] [story-id ...]',
  )
  process.exit(2)
}
const { chromium } = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_CORE)).href)
mkdirSync(out, { recursive: true })

const server = await serve(dir)
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch()
try {
  for (const theme of ['light', 'dark']) {
    for (const { width, height, touch } of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width, height },
        hasTouch: touch,
        isMobile: touch,
        colorScheme: theme,
      })
      const page = await ctx.newPage()
      for (const id of ids.length ? ids : DEFAULT_STORIES) {
        await page.goto(
          `${base}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}${fontSet ? `;fontSet:${fontSet}` : ''}`,
          {
            waitUntil: 'networkidle',
          },
        )
        await page.screenshot({
          path: join(out, `${id}${fontSet ? `-${fontSet}` : ''}-${theme}-${width}.png`),
          fullPage: true,
        })
      }
      await ctx.close()
    }
  }
} finally {
  await browser.close()
  server.close()
}
