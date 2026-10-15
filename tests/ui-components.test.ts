// Component render tests for every exported component. Run with `make test`.
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import {
  PynAccountNotice,
  PynActivity,
  PynBranchBar,
  PynBreadcrumb,
  PynButton,
  PynCheckoutCard,
  PynCodeView,
  PynFileBar,
  PynFileList,
  PynFileView,
  PynHistory,
  PynIcon,
  PynLockBadge,
  PynLockIcon,
  PynLockedFiles,
  PynMarkdown,
  PynMenu,
  PynModeChip,
  PynOrgHeader,
  PynPageNotFound,
  PynReadme,
  PynRepoDetails,
  PynRepoHeader,
  PynRepoLanding,
  PynRepoNav,
  PynRepoNotFound,
  PynResendForm,
  PynSearch,
  PynShell,
  PynSideNav,
  PynTopBar,
  PynTree,
  blobPath,
  breadcrumbs,
  clickLine,
  contentUrl,
  entryAt,
  fileBody,
  fileCrumbs,
  fileKind,
  folderParam,
  formatAgo,
  groupByTopLevel,
  highlightLines,
  historyLink,
  languageFor,
  lineHash,
  mainNav,
  matchRepos,
  parseLineHash,
  readmeEntry,
  renderMarkdown,
  repoTabs,
  resolveRelative,
  splitPath,
  treePath,
} from '../src'
import { codeText, fileEntry, imageSrc, lockedEntry, readmeText } from '../src/stories/file-data'
import { folderListing, repo, rootEntries, rootListing, summary } from '../src/stories/landing-data'


const now = new Date('2026-10-08T12:00:00Z')
const r = { owner: 'acme', name: 'castle-quest' }
const bytes = (s: string) => new TextEncoder().encode(s)
const lock = (owner: string, minutesLeft: number) => ({
  path: 'Content/a.umap',
  owner,
  acquired_at: '2026-10-08T09:00:00Z',
  expires_at: new Date(now.getTime() + minutesLeft * 60_000).toISOString(),
})

