// Component render tests for every exported component. Run with `make test`.
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import {
  PynAccountNotice,
  PynAccountSettings,
  PynAccounts,
  PynActivity,
  PynAddPerson,
  PynAudit,
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
  PynIdentities,
  PynInvites,
  PynKeys,
  PynLockBadge,
  PynLockIcon,
  PynLockedFiles,
  PynLocks,
  PynMarkdown,
  PynMembers,
  PynMenu,
  PynModeChip,
  PynMyLocks,
  PynOrgDelete,
  PynOrgForm,
  PynOrgHeader,
  PynOrgList,
  PynOrgMembers,
  PynOrgRepoPolicy,
  PynPageNotFound,
  PynReadme,
  PynRepoDelete,
  PynRepoDetails,
  PynRepoForm,
  PynRepoHeader,
  PynRepoLanding,
  PynRepoList,
  PynRepoNav,
  PynRepoNotFound,
  PynResendForm,
  PynRoles,
  PynSearch,
  PynSetup,
  PynShell,
  PynSignIn,
  PynSideNav,
  PynTeamDelete,
  PynTeamDetail,
  PynTeamForm,
  PynTeamGrant,
  PynTeamList,
  PynTokens,
  PynTopBar,
  PynTree,
  PynVerifyEmail,
  accountActions,
  accountNav,
  accountNavItems,
  applyUpdate,
  PynViewAction,
  PynViewError,
  PynViewGroup,
  PynViewHeader,
  PynViewStack,
  PynViewSummary,
  blobPath,
  breadcrumbs,
  canRemove,
  clickLine,
  contentUrl,
  entryAt,
  expiryFromDate,
  externalSignInUrl,
  fileBody,
  fileCrumbs,
  fileKind,
  folderParam,
  formatAgo,
  groupByTopLevel,
  hasRule,
  highlightLines,
  historyLink,
  isEditable,
  isOrgOwner,
  languageFor,
  lineHash,
  mainNav,
  matchRepos,
  myLockKey,
  parseLineHash,
  orgTabs,
  ownerChoices,
  parseLockLimit,
  parseRepos,
  personGrantees,
  readmeEntry,
  renderMarkdown,
  repoTabs,
  resolveRelative,
  ruleSubjects,
  signInErrorMessage,
  sortOrgs,
  sourceNote,
  splitPath,
  splitRepo,
  stepComplete,
  teamCandidates,
  teamGrantees,
  teamPath,
  treePath,
  ungrantedTeams,
} from '../src'
import type { SetupForm } from '../src'
import { accounts } from '../src/stories/admin-data'
import { codeText, fileEntry, imageSrc, lockedEntry, readmeText } from '../src/stories/file-data'
import { orgMembers, orgs, repoPolicy, repoTeams, teams } from '../src/stories/org-data'
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
    expect(
      mount(PynIcon, { props: { name: 'repo' } })
        .find('path')
        .attributes('d'),
    ).toBeTruthy()
    expect(
      mount(PynIcon, { props: { name: 'nope' } })
        .find('path')
        .attributes('d'),
    ).toBe('')
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
    const w = mount(PynSideNav, {
      props: { account: 'alice', items: mainNav, current: '', repos: [] },
    })
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
      { path: 'README.md', mode: 'shared' as const },
      { path: 'Content/b.umap', mode: 'exclusive' as const },
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

describe('PynRepoList', () => {
  const listed = (owner: string, name: string, role?: string) => ({
    owner,
    name,
    visibility: 'private' as const,
    lease_hours: 8,
    created_at: '2026-10-01T09:00:00Z',
    role,
  })

  it('lists owner, name, visibility and role with a link to the repository', () => {
    const w = mount(PynRepoList, {
      props: { repos: [listed('alice', 'game', 'admin')] },
    })
    expect(w.text()).toContain('alice/game')
    expect(w.text()).toContain('private')
    expect(w.find('[data-role]').text()).toBe('admin')
    expect(w.find('a').attributes('href')).toBe('/alice/game')
  })

  it('offers to create one when empty', () => {
    expect(
      mount(PynRepoList, { props: { repos: [] } })
        .find('a')
        .attributes('href'),
    ).toBe('/_/new')
    expect(mount(PynRepoList, { props: { repos: [], empty: 'None here.' } }).text()).toBe(
      'None here.',
    )
  })
})

describe('PynRepoForm', () => {
  it('emits the settings to create', async () => {
    const w = mount(PynRepoForm, { props: { owner: 'alice' } })
    await w.find('input').setValue(' game ')
    await w.find('select').setValue('public')
    await w.find('input[type=number]').setValue('24')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0]).toEqual([
      { name: 'game', visibility: 'public', lease_hours: 24 },
    ])
  })

  it('starts from the existing settings when editing', () => {
    const w = mount(PynRepoForm, {
      props: {
        owner: 'alice',
        repo: { name: 'game', visibility: 'public', lease_hours: 12 },
      },
    })
    expect((w.find('input').element as HTMLInputElement).value).toBe('game')
    expect(w.find('button').text()).toBe('Save changes')
  })

  it('hides the picker without a choice and emits the picked owner', async () => {
    const solo = mount(PynRepoForm, {
      props: { owner: 'alice', owners: ['alice'] },
    })
    expect(solo.findAll('select')).toHaveLength(1)
    const w = mount(PynRepoForm, {
      props: { owner: 'alice', owners: ['alice', 'studio'] },
    })
    await w.findAll('select')[0].setValue('studio')
    expect(w.findAll('select')).toHaveLength(2)
    expect(w.emitted('update:owner')?.[0]).toEqual(['studio'])
  })
})