describe('PynButton', () => {
  it('renders its label as a button', () => {
    const wrapper = mount(PynButton, { props: { label: 'Check out' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toBe('Check out')
  })

  it('applies the variant class', () => {
    const primary = mount(PynButton, { props: { label: 'a' } })
    const danger = mount(PynButton, { props: { label: 'a', variant: 'danger' } })
    expect(primary.classes().join(' ')).toContain('primary')
    expect(danger.classes().join(' ')).toContain('danger')
  })

  it('honours disabled', () => {
    const wrapper = mount(PynButton, { props: { label: 'a', disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})

describe('PynIcon and PynLockIcon', () => {
  it('draws a known icon and nothing for an unknown name', () => {
    expect(mount(PynIcon, { props: { name: 'repo' } }).find('path').attributes('d')).toBeTruthy()
    expect(mount(PynIcon, { props: { name: 'nope' } }).find('path').attributes('d')).toBe('')
  })

  it('opens the lock shackle', () => {
    expect(mount(PynLockIcon).attributes('data-open')).toBeUndefined()
    expect(mount(PynLockIcon, { props: { open: true } }).attributes('data-open')).toBe('')
  })
})

describe('PynModeChip', () => {
  it('names the mode', () => {
    expect(mount(PynModeChip, { props: { mode: 'shared' } }).text()).toBe('Shared')
    expect(mount(PynModeChip, { props: { mode: 'mixed' } }).text()).toBe('Mixed')
    const w = mount(PynModeChip, { props: { mode: 'exclusive' } })
    expect(w.text()).toBe('Exclusive')
    expect(w.attributes('data-mode')).toBe('exclusive')
  })
})

describe('PynLockBadge', () => {
  it('shows who holds the lock and for how long', () => {
    const w = mount(PynLockBadge, { props: { lock: lock('bob', 222), me: 'alice', now } })
    expect(w.text()).toContain('bob')
    expect(w.text()).toContain('3h 42m')
    expect(w.attributes('data-state')).toBe('locked')
  })

  it('says You for your own lock and Available when unlocked', () => {
    expect(
      mount(PynLockBadge, { props: { lock: lock('alice', 60), me: 'alice', now } }).text(),
    ).toContain('You')
    expect(mount(PynLockBadge, { props: { now } }).text()).toContain('Available')
  })
})

describe('PynMenu', () => {
  it('opens on click, emits a choice and closes', async () => {
    const w = mount(PynMenu, {
      props: { label: 'Theme', items: [{ id: 'dark', label: 'Dark', checked: false }] },
    })
    expect(w.find('[role=menu]').exists()).toBe(false)
    await w.find('button').trigger('click')
    await w.find('[role=menuitemradio]').trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['dark'])
    expect(w.find('[role=menu]').exists()).toBe(false)
  })
})

describe('PynSearch', () => {
  it('matches by substring', () => {
    expect(matchRepos(['alice/game', 'bob/tools'], ' BOB ')).toEqual(['bob/tools'])
    expect(matchRepos(['alice/game'], '')).toEqual([])
  })

  it('opens the matching repository on submit', async () => {
    const w = mount(PynSearch, { props: { options: ['alice/game', 'bob/tools'] } })
    await w.find('input').setValue('bob')
    await w.find('form').trigger('submit')
    expect(w.emitted('open')?.[0]).toEqual(['bob/tools'])
  })

  it('does nothing when nothing matches', async () => {
    const w = mount(PynSearch, { props: { options: ['alice/game'] } })
    await w.find('input').setValue('zzz')
    await w.find('form').trigger('submit')
    expect(w.emitted('open')).toBeUndefined()
  })
})

describe('PynBreadcrumb', () => {
  it('renders a labelled path with the current crumb unlinked', () => {
    const w = mount(PynBreadcrumb, {
      props: { crumbs: [{ label: 'game', href: '/alice/game' }, { label: 'a' }] },
    })
    expect(w.attributes('aria-label')).toBe('Path')
    expect(w.findAll('li')).toHaveLength(2)
    expect(w.findAll('a')).toHaveLength(1)
    expect(w.find('[aria-current=page]').text()).toBe('a')
  })
})

describe('not-found pages', () => {
  it('page not found is an alert', () => {
    expect(mount(PynPageNotFound).find('[role=alert]').text()).toContain('Page not found')
  })

  it('repository not found does not reveal whether it exists', () => {
    const w = mount(PynRepoNotFound, { props: { slug: 'bob/secret' } })
    expect(w.text()).toContain('bob/secret')
    expect(w.text()).toContain('no role')
  })
})

describe('PynAccountNotice', () => {
  it('emits the address to resend to and confirms without revealing the account', async () => {
    const w = mount(PynAccountNotice, { props: { status: 'pending_verification', sent: true } })
    await w.find('input').setValue('w@example.com')
    await w.find('form').trigger('submit')
    expect(w.emitted('resend')?.[0]).toEqual(['w@example.com'])
    expect(w.find('[role=status]').text()).toContain('If that address')
  })

  it.each([
    ['pending_approval', 'Waiting for approval'],
    ['account_disabled', 'Account disabled'],
  ] as const)('shows %s without the resend form and emits back', async (status, title) => {
    const w = mount(PynAccountNotice, { props: { status, user: 'wendy' } })
    expect(w.text()).toContain(title)
    expect(w.text()).toContain('wendy')
    expect(w.find('input').exists()).toBe(false)
    await w.find('button').trigger('click')
    expect(w.emitted('back')).toHaveLength(1)
  })

  it('renders the resend form states', () => {
    const w = mount(PynResendForm, { props: { sent: true, error: 'Too many attempts.' } })
    expect(w.find('[role=status]').exists()).toBe(true)
    expect(w.find('[role=alert]').text()).toContain('Too many')
  })
})

describe('PynTopBar', () => {
  it('offers the theme choices, marks the current one and emits changes', async () => {
    const w = mount(PynTopBar, { props: { user: 'alice', repos: [], theme: 'light' } })
    await w.find('[aria-label="Account menu"]').trigger('click')
    const radios = w.findAll('[role=menuitemradio]')
    expect(radios.map((r) => r.text().replace('✓', ''))).toEqual([
      'System theme',
      'Light theme',
      'Dark theme',
    ])
    expect(radios.map((r) => r.attributes('aria-checked'))).toEqual(['false', 'true', 'false'])
    await radios[2].trigger('click')
    expect(w.emitted('theme')?.[0]).toEqual(['dark'])
  })

  it('links to account settings and emits sign out', async () => {
    const w = mount(PynTopBar, { props: { user: 'alice', repos: [], theme: 'system' } })
    await w.find('[aria-label="Account menu"]').trigger('click')
    expect(w.find('a[href="/_/settings"]').exists()).toBe(true)
    await w
      .findAll('button')
      .find((b) => b.text() === 'Sign out')!
      .trigger('click')
    expect(w.emitted('signOut')).toHaveLength(1)
  })

  it('links Accounts in the account menu for administrators only', async () => {
    const open = async (admin?: boolean) => {
      const w = mount(PynTopBar, { props: { user: 'root', repos: [], theme: 'system', admin } })
      await w.find('[aria-label="Account menu"]').trigger('click')
      return w
    }
    expect((await open(true)).find('[href="/_/admin/accounts"]').exists()).toBe(true)
    expect((await open()).find('[href="/_/admin/accounts"]').exists()).toBe(false)
  })

  it('offers creating a repository and an organization', async () => {
    const bar = mount(PynTopBar, { props: { user: 'alice', repos: [], theme: 'system' } })
    await bar.find('[aria-label="Create"]').trigger('click')
    expect(bar.find('a[href="/_/new"]').exists()).toBe(true)
    expect(bar.find('a[href="/_/new-org"]').exists()).toBe(true)
  })
})

describe('PynSideNav', () => {
  const repos = [
    { owner: 'alice', name: 'castle-quest' },
    { owner: 'alice', name: 'core-engine' },
  ]

  it('lists the main items and the repositories, marking the current ones', () => {
    const w = mount(PynSideNav, {
      props: {
        account: 'alice',
        items: mainNav,
        current: 'home',
        repos,
        currentRepo: 'alice/core-engine',
      },
    })
    expect(w.findAll('a').map((a) => a.attributes('href'))).toContain('/alice/castle-quest')
    expect(w.text()).toContain('Home')
    expect(w.findAll('[aria-current]').map((a) => a.text())).toEqual(['Home', 'alice/core-engine'])
  })

  it('says when there are no repositories', () => {
    const w = mount(PynSideNav, { props: { account: 'alice', items: mainNav, current: '', repos: [] } })
    expect(w.text()).toContain('None yet')
  })

  it('lists organizations', () => {
    const w = mount(PynSideNav, {
      props: {
        account: 'alice',
        items: mainNav,
        current: '',
        repos,
        orgs: [{ name: 'studio' }],
        currentOrg: 'studio',
      },
    })
    expect(w.find('a[href="/studio"]').attributes('aria-current')).toBe('true')
  })
})

describe('repository and organization headers', () => {
  it('shows name, visibility and the permitted tabs', () => {
    const w = mount(PynRepoHeader, {
      props: {
        owner: 'alice',
        name: 'game',
        visibility: 'private',
        leaseHours: 24,
        tabs: repoTabs(['read'], false),
      },
    })
    expect(w.find('h1').text()).toContain('alice/game')
    expect(w.find('[data-visibility]').text()).toBe('private')
    expect(w.findAll('nav a').map((a) => a.text())).toEqual(['Code', 'Locks', 'History'])
  })

  it('omits the tab row without access', () => {
    const w = mount(PynRepoHeader, {
      props: { owner: 'a', name: 'b', visibility: 'public', leaseHours: 1 },
    })
    expect(w.find('nav').exists()).toBe(false)
  })

  it('shows the organization chip on a repository header', () => {
    const base = { owner: 'studio', name: 'game', visibility: 'private' as const, leaseHours: 8 }
    const org = mount(PynRepoHeader, { props: { ...base, orgOwned: true } })
    expect(org.find('[data-org]').exists()).toBe(true)
    expect(org.find('a[href="/studio"]').exists()).toBe(true)
    expect(mount(PynRepoHeader, { props: base }).find('[data-org]').exists()).toBe(false)
  })

  it('marks the current repository tab', () => {
    const w = mount(PynRepoNav, {
      props: { owner: 'alice', name: 'game', tabs: repoTabs(['read'], false), current: 'locks' },
    })
    expect(w.find('[aria-current=page]').text()).toBe('Locks')
    expect(w.findAll('a')[0].attributes('href')).toBe('/alice/game')
  })

  it('marks the organization and links only the tabs the role allows', () => {
    const w = mount(PynOrgHeader, {
      props: { name: 'studio', createdAt: '2026-09-02T08:00:00Z', role: 'member' },
    })
    expect(w.find('[data-kind]').text()).toBe('organization')
    expect(w.findAll('nav a').map((a) => a.attributes('href'))).toEqual([
      '/studio',
      '/studio/-/members',
      '/studio/-/teams',
    ])
  })
})

describe('PynBranchBar', () => {
  it('shows the file count and when there are no revisions', () => {
    const bar = mount(PynBranchBar, { props: { branch: 'main', files: 1, updatedAt: null } })
    expect(bar.text()).toContain('1 file')
    expect(bar.text()).toContain('No revisions yet')
  })

  it('shows the relative time of the last revision', () => {
    const bar = mount(PynBranchBar, {
      props: { branch: 'main', files: 2, updatedAt: '2026-10-08T10:00:00Z', now },
    })
    expect(bar.text()).toContain('2 files')
    expect(bar.text()).toContain('2 hours ago')
  })

  it('formats relative times', () => {
    const at = (ms: number) => new Date(now.getTime() - ms).toISOString()
    expect(formatAgo(at(5_000), now)).toBe('just now')
    expect(formatAgo(at(60_000), now)).toBe('1 minute ago')
    expect(formatAgo(at(2 * 3_600_000), now)).toBe('2 hours ago')
    expect(formatAgo(at(3 * 86_400_000), now)).toBe('3 days ago')
    expect(formatAgo(at(90 * 86_400_000), now)).toBe('Jul 10 2026')
  })
})

describe('PynShell', () => {
  it('toggles the sidebar and closes it after following a link', async () => {
    const w = mount(PynShell, { slots: { side: '<a href="#x">x</a>', default: 'body' } })
    const side = w.find('aside')
    expect(side.classes().length).toBe(1)
    await w.find('[aria-label="Toggle navigation"]').trigger('click')
    expect(side.classes().length).toBe(2)
    await side.find('a').trigger('click')
    expect(side.classes().length).toBe(1)
  })
})

describe('blob state', () => {
  it('finds what a path names in a folder listing, or nothing', () => {
    expect(entryAt(rootEntries, 'Content')?.kind).toBe('folder')
    expect(entryAt(rootEntries, 'Content/')?.kind).toBe('folder')
    expect(entryAt(rootEntries, 'Nope')).toBeNull()
  })

  it('builds file, content and history links', () => {
    expect(blobPath(r, 'My Dir/a.ts')).toBe('/acme/castle-quest/blob/My%20Dir/a.ts')
    expect(contentUrl(r, 'a b.ts', 3)).toBe(
      '/v1/repos/acme/castle-quest/content?path=a+b.ts&revision=3',
    )
    expect(historyLink(r, 'a/b.ts')).toBe('/acme/castle-quest/history?path=a%2Fb.ts')
  })

  it('links every folder in the crumbs but not the file', () => {
    expect(fileCrumbs(r, 'a/b.ts')).toEqual([
      { label: 'castle-quest', href: '/acme/castle-quest' },
      { label: 'a', href: '/acme/castle-quest/tree/a' },
      { label: 'b.ts', href: undefined },
    ])
  })

  it('finds the README, preferring markdown', () => {
    const file = (name: string) => ({ ...fileEntry, name, path: name })
    expect(readmeEntry([file('README.txt'), file('readme.md')])?.name).toBe('readme.md')
    expect(readmeEntry([file('README')])?.name).toBe('README')
    expect(
      readmeEntry([file('Readme.md.bak'), { ...file('README.md'), kind: 'folder' }]),
    ).toBeNull()
  })

  it('classifies files by name', () => {
    expect(fileKind('a/NOTES.MD')).toBe('markdown')
    expect(fileKind('logo.png')).toBe('image')
    expect(fileKind('Player.cpp')).toBe('text')
    expect(fileKind('Level.umap')).toBe('unknown')
  })

  it('shows text, and a download for binary, empty and oversized content', () => {
    const body = (path: string, b: Uint8Array, truncated = false) =>
      fileBody(path, { bytes: b, truncated }).kind
    expect(body('a.ts', bytes('x'))).toBe('code')
    expect(body('a.md', bytes('# x'))).toBe('markdown')
    expect(body('a.bin', new Uint8Array([1, 0, 2]))).toBe('binary')
    expect(body('a.bin', new Uint8Array([0xff, 0xfe]))).toBe('binary')
    expect(body('a.txt', new Uint8Array())).toBe('empty')
    expect(body('a.txt', bytes('x'), true)).toBe('large')
  })
})

describe('code state', () => {
  it('picks a language from the extension or file name', () => {
    expect(languageFor('Source/a.rs')).toBe('rust')
    expect(languageFor('Makefile')).toBe('makefile')
    expect(languageFor('a.umap')).toBeNull()
  })

  it('splits highlighted output per line, closing spans that cross lines', () => {
    const lines = highlightLines('/* a\n b */\nlet x = 1\n', 'javascript')
    expect(lines).toHaveLength(3)
    for (const l of lines) {
      expect((l.match(/<span/g) ?? []).length).toBe((l.match(/<\/span>/g) ?? []).length)
    }
    expect(lines[1]).toContain('hljs-comment')
  })

  it('escapes plain text', () => {
    expect(highlightLines('<b>&', null)).toEqual(['&lt;b&gt;&amp;'])
  })
})

describe('markdown state', () => {
  const render = (src: string, dir = '') => renderMarkdown(src, r, dir)

  it('strips scripts, handlers, styles and script URLs', () => {
    const html = render(
      '<script>x()</script><img src="a.png" onerror="x()"><a href="javascript:x()">j</a><p style="color:red">p</p>',
    )
    expect(html).not.toMatch(/<script|onerror|javascript:|style=/i)
  })

  it('resolves relative links and images against the document folder', () => {
    const html = render('[n](Notes.md) [up](../a.md) [d](docs/) ![i](img/a.png)', 'x/y')
    expect(html).toContain('href="/acme/castle-quest/blob/x/y/Notes.md"')
    expect(html).toContain('href="/acme/castle-quest/blob/x/a.md"')
    expect(html).toContain('href="/acme/castle-quest/tree/x/y/docs"')
    expect(html).toContain('src="/v1/repos/acme/castle-quest/content?path=x%2Fy%2Fimg%2Fa.png"')
  })

  it('replaces external images with alt text and a safe link', () => {
    const html = render('![logo](https://example.com/a.png) ![cdn](//cdn.example.com/b.png)')
    expect(html).not.toContain('<img')
    expect(html).toContain('href="https://example.com/a.png"')
    expect(html).toContain('>logo</a>')
    expect(html).toContain('href="https://cdn.example.com/b.png"')
    expect(html.match(/rel="noopener noreferrer"/g)).toHaveLength(2)
  })

  it('replaces data: images with plain alt text', () => {
    const html = render('![pixel](data:image/png;base64,AAAA)')
    expect(html).not.toMatch(/<img|<a|data:/)
    expect(html).toContain('pixel')
  })

  it('does not link an external image already inside a link', () => {
    const html = render('[![badge](https://example.com/b.svg)](#top)')
    expect(html).not.toContain('<img')
    expect(html).not.toContain('example.com')
    expect(html).toContain('badge')
  })

  it('drops srcset and picture sources', () => {
    const html = render(
      '<picture><source srcset="https://e.com/x.png"><img src="a.png" srcset="https://e.com/y.png"></picture>',
    )
    expect(html).not.toMatch(/srcset|<source|e\.com/)
    expect(html).toContain('content?path=a.png')
  })

  it('opens external links in a new tab without opener access', () => {
    const html = render('[e](https://example.com) [h](#top)')
    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(html.match(/target="_blank"/g)).toHaveLength(1)
  })

  it('gives headings GitHub-style ids, suffixing duplicates', () => {
    const html = render('# Hello, World!\n\n## Setup\n\n## Setup\n\n## Setup')
    expect(html).toContain('<h1 id="hello-world">')
    expect(html).toContain('<h2 id="setup">')
    expect(html).toContain('id="setup-1"')
    expect(html).toContain('id="setup-2"')
  })

  it('never trusts authored ids or reserved heading ids', () => {
    const html = render('<div id="app" name="x">a</div>\n\n# App\n\n## L12')
    expect(html).not.toMatch(/<div[^>]*(id|name)=/)
    expect(html).toContain('id="app-1"')
    expect(html).toContain('id="l12"')
  })

  it('highlights fenced code and renders tables', () => {
    const html = render('```js\nconst a = 1\n```\n\n| a |\n|---|\n| b |')
    expect(html).toContain('hljs-keyword')
    expect(html).toContain('<table>')
  })

  it('resolves paths', () => {
    expect(resolveRelative('a', '/b/c.md')).toBe('b/c.md')
    expect(resolveRelative('a/b', '../../../c')).toBe('c')
    expect(resolveRelative('a', 'https://x.dev')).toBeNull()
    expect(resolveRelative('a', '#frag')).toBeNull()
  })
})

describe('line state', () => {
  it('parses and formats line hashes', () => {
    expect(parseLineHash('#L12')).toEqual({ start: 12, end: 12 })
    expect(parseLineHash('#L20-L12')).toEqual({ start: 12, end: 20 })
    expect(parseLineHash('#L0')).toBeNull()
    expect(parseLineHash('#intro')).toBeNull()
    expect(lineHash({ start: 3, end: 3 })).toBe('#L3')
    expect(lineHash({ start: 3, end: 7 })).toBe('#L3-L7')
  })

  it('extends a range from its first line on shift-click', () => {
    expect(clickLine(null, 5, true)).toEqual({ start: 5, end: 5 })
    expect(clickLine({ start: 5, end: 5 }, 9, false)).toEqual({ start: 9, end: 9 })
    expect(clickLine({ start: 5, end: 5 }, 9, true)).toEqual({ start: 5, end: 9 })
    expect(clickLine({ start: 5, end: 9 }, 2, true)).toEqual({ start: 2, end: 5 })
  })

})

describe('file components', () => {
  it('numbers each line of code', () => {
    const w = mount(PynCodeView, { props: { text: codeText, language: 'typescript' } })
    const lines = w.findAll('[data-line]')
    expect(lines).toHaveLength(codeText.trimEnd().split('\n').length)
    expect(lines[0].attributes('data-line')).toBe('1')
    expect(w.find('.hljs-keyword').exists()).toBe(true)
  })

  it('anchors line numbers, highlights the range and reports clicks', async () => {
    const w = mount(PynCodeView, {
      props: { text: codeText, language: 'typescript', range: { start: 2, end: 3 } },
    })
    const a = w.find('#L2 a')
    expect(a.attributes('href')).toBe('#L2')
    expect(a.text()).toBe('')
    expect(
      w.findAll('span[id^="L"]').filter((l) => l.classes().some((c) => c.includes('selected'))),
    ).toHaveLength(2)
    await w.find('#L7 a').trigger('click')
    await w.find('#L7 a').trigger('click', { shiftKey: true })
    expect(w.emitted('select')).toEqual([[{ start: 7, end: 7 }], [{ start: 2, end: 7 }]])
  })

  it('renders sanitised markdown', () => {
    const w = mount(PynMarkdown, { props: { source: readmeText, ...r } })
    expect(w.find('h1').text()).toBe('Castle Quest')
    expect(w.find('script').exists()).toBe(false)
    expect(w.find('a[href="/acme/castle-quest/blob/Content/Levels/Notes.md"]').exists()).toBe(true)
  })

  it('links the README to its file and renders it', () => {
    const w = mount(PynReadme, {
      props: { ...r, readme: { name: 'README.md', path: 'README.md', text: '# Hi' } },
    })
    expect(w.find('header a').attributes('href')).toBe('/acme/castle-quest/blob/README.md')
    expect(w.find('h1').text()).toBe('Hi')
  })

  it('shows a plain README as text', () => {
    const w = mount(PynReadme, {
      props: { ...r, readme: { name: 'README', path: 'README', text: '# not markdown' } },
    })
    expect(w.find('h1').exists()).toBe(false)
    expect(w.find('pre').text()).toBe('# not markdown')
  })

  it('shows mode, holder, revision and history in the file bar', () => {
    const w = mount(PynFileBar, { props: { ...r, entry: lockedEntry, me: 'jamie', now } })
    expect(w.find('[data-mode=exclusive]').exists()).toBe(true)
    expect(w.find('[data-state]').text()).toContain('bob')
    expect(w.text()).toContain('r61')
    expect(w.text()).toContain('jamie · 2 hours ago')
    const hrefs = w.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toContain('/acme/castle-quest/history?path=Content%2FLevel01.umap')
    expect(hrefs).toContain('/v1/repos/acme/castle-quest/content?path=Content%2FLevel01.umap')
  })

  it('offers no download before the first revision', () => {
    const entry = { ...lockedEntry, last_change: null }
    const w = mount(PynFileBar, { props: { ...r, entry, now } })
    expect(w.text()).toContain('No revision yet')
    expect(w.text()).not.toContain('Download')
  })

  const view = (props: Record<string, unknown>) =>
    mount(PynFileView, { props: { ...r, path: fileEntry.path, entry: fileEntry, now, ...props } })

  it('renders each kind of body', () => {
    expect(
      view({ body: { kind: 'code', text: 'x', language: null } })
        .find('[data-line]')
        .exists(),
    ).toBe(true)
    expect(
      view({ body: { kind: 'markdown', text: '# T' } })
        .find('h1')
        .text(),
    ).toBe('T')
    expect(
      view({ body: { kind: 'image', src: imageSrc } })
        .find('img')
        .attributes('src'),
    ).toBe(imageSrc)
    expect(view({ body: null }).text()).toContain('Loading')
    expect(view({ body: { kind: 'binary' } }).text()).toContain('binary file')
    expect(view({ body: { kind: 'large' } }).text()).toContain('too large')
    expect(view({ body: { kind: 'empty' } }).text()).toContain('empty')
    expect(view({ body: { kind: 'none' } }).text()).toContain('no revision yet')
  })

  it('explains a missing file and links to its folder', () => {
    const w = view({ entry: null, missing: true, path: 'Source/gone.ts' })
    expect(w.find('[role=alert]').text()).toContain('/Source/gone.ts')
    expect(w.find('[role=alert] a').attributes('href')).toBe('/acme/castle-quest/tree/Source')
    expect(w.find('[aria-current=page]').text()).toBe('gone.ts')
  })
})

describe('browse integration', () => {
  it('links files to the viewer and folders to the tree', () => {
    const w = mount(PynTree, { props: { entries: rootEntries, ...r, now } })
    const hrefs = w.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toContain('/acme/castle-quest/tree/Content')
    expect(hrefs).toContain('/acme/castle-quest/blob/README.md')
    expect(hrefs).toHaveLength(rootEntries.length)
  })

  it('shows the README under the listing, but not for a missing folder', () => {
    const readme = { name: 'README.md', path: 'README.md', text: '# Castle' }
    const props = { repo, path: '', listing: rootListing, summary, readme, now }
    const w = mount(PynRepoLanding, { props })
    expect(w.find('section[aria-label=README] h1').text()).toBe('Castle')
    const missing = mount(PynRepoLanding, { props: { ...props, listing: null, missing: true } })
    expect(missing.find('section[aria-label=README]').exists()).toBe(false)
  })
})

describe('tree state', () => {
  it('builds folder routes and encodes segments', () => {
    expect(treePath(r, '')).toBe('/acme/castle-quest')
    expect(treePath(r, 'Content/My Levels/')).toBe('/acme/castle-quest/tree/Content/My%20Levels')
  })

  it('links every crumb but the current one', () => {
    expect(breadcrumbs(r, '')).toEqual([{ label: 'castle-quest', href: undefined }])
    expect(breadcrumbs(r, 'a/b')).toEqual([
      { label: 'castle-quest', href: '/acme/castle-quest' },
      { label: 'a', href: '/acme/castle-quest/tree/a' },
      { label: 'b', href: undefined },
    ])
  })

  it('reads the folder from a route param', () => {
    expect(folderParam(undefined)).toBe('')
    expect(folderParam('a/b/')).toBe('a/b')
    expect(folderParam(['a', 'b'])).toBe('a/b')
  })
})

describe('PynTree', () => {
  const tree = () => mount(PynTree, { props: { entries: rootEntries, ...r, me: 'jamie', now } })

  it('links folders to their route and files to the viewer', () => {
    const w = tree()
    const hrefs = w.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toEqual([
      '/acme/castle-quest/tree/Content',
      '/acme/castle-quest/tree/Config',
      '/acme/castle-quest/tree/Source',
      '/acme/castle-quest/blob/Game.uproject',
      '/acme/castle-quest/blob/README.md',
      '/acme/castle-quest/blob/Level02.umap',
    ])
  })

  it('shows the revision, author and age of the last change', () => {
    const row = tree().findAll('tbody tr')[0]
    expect(row.text()).toContain('Level design changes')
    expect(row.text()).toContain('r61')
    expect(row.text()).toContain('jamie · 2 hours ago')
    expect(row.find('[data-mode=mixed]').exists()).toBe(true)
  })

  it('shows the holder only on locked files', () => {
    const rows = tree().findAll('tbody tr')
    const locked = rows[rows.length - 1]
    expect(locked.find('[data-state]').text()).toContain('bob')
    expect(locked.text()).toContain('No revision yet')
    expect(rows[0].find('[data-state]').exists()).toBe(false)
  })

  it('says so when a folder is empty', () => {
    const w = mount(PynTree, { props: { entries: [], ...r } })
    expect(w.text()).toContain('empty')
  })
})

describe('PynRepoLanding', () => {
  const landing = (props: Record<string, unknown> = {}) =>
    mount(PynRepoLanding, {
      props: { repo, path: '', listing: rootListing, summary, me: 'jamie', now, ...props },
    })

  it('composes the table, rail and checkout explainer', () => {
    const w = landing()
    expect(w.findAll('tbody tr')).toHaveLength(rootEntries.length)
    expect(w.text()).toContain('Repository details')
    expect(w.text()).toContain('Locked files')
    expect(w.text()).toContain('Recent activity')
    expect(w.text()).toContain('Exclusive File Checkout')
    expect(w.text()).toContain('main')
  })

  it('does not show what the server cannot provide', () => {
    const text = landing().text()
    for (const word of ['Fork', 'Watch', 'tags', 'branches']) expect(text).not.toContain(word)
  })

  it('shows the breadcrumb of the current folder', () => {
    const w = landing({ path: 'Content/Levels', listing: folderListing })
    expect(w.find('[aria-current=page]').text()).toBe('Levels')
  })

  it('explains a missing folder and links back to the root', () => {
    const w = landing({ path: 'Gone', listing: null, missing: true })
    expect(w.find('[role=alert]').text()).toContain('/Gone')
    expect(w.find('[role=alert] a').attributes('href')).toBe('/acme/castle-quest')
    expect(w.find('table').exists()).toBe(false)
  })
})

describe('landing parts', () => {
  it('lists locks with their holders', () => {
    const w = mount(PynLockedFiles, { props: { locks: summary.locks, ...r, me: 'jamie', now } })
    expect(w.findAll('li')).toHaveLength(2)
    expect(w.text()).toContain('Level02.umap')
    expect(w.text()).toContain('bob')
    expect(w.text()).toContain('You')
  })

  it('says when nothing is locked', () => {
    expect(mount(PynLockedFiles, { props: { locks: [], ...r } }).text()).toContain('No files')
  })

  it('words each activity by its action', () => {
    const w = mount(PynActivity, { props: { entries: summary.activity, now } })
    expect(w.text()).toContain('jamie locked')
    expect(w.text()).toContain('alex checked in')
    expect(w.text()).toContain('taylor released')
  })

  it('shows counts in the details', () => {
    const w = mount(PynRepoDetails, {
      props: {
        owner: 'acme',
        visibility: 'private',
        leaseHours: 24,
        createdAt: repo.created_at,
        updatedAt: summary.updated_at,
        files: 5,
        exclusiveFiles: 2,
        sharedFiles: 3,
        now,
      },
    })
    expect(w.text()).toContain('24 hours')
    expect(w.text()).toContain('Apr 12 2026')
    expect(w.text()).toContain('2 hours ago')
  })

  it('shows the checkout card', () => {
    expect(mount(PynCheckoutCard).text()).toContain('one person at a time')
  })

  it('renders the breadcrumb as a labelled path', () => {
    const w = mount(PynBreadcrumb, { props: { crumbs: breadcrumbs(r, 'a') } })
    expect(w.attributes('aria-label')).toBe('Path')
    expect(w.findAll('li')).toHaveLength(2)
  })
})

describe('PynHistory', () => {
  const rev = (id: number, path = 'a.ts', restored_from?: number) => ({
    id,
    path,
    author: 'alice',
    message: `m${id}`,
    created_at: '2026-10-08T11:00:00Z',
    restored_from,
  })

  it('shows revision, path, author and message', () => {
    const w = mount(PynHistory, { props: { revisions: [rev(3, 'x/y.ts', 1)] } })
    expect(w.text()).toContain('r3')
    expect(w.text()).toContain('x/y.ts')
    expect(w.text()).toContain('alice')
    expect(w.text()).toContain('m3')
    expect(w.text()).toContain('restored from r1')
  })

  it('has loading and empty states and an inline error', () => {
    expect(mount(PynHistory, { props: { revisions: [], loading: true } }).text()).toContain(
      'Loading history',
    )
    expect(mount(PynHistory, { props: { revisions: [] } }).text()).toContain('No revisions yet')
    const w = mount(PynHistory, { props: { revisions: [], error: 'bad glob', filter: '[' } })
    expect(w.find('[role=alert]').text()).toBe('bad glob')
  })

  it('debounces the filter and emits load-more', async () => {
    vi.useFakeTimers()
    const w = mount(PynHistory, { props: { revisions: [rev(1)], hasMore: true } })
    await w.find('input').setValue(' *.ts ')
    await w.find('input').setValue(' *.uasset ')
    expect(w.emitted('filter')).toBeUndefined()
    vi.advanceTimersByTime(400)
    expect(w.emitted('filter')).toEqual([['*.uasset']])
    vi.useRealTimers()
    await w.find('button').trigger('click')
    expect(w.emitted('more')).toHaveLength(1)
  })

  it('shows a per-file scope instead of the filter box', async () => {
    const w = mount(PynHistory, { props: { revisions: [rev(1)], path: 'a.ts' } })
    expect(w.find('input').exists()).toBe(false)
    await w.find('button').trigger('click')
    expect(w.emitted('clearPath')).toHaveLength(1)
  })
})

describe('files state', () => {
  it('splits a path into folder and file name', () => {
    expect(splitPath('Content/World/Main.umap')).toEqual({
      dir: 'Content/World/',
      name: 'Main.umap',
    })
    expect(splitPath('README.md')).toEqual({ dir: '', name: 'README.md' })
  })

  it('groups rows by top-level folder, keeping order', () => {
    const rows = [
      { path: 'Content/a.umap', mode: 'exclusive' as const },
      { path: 'README.md', mode: 'shared' as const, },
      { path: 'Content/b.umap', mode: 'exclusive' as const, },
    ]
    const groups = groupByTopLevel(rows)
    expect(groups.map((g) => [g.name, g.rows.length])).toEqual([
      ['Content', 2],
      ['(root)', 1],
    ])
  })
})

describe('PynFileList', () => {
  it('shows a lock badge only for exclusive files', () => {
    const w = mount(PynFileList, {
      props: {
        now,
        rows: [
          {
            path: 'Content/a.umap',
            mode: 'exclusive',
           
            revision: 3,
            lock: lock('bob', 60),
          },
          { path: 'Source/a.cpp', mode: 'shared', revision: 9 },
        ],
      },
    })
    expect(w.findAll('li')).toHaveLength(2)
    expect(w.findAll('[data-state]')).toHaveLength(1)
    expect(w.text()).toContain('r9')
  })

  it('shows the folder and file name separately and tolerates null from the API', () => {
    const w = mount(PynFileList, {
      props: {
        now,
        rows: [
          {
            path: 'Content/World/Main.umap',
            mode: 'exclusive',
           
            revision: null,
            lock: null,
          },
        ],
      },
    })
    expect(w.text()).toContain('Content/World/')
    expect(w.text()).toContain('Main.umap')
    expect(w.text()).not.toContain('rnull')
    expect(w.text()).toContain('Available')
  })

  it('renders an empty state', () => {
    expect(mount(PynFileList, { props: { rows: [] } }).text()).toContain('No files')
  })
})