describe('PynRepoForm lock limit', () => {
  const base = { name: 'game', visibility: 'public' as const, lease_hours: 12 }
  const mountEdit = (extra: object, effective = 10) =>
    mount(PynRepoForm, {
      props: {
        owner: 'alice',
        repo: { ...base, ...extra },
        effectiveMaxLocks: effective,
      },
    })
  const limit = (w: ReturnType<typeof mount>) => w.findAll('input[type=number]')[1]

  it('emits the typed limit on create and nothing when empty', async () => {
    const w = mount(PynRepoForm, { props: { owner: 'alice' } })
    await w.find('input').setValue('game')
    await limit(w).setValue('5')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0][0]).toMatchObject({
      max_locks_per_user: 5,
    })
    await limit(w).setValue('')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[1][0]).not.toHaveProperty('max_locks_per_user')
  })

  it('shows the stored setting and clears it with null when emptied', async () => {
    const w = mountEdit({ max_locks_per_user_setting: 5 }, 5)
    expect((limit(w).element as HTMLInputElement).value).toBe('5')
    await limit(w).setValue('')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0][0]).toMatchObject({
      max_locks_per_user: null,
    })
    expect(limit(w).attributes('placeholder')).toBe('Server default (5)')
  })

  it('is read-only with a note and sends no limit while the policy file sets it', async () => {
    const w = mountEdit({ max_locks_per_user_setting: 5, max_locks_set_by_policy: true }, 3)
    expect((limit(w).element as HTMLInputElement).value).toBe('3')
    expect(limit(w).attributes('readonly')).toBeDefined()
    expect(w.text()).toContain('.pyn/pyn.toml')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0][0]).not.toHaveProperty('max_locks_per_user')
  })

  it('parses lock limits', () => {
    expect(parseLockLimit('7')).toBe(7)
    expect(parseLockLimit('')).toBeNull()
    expect(parseLockLimit(null)).toBeNull()
    expect(parseLockLimit('1.5')).toBeNaN()
  })
})

describe('PynRepoDelete', () => {
  it('stays disabled until the full name is typed', async () => {
    const w = mount(PynRepoDelete, { props: { slug: 'alice/game' } })
    expect(w.find('button').attributes('disabled')).toBeDefined()
    await w.find('input').setValue('alice/game')
    expect(w.find('button').attributes('disabled')).toBeUndefined()
    await w.find('form').trigger('submit')
    expect(w.emitted('remove')).toHaveLength(1)
  })
})

describe('PynLocks', () => {
  const locks = [
    {
      path: 'a.umap',
      owner: 'bob',
      acquired_at: '',
      expires_at: '2026-10-08T15:00:00Z',
    },
  ]

  it('hides force unlock without the permission', () => {
    const w = mount(PynLocks, { props: { locks, now } })
    expect(w.text()).toContain('bob')
    expect(w.text()).toContain('3h 0m')
    expect(w.text()).not.toContain('Force unlock')
  })

  it('asks for a reason before emitting', async () => {
    const w = mount(PynLocks, { props: { locks, now, canForce: true } })
    await w.find('button').trigger('click')
    await w.find('input').setValue('  left the studio ')
    await w.find('form').trigger('submit')
    expect(w.emitted('forceUnlock')?.[0]).toEqual([{ path: 'a.umap', reason: 'left the studio' }])
  })

  it('says when nothing is held', () => {
    expect(mount(PynLocks, { props: { locks: [], now } }).text()).toContain('No locks are held')
  })
})

describe('PynAudit', () => {
  const entries = [
    {
      id: 1,
      at: '2026-10-08T11:00:00Z',
      actor: 'alice',
      hash: 'a'.repeat(64),
      action: 'repo_created',
      detail: 'alice/game',
    },
  ]

  it('shows the repository audit actions and emits the filter and load-more', async () => {
    const w = mount(PynAudit, {
      props: {
        entries,
        filter: { path: '', actor: '', action: '' },
        hasMore: true,
      },
    })
    expect(w.text()).toContain('repo_created')
    expect(w.findAll('option').map((o) => o.text())).toEqual(
      expect.arrayContaining(['repo_created', 'repo_updated', 'repo_deleted']),
    )
    await w.find('select').setValue('repo_updated')
    await w.find('form').trigger('submit')
    expect(w.emitted('filter')?.[0]).toEqual([{ path: '', actor: '', action: 'repo_updated' }])
    await w
      .findAll('button')
      .find((b) => b.text().startsWith('Load older'))!
      .trigger('click')
    expect(w.emitted('more')).toHaveLength(1)
  })

  it('hides the filter form when plain', () => {
    const w = mount(PynAudit, { props: { entries, plain: true } })
    expect(w.find('form').exists()).toBe(false)
    expect(w.text()).toContain('Oct 08 2026')
  })
})

describe('PynMembers', () => {
  const grantees = [
    { name: 'bob', role: 'writer', source: 'direct' as const },
    { name: 'carol', role: 'admin', source: 'org_owner' as const },
    { name: 'dave', role: 'reader', source: 'team' as const },
  ]
  const roles = ['reader', 'writer']

  it('emits a role change for a direct grant only and explains the others', async () => {
    const w = mount(PynMembers, { props: { grantees, roles } })
    expect(w.findAll('select')).toHaveLength(1)
    await w.find('select').setValue('reader')
    expect(w.emitted('setRole')?.[0]).toEqual([{ name: 'bob', role: 'reader' }])
    expect(w.findAll('[data-role]').map((e) => e.text())).toEqual(['admin', 'reader'])
    const notes = w.findAll('[data-source]').map((e) => e.text())
    expect(notes[0]).toContain('owning the organization')
    expect(notes[1]).toContain('team')
  })

  it('revokes team grants and links the team', async () => {
    const w = mount(PynMembers, {
      props: {
        grantees: teamGrantees('studio', repoTeams),
        roles,
        kind: 'team',
        revocable: true,
      },
    })
    expect(w.find('a').attributes('href')).toBe('/studio/-/teams/artists')
    await w.find('button').trigger('click')
    expect(w.emitted('revoke')?.[0]).toEqual(['artists'])
    expect(
      mount(PynMembers, {
        props: { grantees: [], roles, kind: 'team' },
      }).text(),
    ).toBe('No teams.')
  })
})

describe('team state', () => {
  it('derives rows and decides what can be edited', () => {
    expect(personGrantees([{ user: 'bob', role: 'writer', source: 'team' }])[0]).toEqual({
      name: 'bob',
      role: 'writer',
      source: 'team',
    })
    expect(isEditable({ name: 'a', role: 'r' })).toBe(true)
    expect(isEditable({ name: 'a', role: 'r', source: 'direct' })).toBe(true)
    expect(isEditable({ name: 'a', role: 'r', source: 'team' })).toBe(false)
    expect(sourceNote('direct')).toBe('')
    expect(sourceNote(undefined)).toBe('')
  })

  it('lists candidates and ungranted teams and splits a repository address', () => {
    expect(teamCandidates(['carol', 'alice', 'bob'], ['bob'])).toEqual(['alice', 'carol'])
    expect(ungrantedTeams([{ slug: 'artists' }, { slug: 'devs' }], repoTeams)).toEqual(['devs'])
    expect(splitRepo('studio/core/engine')).toEqual({
      owner: 'studio',
      name: 'core/engine',
    })
    expect(teamPath('studio')).toBe('/studio/-/teams')
  })
})

describe('PynAddPerson', () => {
  it('emits a new person and clears the form', async () => {
    const w = mount(PynAddPerson, { props: { roles: ['reader', 'writer'] } })
    const inputs = w.findAll('input')
    await inputs[0].setValue('wendy')
    await inputs[1].setValue('a long password')
    await w.find('form').trigger('submit')
    expect(w.emitted('addUser')?.[0]).toEqual([
      { username: 'wendy', password: 'a long password', role: 'reader' },
    ])
    expect((inputs[0].element as HTMLInputElement).value).toBe('')
  })
})

describe('PynRoles', () => {
  const grants = [{ role: 'reader', permissions: ['read'] }]

  it('emits the edited permissions', async () => {
    const w = mount(PynRoles, { props: { grants, canEdit: true } })
    await w.find('input[value=view_audit]').setValue(true)
    await w.find('form').trigger('submit')
    expect(w.emitted('save')?.[0]).toEqual([
      { role: 'reader', permissions: ['read', 'view_audit'] },
    ])
  })

  it('is read only without manage_roles', () => {
    const w = mount(PynRoles, { props: { grants } })
    expect(w.find('input').attributes('disabled')).toBeDefined()
    expect(w.find('button').exists()).toBe(false)
  })
})

describe('PynInvites', () => {
  const invites = [
    {
      id: 'i1',
      role: 'writer',
      created_by: 'alice',
      created_at: '',
      expires_at: '2026-10-11T09:00:00Z',
    },
    {
      id: 'i2',
      role: 'reader',
      created_by: 'alice',
      created_at: '',
      expires_at: '',
      used_by: 'wendy',
    },
  ]

  it('shows the one-time code, revokes only open invitations and creates', async () => {
    const w = mount(PynInvites, {
      props: { invites, roles: ['reader', 'writer'], code: 'pyni_x' },
    })
    expect(w.find('[role=status]').text()).toContain('pyni_x')
    expect(w.text()).toContain('used by wendy')
    const revoke = w.findAll('button').filter((b) => b.text() === 'Revoke')
    expect(revoke).toHaveLength(1)
    await revoke[0].trigger('click')
    expect(w.emitted('revoke')?.[0]).toEqual(['i1'])
    await w.find('input[type=number]').setValue('24')
    await w.find('form').trigger('submit')
    expect(w.emitted('create')?.[0]).toEqual([{ role: 'reader', hours: 24 }])
  })
})

describe('PynMyLocks', () => {
  const mine = [
    {
      owner: 'alice',
      name: 'game',
      path: 'a.umap',
      acquired_at: '',
      expires_at: '2026-10-08T15:00:00Z',
    },
    {
      owner: 'bob',
      name: 'tools',
      path: 'b.psd',
      acquired_at: '',
      expires_at: '2026-10-08T12:20:00Z',
    },
  ]

  it('shows repository, path, time left and the full expiry on hover', () => {
    const w = mount(PynMyLocks, { props: { locks: mine, now } })
    expect(w.text()).toContain('alice/game')
    expect(w.text()).toContain('a.umap')
    expect(w.text()).toContain('3h 0m')
    expect(w.find('[title^="Expires"]').attributes('title')).toContain('Oct 08 2026')
    expect(w.find('a').attributes('href')).toBe('/alice/game')
  })

  it('emits release for one lock', async () => {
    const w = mount(PynMyLocks, { props: { locks: mine, now } })
    await w.findAll('li button')[1].trigger('click')
    expect(w.emitted('release')?.[0]).toEqual([mine[1]])
  })

  it('asks before releasing all and can be cancelled', async () => {
    const w = mount(PynMyLocks, { props: { locks: mine, now } })
    await w.find('button').trigger('click')
    expect(w.emitted('releaseAll')).toBeUndefined()
    await w
      .findAll('button')
      .find((b) => b.text() === 'Cancel')!
      .trigger('click')
    await w.find('button').trigger('click')
    await w.find('form').trigger('submit')
    expect(w.emitted('releaseAll')).toHaveLength(1)
  })

  it('shows a per-lock failure and the empty state', () => {
    const failures = [{ lock: mine[0], message: 'denied' }]
    const w = mount(PynMyLocks, { props: { locks: mine, failures, now } })
    expect(w.findAll('[role="alert"]').map((a) => a.text())).toEqual(['denied'])
    expect(mount(PynMyLocks, { props: { locks: [] } }).text()).toContain('You hold no locks')
    expect(myLockKey(mine[0])).toBe('alice/game:a.umap')
  })
})

describe('organization helpers', () => {
  it('orders organizations, picks owners and checks roles', () => {
    expect(sortOrgs(orgs).map((o) => o.name)).toEqual(['modding-club', 'studio'])
    expect(ownerChoices('alice', orgs)).toEqual(['alice', 'modding-club', 'studio'])
    expect(isOrgOwner(orgs[0])).toBe(true)
    expect(isOrgOwner(orgs[1])).toBe(false)
    expect(orgTabs('member').map((t) => t.section)).toEqual(['', 'members', 'teams'])
    expect(canRemove(orgMembers[1], 'bob', false)).toBe(true)
    expect(canRemove(orgMembers[1], 'carol', false)).toBe(false)
  })

  it('offers rule subjects and spots an existing rule', () => {
    expect(ruleSubjects('role', 'deny', [], [])).toEqual(['member'])
    expect(ruleSubjects('role', 'allow', [], [])).toEqual(['member', 'owner'])
    expect(ruleSubjects('team', 'allow', ['qa'], ['bob'])).toEqual(['qa'])
    expect(hasRule(repoPolicy.rules, { effect: 'deny', kind: 'user', subject: 'carol' })).toBe(true)
    expect(hasRule(repoPolicy.rules, { effect: 'allow', kind: 'user', subject: 'carol' })).toBe(
      false,
    )
  })
})

describe('PynOrgForm', () => {
  it('emits the trimmed name and shows an error', async () => {
    const w = mount(PynOrgForm, { props: { error: 'taken' } })
    await w.find('input').setValue(' studio ')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0]).toEqual(['studio'])
    expect(w.find('[role=alert]').text()).toBe('taken')
  })
})

describe('PynOrgList', () => {
  it('links each organization with its role and date', () => {
    const w = mount(PynOrgList, { props: { orgs } })
    expect(w.find('a').attributes('href')).toBe('/studio')
    expect(w.find('[data-role]').text()).toBe('owner')
    expect(w.text()).toContain('Sep 02 2026')
  })

  it('offers to create one when empty', () => {
    expect(
      mount(PynOrgList, { props: { orgs: [] } })
        .find('a')
        .attributes('href'),
    ).toBe('/_/new-org')
  })
})

describe('PynOrgMembers', () => {
  const props = { members: orgMembers, self: 'alice', owner: true }
  const buttons = (w: ReturnType<typeof mount>, text: string) =>
    w.findAll('button').filter((b) => b.text().startsWith(text))

  it('lets an owner add a member with a role', async () => {
    const w = mount(PynOrgMembers, { props })
    const form = w.findAll('form').at(-1)!
    await form.find('input').setValue(' dave ')
    await form.find('select').setValue('owner')
    await form.trigger('submit')
    expect(w.emitted('add')?.[0]).toEqual([{ user: 'dave', role: 'owner' }])
  })

  it('emits a role change', async () => {
    const w = mount(PynOrgMembers, { props })
    await w.find('select[aria-label="Role of bob"]').setValue('owner')
    expect(w.emitted('setRole')?.[0]).toEqual([{ user: 'bob', role: 'owner' }])
  })

  it('confirms before removing and before leaving', async () => {
    const w = mount(PynOrgMembers, { props })
    await buttons(w, 'Remove')[0].trigger('click')
    expect(w.emitted('remove')).toBeUndefined()
    await w.find('form').trigger('submit')
    expect(w.emitted('remove')?.[0]).toEqual(['bob'])
  })

  it('gives a plain member only a Leave button on their own row', () => {
    const w = mount(PynOrgMembers, { props: { ...props, self: 'bob', owner: false } })
    expect(w.findAll('select')).toHaveLength(0)
    expect(w.findAll('button').map((b) => b.text())).toEqual(['Leave'])
    expect(w.text()).not.toContain('Add an existing account')
  })

  it('shows the server error', () => {
    const w = mount(PynOrgMembers, { props: { ...props, error: 'last owner' } })
    expect(w.find('[role=alert]').text()).toBe('last owner')
  })
})

describe('PynOrgDelete', () => {
  it('enables deletion only once the name is typed', async () => {
    const w = mount(PynOrgDelete, { props: { name: 'studio' } })
    const button = w.find('button')
    expect(button.attributes('disabled')).toBeDefined()
    await w.find('input').setValue('studio')
    expect(button.attributes('disabled')).toBeUndefined()
    await w.find('form').trigger('submit')
    expect(w.emitted('remove')).toHaveLength(1)
  })
})

describe('PynOrgRepoPolicy', () => {
  const props = { policy: repoPolicy, teams: teams.map((t) => t.slug), members: ['bob', 'carol'] }

  it('lists rules with effect, kind, subject and scope', () => {
    const w = mount(PynOrgRepoPolicy, { props })
    expect(w.findAll('li')).toHaveLength(3)
    expect(w.findAll('li')[1].text()).toContain('deny')
    expect(w.findAll('li')[1].text()).toContain('carol')
    expect(
      (w.find('select[aria-label="Scope of deny user carol"]').element as HTMLSelectElement).value,
    ).toBe('public')
  })

  it('emits the base setting, a scope change and a removal', async () => {
    const w = mount(PynOrgRepoPolicy, { props })
    await w.find('select').setValue('both')
    expect(w.emitted('setBase')?.[0]).toEqual(['both'])
    await w.find('select[aria-label="Scope of deny user carol"]').setValue('both')
    expect(w.emitted('setRule')?.[0]).toEqual([
      { rule: { effect: 'deny', kind: 'user', subject: 'carol', scope: 'public' }, scope: 'both' },
    ])
    await w.find('button[aria-label="Remove deny user carol"]').trigger('click')
    expect(w.emitted('removeRule')?.[0]).toEqual([
      { effect: 'deny', kind: 'user', subject: 'carol', scope: 'public' },
    ])
  })

  it('adds a rule from the form and hides owner for deny', async () => {
    const w = mount(PynOrgRepoPolicy, { props })
    const form = w.find('form')
    const [effect, kind, subject, scope] = form.findAll('select')
    await kind.setValue('user')
    await subject.setValue('bob')
    await scope.setValue('private')
    await form.trigger('submit')
    expect(w.emitted('setRule')?.[0]).toEqual([
      { rule: { effect: 'allow', kind: 'user', subject: 'bob' }, scope: 'private' },
    ])
    await effect.setValue('deny')
    await kind.setValue('role')
    expect(subject.findAll('option').map((o) => o.text())).toEqual(['Choose a role', 'member'])
  })

  it('shows the error', () => {
    const w = mount(PynOrgRepoPolicy, { props: { ...props, error: 'nope' } })
    expect(w.find('[role=alert]').text()).toBe('nope')
  })
})

describe('PynTeamList', () => {
  it('links each team with counts and the created date', () => {
    const w = mount(PynTeamList, { props: { org: 'studio', teams } })
    expect(w.find('a').attributes('href')).toBe('/studio/-/teams/artists')
    expect(w.find('[data-members]').text()).toBe('2 members')
    expect(w.find('[data-repos]').text()).toBe('2 repositories')
    expect(w.text()).toContain('Sep 10 2026')
  })

  it('has an empty state', () => {
    expect(mount(PynTeamList, { props: { org: 'studio', teams: [] } }).text()).toContain('no teams')
  })
})

describe('PynTeamForm', () => {
  it('emits the slug, name and description when creating', async () => {
    const w = mount(PynTeamForm, { props: { error: 'taken' } })
    await w.find('input').setValue(' qa ')
    await w.find('textarea').setValue('testers')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0]).toEqual([{ slug: 'qa', name: '', description: 'testers' }])
    expect(w.find('[role=alert]').text()).toBe('taken')
  })

  it('starts from the team when editing and has no slug field', async () => {
    const w = mount(PynTeamForm, { props: { team: teams[0] } })
    expect(w.findAll('input')).toHaveLength(1)
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0]).toEqual([
      { name: 'Artists', description: 'Texture and model work.' },
    ])
  })
})

describe('PynTeamDetail', () => {
  const props = { team: teams[0], candidates: ['alice'], owner: true }

  it('shows members and granted repositories with roles', () => {
    const w = mount(PynTeamDetail, { props })
    expect(w.find('[data-members]').text()).toContain('bob')
    const links = w.findAll('[data-repos] a').map((a) => a.attributes('href'))
    expect(links).toEqual(['/studio/game', '/studio/assets'])
    expect(w.findAll('[data-role]').map((e) => e.text())).toEqual(['writer', 'maintainer'])
  })

  it('lets an owner add from the candidates and remove', async () => {
    const w = mount(PynTeamDetail, { props })
    await w.find('select').setValue('alice')
    await w.find('form').trigger('submit')
    expect(w.emitted('add')?.[0]).toEqual(['alice'])
    await w.find('button[aria-label="Remove bob"]').trigger('click')
    expect(w.emitted('remove')?.[0]).toEqual(['bob'])
  })

  it('is read only for a plain member', () => {
    const w = mount(PynTeamDetail, { props: { ...props, owner: false } })
    expect(w.find('form').exists()).toBe(false)
    expect(w.findAll('button')).toHaveLength(0)
  })
})

describe('PynTeamDelete', () => {
  it('enables deletion only once the slug is typed', async () => {
    const w = mount(PynTeamDelete, { props: { slug: 'qa' } })
    const button = w.find('button')
    expect(button.attributes('disabled')).toBeDefined()
    await w.find('input').setValue('qa')
    expect(button.attributes('disabled')).toBeUndefined()
    await w.find('form').trigger('submit')
    expect(w.emitted('remove')).toHaveLength(1)
  })
})

describe('PynTeamGrant', () => {
  it('emits the chosen team and role', async () => {
    const w = mount(PynTeamGrant, {
      props: { teams: ['qa', 'artists'], roles: ['reader', 'writer'] },
    })
    const [team, role] = w.findAll('select')
    await team.setValue('artists')
    await role.setValue('writer')
    await w.find('form').trigger('submit')
    expect(w.emitted('grant')?.[0]).toEqual([{ name: 'artists', role: 'writer' }])
  })

  it('says so when every team has a role', () => {
    const w = mount(PynTeamGrant, { props: { teams: [], roles: ['reader'] } })
    expect(w.find('button').exists()).toBe(false)
    expect(w.text()).toContain('already has a role')
  })
})

describe('PynSignIn', () => {
  const fill = async (w: ReturnType<typeof mount>, values: string[]) => {
    const inputs = w.findAll('input')
    for (const [i, v] of values.entries()) await inputs[i].setValue(v)
  }
  const click = (w: ReturnType<typeof mount>, text: string) =>
    w
      .findAll('button')
      .find((b) => b.text() === text)!
      .trigger('click')

  it('emits the user name and password when signing in', async () => {
    const w = mount(PynSignIn, { props: { registration: 'invite' } })
    await fill(w, ['alice', 'a long password'])
    await w.find('form').trigger('submit')
    expect(w.emitted('signIn')?.[0]).toEqual([{ username: 'alice', password: 'a long password' }])
  })

  it('offers an invitation field on invite-only servers and not on open ones', async () => {
    const invite = mount(PynSignIn, { props: { registration: 'invite' } })
    await click(invite, 'I have an invitation')
    expect(invite.findAll('input')).toHaveLength(3)
    await fill(invite, ['wendy', 'a long password', 'pyni_x'])
    await invite.find('form').trigger('submit')
    expect(invite.emitted('register')?.[0]).toEqual([
      { username: 'wendy', password: 'a long password', invite: 'pyni_x' },
    ])

    const open = mount(PynSignIn, { props: { registration: 'open' } })
    await click(open, 'Create an account')
    expect(open.findAll('input')).toHaveLength(2)
  })

  it('hides registration on closed servers and offers no token entry', () => {
    const w = mount(PynSignIn, { props: { registration: 'closed' } })
    const labels = w.findAll('button').map((b) => b.text())
    expect(labels).not.toContain('Create an account')
    expect(labels).not.toContain('I have an invitation')
    expect(labels.join(' ')).not.toMatch(/token/i)
  })

  it('shows an error', () => {
    const w = mount(PynSignIn, {
      props: { registration: null, error: 'wrong user name or password' },
    })
    expect(w.find('[role=alert]').text()).toContain('wrong user name')
  })

  it('asks for an email on open servers that verify addresses', async () => {
    const w = mount(PynSignIn, {
      props: { registration: 'open', emailVerification: true },
    })
    await click(w, 'Create an account')
    expect(w.findAll('input')).toHaveLength(3)
    await fill(w, ['wendy', 'a long password', 'w@example.com'])
    await w.find('form').trigger('submit')
    expect(w.emitted('register')?.[0]).toEqual([
      {
        username: 'wendy',
        password: 'a long password',
        email: 'w@example.com',
        invite: undefined,
      },
    ])
  })

  it.each([
    ['pending_verification', 'Check your email'],
    ['pending_approval', 'Waiting for approval'],
    ['account_disabled', 'Account disabled'],
  ] as const)('shows the %s state instead of the form', async (status, title) => {
    const w = mount(PynSignIn, {
      props: { registration: 'open', notice: { status, user: 'wendy' } },
    })
    expect(w.find('form input[autocomplete=username]').exists()).toBe(false)
    expect(w.text()).toContain(title)
    expect(w.text()).toContain('wendy')
    expect(w.findAll('input[type=email]')).toHaveLength(status === 'pending_verification' ? 1 : 0)
    await click(w, 'Back to sign in')
    expect(w.emitted('dismiss')).toHaveLength(1)
  })

  const provider = { name: 'Acme SSO', sign_in_url: '/v1/oidc/authorize' }

  it('builds the provider start url with the page to return to', () => {
    expect(externalSignInUrl('/v1/oidc/authorize', '/acme/game?x=1')).toBe(
      '/v1/oidc/authorize?return_to=%2Facme%2Fgame%3Fx%3D1',
    )
    expect(externalSignInUrl('/v1/oidc/authorize?a=b')).toBe('/v1/oidc/authorize?a=b&return_to=%2F')
  })

  it('explains a provider error and falls back for unknown codes', () => {
    expect(signInErrorMessage('external_account_not_linked')).toContain('No account is linked')
    expect(signInErrorMessage('???')).toBe('Sign-in with the provider failed.')
  })

  it('offers the provider next to the password form', () => {
    const w = mount(PynSignIn, {
      props: { registration: 'closed', external: provider },
    })
    expect(w.find('a').text()).toBe('Sign in with Acme SSO')
    expect(w.find('a').attributes('href')).toBe('/v1/oidc/authorize?return_to=%2F')
    expect(w.find('input').exists()).toBe(true)
  })

  it('hides the password form until an administrator asks for it', async () => {
    const w = mount(PynSignIn, {
      props: {
        registration: 'closed',
        external: provider,
        passwordSignIn: false,
      },
    })
    expect(w.find('input').exists()).toBe(false)
    await w.find('button[type=button]').trigger('click')
    expect(w.find('input').exists()).toBe(true)
  })

  it('shows the error the server sent back', () => {
    const w = mount(PynSignIn, {
      props: {
        registration: 'closed',
        callbackError: 'external_sign_in_failed',
      },
    })
    expect(w.find('[role=alert]').text()).toContain('did not complete')
  })
})

describe('PynVerifyEmail', () => {
  const outcome = (props: object) => mount(PynVerifyEmail, { props: props as never })

  it('shows the verification outcomes', () => {
    expect(outcome({ outcome: 'verifying' }).text()).toContain('Verifying')
    const ok = outcome({
      outcome: 'verified',
      status: 'active',
      user: 'wendy',
    })
    expect(ok.text()).toContain('You can sign in now')
    expect(ok.find('a').attributes('href')).toBe('/')
    const wait = outcome({ outcome: 'verified', status: 'pending_approval' })
    expect(wait.text()).toContain('must approve')
    const bad = outcome({
      outcome: 'invalid',
      resendError: 'Too many attempts. Try again in 5 minutes.',
    })
    expect(bad.text()).toContain('Link not valid')
    expect(bad.find('input[type=email]').exists()).toBe(true)
    expect(bad.text()).toContain('5 minutes')
  })

  it('emits the address to resend to', async () => {
    const w = outcome({ outcome: 'invalid' })
    await w.find('input').setValue('w@example.com')
    await w.find('form').trigger('submit')
    expect(w.emitted('resend')?.[0]).toEqual(['w@example.com'])
  })
})

describe('PynAccountSettings', () => {
  it('lists the settings pages, marks the current one and renders the page', () => {
    const w = mount(PynAccountSettings, {
      props: { items: accountNav, current: 'keys' },
      slots: { default: '<p>content</p>' },
    })
    const link = w.find('a[aria-current="page"]')
    expect(link.text()).toBe('SSH keys')
    expect(link.attributes('href')).toBe('/_/settings/keys')
    expect(w.text()).toContain('content')
  })

  it('adds linked sign-in only when a provider exists', () => {
    expect(accountNavItems(false)).toEqual(accountNav)
    expect(accountNavItems(true).map((i) => i.id)).toEqual(['keys', 'tokens', 'identities'])
  })
})

describe('PynKeys', () => {
  const keys = [
    {
      id: 'aaaaaaaaaaaa',
      user: 'alice',
      title: 'work laptop',
      algorithm: 'ssh-ed25519',
      fingerprint: 'SHA256:abc',
      created_at: '2026-10-08T09:00:00Z',
      last_used_at: null,
    },
  ]

  it('lists keys with their fingerprint and whether they were used', () => {
    const w = mount(PynKeys, { props: { keys } })
    expect(w.text()).toContain('work laptop')
    expect(w.text()).toContain('SHA256:abc')
    expect(w.text()).toContain('Added Oct 08 2026')
    expect(w.text()).toContain('never used')
  })

  it('says so when there are no keys', () => {
    expect(mount(PynKeys, { props: { keys: [] } }).text()).toContain('No keys yet')
  })

  it('emits the pasted key and title, then clears the form', async () => {
    const w = mount(PynKeys, { props: { keys: [] } })
    await w.find('input').setValue('laptop')
    await w.find('textarea').setValue('  ssh-ed25519 AAAA  ')
    await w.find('form').trigger('submit')
    expect(w.emitted('add')?.[0]).toEqual([{ key: 'ssh-ed25519 AAAA', title: 'laptop' }])
    expect((w.find('textarea').element as HTMLTextAreaElement).value).toBe('')
  })

  it('emits the id to remove and shows an error', async () => {
    const w = mount(PynKeys, {
      props: { keys, error: 'that key is already linked to an account' },
    })
    expect(w.find('[role=alert]').text()).toContain('already linked')
    await w.find('button[type=button]').trigger('click')
    expect(w.emitted('remove')?.[0]).toEqual(['aaaaaaaaaaaa'])
  })
})

describe('PynAccounts', () => {
  const [root, bob, carol, dave] = accounts
  const props = { accounts, status: '' as const, self: 'root' }
  const buttons = (w: ReturnType<typeof mount>, text: string) =>
    w.findAll('button').filter((b) => b.text().startsWith(text))

  it('picks the actions the server accepts', () => {
    expect(accountActions(root, 'root')).toEqual([])
    expect(accountActions(root, 'other')).toEqual(['disable'])
    expect(accountActions(bob, 'root')).toEqual(['approve', 'disable'])
    expect(accountActions(carol, 'root')).toEqual(['disable'])
    expect(accountActions(dave, 'root')).toEqual(['enable'])
  })

  it('swaps an updated account in and drops it when the filter no longer matches', () => {
    const active = { ...bob, status: 'active' as const }
    expect(applyUpdate(accounts, active, '')[1]).toEqual(active)
    expect(applyUpdate(accounts.slice(1, 2), active, 'pending_approval')).toEqual([])
  })

  it('lists status, email and the disable reason with shared date format', () => {
    const w = mount(PynAccounts, { props })
    expect(w.text()).toContain('Needs approval')
    expect(w.text()).toContain('bob@example.com')
    expect(w.text()).toContain('Disabled Oct 05 2026 14:00: Left the studio')
    expect(w.text()).toContain('(unverified)')
  })

  it('has no disable button for the signed-in administrator', () => {
    const w = mount(PynAccounts, { props: { ...props, accounts: [root] } })
    expect(w.findAll('li button')).toHaveLength(0)
  })

  it('emits the status filter, approve and enable', async () => {
    const w = mount(PynAccounts, { props })
    await w.find('select').setValue('disabled')
    expect(w.emitted('status')?.[0]).toEqual(['disabled'])
    await buttons(w, 'Approve')[0].trigger('click')
    expect(w.emitted('approve')?.[0]).toEqual(['bob'])
    await buttons(w, 'Enable')[0].trigger('click')
    expect(w.emitted('enable')?.[0]).toEqual(['dave'])
  })

  it('confirms with an optional reason before disabling, and can cancel', async () => {
    const w = mount(PynAccounts, { props })
    await buttons(w, 'Disable')[0].trigger('click')
    expect(w.emitted('disable')).toBeUndefined()
    await buttons(w, 'Cancel')[0].trigger('click')
    expect(w.find('input').exists()).toBe(false)
    await buttons(w, 'Disable')[0].trigger('click')
    await w.find('input').setValue('spam')
    await w.find('form').trigger('submit')
    expect(w.emitted('disable')?.[0]).toEqual([{ user: 'bob', reason: 'spam' }])
    expect(w.find('input').exists()).toBe(false)
  })

  it('says when nothing matches and shows errors', () => {
    const w = mount(PynAccounts, {
      props: { ...props, accounts: [], error: 'boom' },
    })
    expect(w.text()).toContain('No accounts match.')
    expect(w.find('[role=alert]').text()).toBe('boom')
  })
})

describe('view layout components', () => {
  it('header renders the title and wraps actions only when given', () => {
    expect(
      mount(PynViewHeader, { props: { title: 'Orgs' } })
        .find('span')
        .exists(),
    ).toBe(false)
    const w = mount(PynViewHeader, {
      props: { title: 'Repositories' },
      slots: { default: '<a href="/x">New</a>' },
    })
    expect(w.find('h1').text()).toBe('Repositories')
    expect(w.find('span a').text()).toBe('New')
  })

  it('action renders a link, primary or secondary', () => {
    const primary = mount(PynViewAction, {
      props: { href: '/_/new', primary: true },
      slots: { default: 'New' },
    })
    const secondary = mount(PynViewAction, {
      props: { href: '/_/locks' },
      slots: { default: 'Locks' },
    })
    expect(primary.attributes('href')).toBe('/_/new')
    expect(secondary.text()).toBe('Locks')
    expect(primary.classes()).not.toEqual(secondary.classes())
  })

  it('error is an alert and summary is plain text', () => {
    expect(mount(PynViewError, { slots: { default: 'Boom' } }).attributes('role')).toBe('alert')
    expect(mount(PynViewSummary, { slots: { default: 'Hello' } }).text()).toBe('Hello')
  })

  it('group titles its content and stack holds its children', () => {
    const g = mount(PynViewGroup, { props: { title: 'Audit' }, slots: { default: '<p>body</p>' } })
    expect(g.find('h2').text()).toBe('Audit')
    expect(g.find('p').text()).toBe('body')
    expect(
      mount(PynViewStack, { slots: { default: '<i>a</i><i>b</i>' } }).findAll('i'),
    ).toHaveLength(2)
  })
})

const identityProvider = { name: 'Acme SSO', sign_in_url: '/v1/oidc/authorize' }
const linkedIdentities = [
  {
    id: 'aaaaaaaaaaaa',
    issuer: 'https://id.acme.example',
    subject: 'u-1',
    email: 'wendy@acme.example',
    created_at: '2026-10-08T09:00:00Z',
    last_sign_in_at: null,
  },
]

describe('PynIdentities', () => {
  it('lists links and offers unlink and link', async () => {
    const w = mount(PynIdentities, {
      props: { identities: linkedIdentities, provider: identityProvider },
    })
    expect(w.text()).toContain('wendy@acme.example')
    expect(w.text()).toContain('never used')
    await w.findAll('button')[0].trigger('click')
    expect(w.emitted('unlink')?.[0]).toEqual(['aaaaaaaaaaaa'])
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('link')).toHaveLength(1)
  })

  it('says so when nothing is linked and shows an error', () => {
    const w = mount(PynIdentities, {
      props: { identities: [], provider: identityProvider, error: 'only way in' },
    })
    expect(w.text()).toContain('Nothing linked yet')
    expect(w.find('[role=alert]').text()).toBe('only way in')
  })
})

const tokenList = [
  {
    id: 'aaaaaaaaaaaa',
    user: 'alice',
    name: 'ci',
    repos: ['acme/game'],
    permissions: ['read', 'lock'],
    created_at: '2026-10-08T09:00:00Z',
    expires_at: null,
    last_used_at: null,
  },
  {
    id: 'bbbbbbbbbbbb',
    user: 'alice',
    name: 'old',
    repos: [],
    permissions: ['read'],
    created_at: '2026-10-01T09:00:00Z',
    revoked_at: '2026-10-02T09:00:00Z',
  },
]

describe('token state', () => {
  it('splits and de-duplicates repositories', () => {
    expect(parseRepos('a/b, c/d\na/b  e/f')).toEqual(['a/b', 'c/d', 'e/f'])
    expect(parseRepos('')).toEqual([])
  })

  it('turns a date into an end-of-day expiry', () => {
    expect(expiryFromDate('2027-01-01')).toBe('2027-01-01T23:59:59Z')
    expect(expiryFromDate('')).toBeNull()
  })
})

describe('PynTokens', () => {
  it('lists tokens and only offers revoke for live ones', () => {
    const w = mount(PynTokens, { props: { tokens: tokenList } })
    expect(w.text()).toContain('acme/game')
    expect(w.text()).toContain('no expiry')
    expect(w.text()).toContain('revoked')
    expect(w.findAll('button').filter((b) => b.text() === 'Revoke')).toHaveLength(1)
  })

  it('says so when there are no tokens', () => {
    expect(mount(PynTokens, { props: { tokens: [] } }).text()).toContain('No tokens yet')
  })

  it('emits the form and resets it', async () => {
    const w = mount(PynTokens, { props: { tokens: [] } })
    await w.find('input').setValue(' ci ')
    await w.find('textarea').setValue('acme/game acme/tools')
    await w.find('input[type=date]').setValue('2027-01-01')
    await w.find('input[value=lock]').setValue(true)
    await w.find('form').trigger('submit')
    expect(w.emitted('create')?.[0]).toEqual([
      {
        name: 'ci',
        repos: ['acme/game', 'acme/tools'],
        permissions: ['read', 'lock'],
        expires_at: '2027-01-01T23:59:59Z',
      },
    ])
    expect((w.find('textarea').element as HTMLTextAreaElement).value).toBe('')
  })

  it('shows the secret once and the error', async () => {
    const w = mount(PynTokens, { props: { tokens: [], secret: 'pyn_abc', error: 'nope' } })
    expect(w.text()).toContain('pyn_abc')
    expect(w.find('[role=alert]').text()).toBe('nope')
    await w.find('[role=status] button').trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
  })

  it('emits the id to revoke', async () => {
    const w = mount(PynTokens, { props: { tokens: tokenList } })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Revoke')!
      .trigger('click')
    expect(w.emitted('revoke')?.[0]).toEqual(['aaaaaaaaaaaa'])
  })
})

const blank: SetupForm = {
  token: '',
  username: '',
  password: '',
  email: '',
  server_name: '',
  public_url: '',
  registration: 'closed',
}

describe('setup state', () => {
  it('requires the token and the administrator credentials', () => {
    expect(stepComplete('token', blank)).toBe(false)
    expect(stepComplete('token', { ...blank, token: ' abc ' })).toBe(true)
    expect(stepComplete('admin', { ...blank, username: 'root' })).toBe(false)
    expect(stepComplete('admin', { ...blank, username: 'root', password: 'pw' })).toBe(true)
    expect(stepComplete('server', blank)).toBe(true)
  })
})

describe('PynSetup', () => {
  const next = (w: ReturnType<typeof mount>) => w.find('form').trigger('submit')

  it('walks every step and emits the form on finish', async () => {
    const w = mount(PynSetup, { props: { registration: 'closed', publicUrl: 'http://x' } })
    expect(w.text()).toContain('Step 1 of 6')
    await next(w)
    await w.find('input').setValue('tok')
    await next(w)
    const [user, pass] = w.findAll('input')
    await user.setValue('root')
    await pass.setValue('pw')
    await next(w)
    await w.find('input').setValue('Studio')
    await next(w)
    expect(w.text()).toContain('written to the server log')
    await w.find('input[value=invite]').setValue(true)
    await next(w)
    expect(w.text()).toContain('root')
    expect(w.text()).toContain('Invitation only')
    await next(w)
    expect(w.emitted('finish')?.[0]).toEqual([
      {
        token: 'tok',
        username: 'root',
        password: 'pw',
        email: '',
        server_name: 'Studio',
        public_url: 'http://x',
        registration: 'invite',
      },
    ])
  })

  it('stays on the token step until one is entered', async () => {
    const w = mount(PynSetup, { props: { registration: 'closed' } })
    await next(w)
    await next(w)
    expect(w.text()).toContain('Step 2 of 6')
  })

  it('goes back and shows an error', async () => {
    const w = mount(PynSetup, { props: { registration: 'closed', error: 'bad token' } })
    await next(w)
    expect(w.find('[role=alert]').text()).toBe('bad token')
    await w.find('button[type=button]').trigger('click')
    expect(w.text()).toContain('Step 1 of 6')
  })

  it('offers sign-in once finished', async () => {
    const w = mount(PynSetup, { props: { registration: 'closed', done: true } })
    await w.find('button').trigger('click')
    expect(w.emitted('signIn')).toHaveLength(1)
  })
})
