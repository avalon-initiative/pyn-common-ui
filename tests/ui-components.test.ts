// Component render tests for every exported component. Run with `make test`.
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { copyText } from '../src/utils/copy'
import {
  PynAccountDelete,
  PynAccountNotice,
  PynAccountPendingDeletion,
  PynAccountSettings,
  PynEmailAddresses,
  PynProfileForm,
  PynUsernameChange,
  PynAdminLayout,
  PynPasswordForm,
  PynAccounts,
  PynAddAccount,
  PynEmailStatus,
  PynMultiSelect,
  PynEmptyState,
  PynServerInvitations,
  PynActivity,
  PynAddPerson,
  PynAudit,
  PynBranchBar,
  PynBranchCompare,
  PynBranchPicker,
  PynBreadcrumb,
  PynBreadcrumbs,
  PynButton,
  PynCheckoutCard,
  PynCodeView,
  PynDrawer,
  PynFileBar,
  PynFileList,
  PynFileView,
  PynHistory,
  PynIcon,
  PynIdentities,
  PynInvites,
  PynKeys,
  PynPasskeys,
  PynPasswordPrompt,
  PynTwoFactor,
  PynNotices,
  PynTwoFactorNag,
  PynTwoFactorRequirement,
  PynOrgSettings,
  PynQrCode,
  PynRecoveryCodes,
  PynSecondFactor,
  PynTotpEnrolment,
  PynLockBadge,
  PynLockIcon,
  PynLockedFiles,
  PynLocks,
  PynMarkdown,
  PynMembers,
  PynMenu,
  PynOwnerFrozenNotice,
  PynUpdateNotice,
  PynPolicyConflictNotice,
  PynPolicyEditor,
  PynPolicyPreview,
  PynModeChip,
  PynMyLocks,
  PynOrgDelete,
  PynOrgForm,
  PynOrgHeader,
  PynUserHeader,
  PynOrgList,
  PynOrgInvitation,
  PynOrgInvitations,
  PynOrgMembers,
  PynOrgPendingInvitations,
  PynOrgRepoPolicy,
  PynPageNotFound,
  PynReadme,
  PynRepoDelete,
  PynRepoDetails,
  PynRepoForm,
  PynRepoLanding,
  PynRepoList,
  PynRepoSettings,
  PynRepoShell,
  PynRepoNotFound,
  PynResendForm,
  PynRoles,
  PynSearch,
  PynSetup,
  PynShell,
  PynVersionFooter,
  versionMismatch,
  PynSignIn,
  PynSideNav,
  PynTeamDelete,
  PynTeamDetail,
  PynTeamForm,
  PynTeamGrant,
  PynTeamList,
  PynTokens,
  PynTokenForm,
  PynWebhookDeliveries,
  PynSecretReveal,
  PynWebhookDetail,
  PynWebhookForm,
  PynWebhooks,
  PynTopBar,
  PynTree,
  PynVerifyEmail,
  accountActions,
  adminAction,
  accountNav,
  accountNavItems,
  adminNavItems,
  navItems,
  applyUpdate,
  PynViewAction,
  PynViewError,
  PynViewNotice,
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
  eventTypesLabel,
  expiryFromDate,
  expiryAfter,
  expiryPreview,
  filterRepos,
  availableResources,
  buildPermissions,
  TOKEN_EXPIRY_CHOICES,
  isRotating,
  parseEventTypes,
  webhookNameProblem,
  webhookUrlProblem,
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
  orgAuditLabel,
  languageFor,
  lineHash,
  mainNav,
  matchRepos,
  myLockKey,
  parseLineHash,
  orgTabs,
  userTabs,
  ownerChoices,
  parseLockLimit,
  personGrantees,
  readmeEntry,
  renderMarkdown,
  repoSettingsNav,
  repoPath,
  repoSettingsPath,
  repoShellTabs,
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
  validExpiry,
} from '../src'
import type { SetupForm } from '../src'
import { accounts, adminAccounts } from '../src/stories/admin-data'
import { invitations, roles, targets } from '../src/stories/server-invitation-data'
import { emptyStatus, notices, status as twoFactorStatus } from '../src/stories/two-factor-data'
import { codeText, fileEntry, imageSrc, lockedEntry, readmeText } from '../src/stories/file-data'
import {
  orgInvitations,
  orgMembers,
  orgs,
  repoPolicy,
  repoTeams,
  teams,
} from '../src/stories/org-data'
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

  it.each([
    [true, true, true],
    [false, false, false],
    [undefined, false, true],
  ] as const)('notice emailVerification=%s', (emailVerification, guidance, link) => {
    const w = mount(PynAccountNotice, {
      props: { status: 'pending_verification', emailVerification },
    })
    expect(w.text().includes('Check your spam folder')).toBe(guidance)
    expect(w.text().includes('Follow the link in the verification email')).toBe(link)
    expect(w.text().includes('not active yet')).toBe(emailVerification === false)
  })

  it.each([
    [true, true],
    [false, false],
    [undefined, false],
  ] as const)('resend form emailVerification=%s', (emailVerification, guidance) => {
    const w = mount(PynResendForm, { props: { emailVerification } })
    expect(w.text().includes('Check your spam folder')).toBe(guidance)
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

  it('links Server administration in the account menu for administrators only', async () => {
    const open = async (admin?: boolean) => {
      const w = mount(PynTopBar, { props: { user: 'root', repos: [], theme: 'system', admin } })
      await w.find('[aria-label="Account menu"]').trigger('click')
      return w
    }
    const admin = await open(true)
    expect(admin.find('[href="/_/admin"]').text()).toBe('Server administration')
    expect(admin.find('[href="/_/settings"]').text()).toBe('Account settings')
    expect((await open()).find('[href="/_/admin"]').exists()).toBe(false)
  })

  it('adds extra account entries: links stay links, buttons emit account', async () => {
    const w = mount(PynTopBar, {
      props: {
        user: 'alice',
        repos: [],
        theme: 'system',
        extraAccount: [
          { id: 'billing', label: 'Billing', href: '/_/billing' },
          { id: 'support', label: 'Support' },
        ],
      },
    })
    await w.find('[aria-label="Account menu"]').trigger('click')
    expect(w.find('a[href="/_/billing"]').exists()).toBe(true)
    await w
      .findAll('button')
      .find((b) => b.text() === 'Support')!
      .trigger('click')
    expect(w.emitted('account')?.[0]).toEqual(['support'])
    expect(w.emitted('signOut')).toBeUndefined()
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

  it('appends extra navigation entries, with or without an icon', () => {
    const w = mount(PynSideNav, {
      props: {
        account: 'alice',
        items: mainNav,
        current: 'docs',
        repos,
        extraNav: [
          { id: 'billing', label: 'Billing', href: '/_/billing', icon: 'lock' },
          { id: 'docs', label: 'Docs', href: '/_/docs' },
        ],
      },
    })
    expect(w.find('a[href="/_/billing"] svg').exists()).toBe(true)
    expect(w.find('a[href="/_/docs"] svg').exists()).toBe(false)
    expect(w.find('a[href="/_/docs"]').attributes('aria-current')).toBe('page')
  })

  it('shows a badge with an accessible label, hidden when 0 or empty', () => {
    const nav = (badge?: number | string) =>
      mount(PynSideNav, {
        props: {
          account: 'alice',
          items: [{ id: 'inv', label: 'Invitations', href: '/_/inv', badge }],
          current: '',
          repos,
        },
      })
    const w = nav(3)
    expect(w.find('a[href="/_/inv"] [aria-hidden="true"]').text()).toBe('3')
    expect(w.find('a[href="/_/inv"]').text()).toContain('3 pending')
    for (const none of [0, '', undefined]) {
      expect(nav(none).find('a[href="/_/inv"]').text()).toBe('Invitations')
    }
  })

  it('keeps the link text exactly the label when there is no badge', () => {
    const w = mount(PynSideNav, {
      props: {
        account: 'alice',
        items: [{ id: 'rep', label: 'Reports', href: '/_/rep', icon: 'repo' }],
        current: 'rep',
        repos,
      },
    })
    expect(w.find('a[href="/_/rep"]').element.textContent).toBe('Reports')
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

describe('PynUserHeader', () => {
  it('links Usage only on the signed-in user own profile', () => {
    const own = mount(PynUserHeader, { props: { name: 'alice', self: true, current: 'usage' } })
    expect(own.findAll('nav a').map((a) => a.attributes('href'))).toEqual([
      '/alice',
      '/alice/-/usage',
    ])
    expect(own.find('[aria-current=page]').text()).toBe('Usage')
    const other = mount(PynUserHeader, { props: { name: 'alice' } })
    expect(other.findAll('nav a').map((a) => a.attributes('href'))).toEqual(['/alice'])
  })

  it('lists Usage for organization owners only', () => {
    const props = { name: 'studio', createdAt: '2026-09-02T08:00:00Z' }
    const owner = mount(PynOrgHeader, { props: { ...props, role: 'owner' } })
    expect(owner.findAll('nav a').map((a) => a.attributes('href'))).toContain('/studio/-/usage')
    const member = mount(PynOrgHeader, { props: { ...props, role: 'member' } })
    expect(member.findAll('nav a').map((a) => a.attributes('href'))).not.toContain(
      '/studio/-/usage',
    )
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

describe('PynBranchCompare', () => {
  const base = { base: 'main', head: 'feature/art', status: 'ahead' as const, ahead: 3, behind: 0 }
  const sentence = (props: Record<string, unknown>) =>
    mount(PynBranchCompare, { props: { ...base, ...props } })
      .find('p')
      .text()

  it('words each status, singular and plural', () => {
    expect(sentence({})).toBe('3 commits ahead of main')
    expect(sentence({ ahead: 1 })).toBe('1 commit ahead of main')
    expect(sentence({ status: 'behind', ahead: 0, behind: 1 })).toBe('1 commit behind main')
    expect(sentence({ status: 'behind', ahead: 0, behind: 4 })).toBe('4 commits behind main')
    expect(sentence({ status: 'diverged', behind: 2 })).toBe('3 commits ahead, 2 behind main')
    expect(sentence({ status: 'identical', ahead: 0 })).toBe('Up to date with main')
    expect(sentence({ status: 'diverged', ahead: 0, behind: 0 })).toBe('Up to date with main')
  })

  it('shows capped counts as max+', () => {
    const capped = { countsCapped: true, maxCommits: 1000 }
    expect(sentence({ ...capped, ahead: 1000 })).toBe('1000+ commits ahead of main')
    expect(sentence({ ...capped, status: 'behind', ahead: 0, behind: 1000 })).toBe(
      '1000+ commits behind main',
    )
    expect(sentence({ ...capped, status: 'diverged', ahead: 1000, behind: 2 })).toBe(
      '1000+ commits ahead, 2 behind main',
    )
    expect(sentence({ countsCapped: true, ahead: 7 })).toBe('7+ commits ahead of main')
  })

  const changes = [
    { path: 'a.txt', kind: 'added' as const },
    { path: 'b.psd', kind: 'modified' as const },
    { path: 'c.md', kind: 'deleted' as const },
  ]

  it('lists changes in a disclosure with text markers and emits select', async () => {
    const w = mount(PynBranchCompare, { props: { ...base, changes } })
    expect(w.find('details').exists()).toBe(true)
    expect(w.find('summary').text()).toBe('3 changed paths')
    const items = w.findAll('li')
    expect(items.map((i) => i.find('[aria-hidden=true]').text())).toEqual(['A', 'M', 'D'])
    expect(items.map((i) => i.text())).toEqual(['AAddeda.txt', 'MModifiedb.psd', 'DDeletedc.md'])
    await items[1].find('button').trigger('click')
    expect(w.emitted('select')).toEqual([['b.psd']])
    expect(w.text()).not.toContain('Showing the first')
  })

  it('has no disclosure without changes and notes truncation', () => {
    expect(mount(PynBranchCompare, { props: base }).find('details').exists()).toBe(false)
    expect(
      mount(PynBranchCompare, { props: { ...base, changes: [] } })
        .find('details')
        .exists(),
    ).toBe(false)
    const w = mount(PynBranchCompare, { props: { ...base, changes, truncated: true } })
    expect(w.text()).toContain('Showing the first 3 changed paths')
  })

  it('shows a status while loading and hides the rest', () => {
    const w = mount(PynBranchCompare, { props: { ...base, changes, loading: true, error: 'x' } })
    expect(w.find('[role=status]').text()).toBe('Comparing with main…')
    expect(w.find('[role=alert]').exists()).toBe(false)
    expect(w.text()).not.toContain('ahead')
    expect(w.find('details').exists()).toBe(false)
  })

  it('shows an alert on error and hides the rest', () => {
    const w = mount(PynBranchCompare, { props: { ...base, changes, error: 'Compare failed' } })
    expect(w.find('[role=alert]').text()).toBe('Compare failed')
    expect(w.text()).not.toContain('ahead')
    expect(w.find('details').exists()).toBe(false)
  })
})

describe('PynBranchPicker', () => {
  const branches = [
    { name: 'main', isDefault: true, updatedAt: '2026-10-08T10:00:00Z' },
    { name: 'feature/art', updatedAt: null },
    { name: 'release/1.0' },
  ]
  const mountPicker = (props: Record<string, unknown> = {}) =>
    mount(PynBranchPicker, {
      props: { branches, current: 'main', now, ...props },
      attachTo: document.body,
    })
  const open = async (w: ReturnType<typeof mountPicker>) => {
    await w.find('button').trigger('click')
    await flushPromises()
  }

  it('shows the current branch and keeps the list closed', () => {
    const w = mountPicker()
    expect(w.find('button').text()).toContain('main')
    expect(w.find('button').attributes('aria-expanded')).toBe('false')
    expect(w.find('[role=listbox]').exists()).toBe(false)
    w.unmount()
  })

  it('opens a listbox with combobox wiring, marks the default and the current branch', async () => {
    const w = mountPicker()
    await open(w)
    const box = w.find('[role=combobox]')
    const list = w.find('[role=listbox]')
    expect(w.find('button').attributes('aria-expanded')).toBe('true')
    expect(box.attributes('aria-controls')).toBe(list.attributes('id'))
    expect(box.attributes('aria-activedescendant')).toBe(w.find('[role=option]').attributes('id'))
    expect(document.activeElement).toBe(box.element)
    const options = w.findAll('[role=option]')
    expect(options).toHaveLength(3)
    expect(options[0].text()).toContain('default')
    expect(options[0].text()).toContain('2 hours ago')
    expect(options[0].attributes('aria-selected')).toBe('true')
    expect(options[1].attributes('aria-selected')).toBe('false')
    w.unmount()
  })

  it('filters by the search text and reports no matches', async () => {
    const w = mountPicker()
    await open(w)
    await w.find('[role=combobox]').setValue('REL')
    expect(w.findAll('[role=option]').map((o) => o.text())).toEqual(['release/1.0'])
    await w.find('[role=combobox]').setValue('zzz')
    expect(w.findAll('[role=option]')).toHaveLength(0)
    expect(w.find('[role=status]').text()).toBe('No matching branches')
    w.unmount()
  })

  it('selects with arrow keys and Enter, then closes with focus on the button', async () => {
    const w = mountPicker()
    await open(w)
    const box = w.find('[role=combobox]')
    await box.trigger('keydown', { key: 'ArrowDown' })
    await box.trigger('keydown', { key: 'ArrowDown' })
    await box.trigger('keydown', { key: 'ArrowUp' })
    await box.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('select')).toEqual([['feature/art']])
    expect(w.find('[role=listbox]').exists()).toBe(false)
    expect(document.activeElement).toBe(w.find('button').element)
    w.unmount()
  })

  it('selects by click', async () => {
    const w = mountPicker()
    await open(w)
    await w.findAll('[role=option]')[2].trigger('click')
    expect(w.emitted('select')).toEqual([['release/1.0']])
    w.unmount()
  })

  it('closes on Escape and returns focus to the button without selecting', async () => {
    const w = mountPicker()
    await open(w)
    await w.find('[role=combobox]').trigger('keydown', { key: 'Escape' })
    expect(w.find('[role=listbox]').exists()).toBe(false)
    expect(document.activeElement).toBe(w.find('button').element)
    expect(w.emitted('select')).toBeUndefined()
    w.unmount()
  })

  it('opens from the button with the down arrow', async () => {
    const w = mountPicker()
    await w.find('button').trigger('keydown', { key: 'ArrowDown' })
    await flushPromises()
    expect(w.find('[role=listbox]').exists()).toBe(true)
    w.unmount()
  })

  it('shows loading and error states without a list or selection', async () => {
    const w = mountPicker({ loading: true })
    await open(w)
    expect(w.find('[role=status]').text()).toContain('Loading')
    expect(w.find('[role=listbox]').exists()).toBe(false)
    await w.find('[role=combobox]').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('select')).toBeUndefined()
    await w.setProps({ loading: false, error: 'Could not load branches.' })
    expect(w.find('[role=alert]').text()).toBe('Could not load branches.')
    w.unmount()
  })

  it('says so when only the default branch exists', async () => {
    const w = mountPicker({ branches: [{ name: 'main', isDefault: true }] })
    await open(w)
    expect(w.text()).toContain('Only the default branch exists')
    w.unmount()
  })

  it('composes with the static branch bar', () => {
    const w = mount({
      components: { PynBranchBar, PynBranchPicker },
      template:
        '<div><PynBranchPicker :branches="b" current="main" /><PynBranchBar branch="main" :files="3" /></div>',
      data: () => ({ b: branches }),
    })
    expect(w.text()).toContain('3 files')
    expect(w.findComponent(PynBranchPicker).exists()).toBe(true)
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

describe('PynShell bare', () => {
  it('omits the side navigation and its toggle but keeps the top bar', () => {
    const slots = { top: '<b>top</b>', side: '<a href="#x">x</a>', default: 'body' }
    const bare = mount(PynShell, { props: { bare: true }, slots })
    expect(bare.find('aside').exists()).toBe(false)
    expect(bare.find('button').exists()).toBe(false)
    expect(bare.find('header').text()).toContain('top')
    expect(bare.text()).toContain('body')
    expect(mount(PynShell, { slots }).find('aside').exists()).toBe(true)
  })
})

describe('PynShell footer', () => {
  it('renders the footer slot only when given', () => {
    expect(mount(PynShell).find('footer').exists()).toBe(false)
    const w = mount(PynShell, { slots: { footer: '<footer>f</footer>' } })
    expect(w.find('footer').exists()).toBe(true)
  })
})

describe('PynVersionFooter', () => {
  it('shows both versions without a flag when they agree', () => {
    const w = mount(PynVersionFooter, { props: { webVersion: '0.1.2', serverVersion: 'v0.1.9' } })
    expect(w.text()).toBe('web v0.1.2·server v0.1.9')
    expect(w.attributes('data-mismatch')).toBe('false')
  })
  it('flags a mismatch and lists revisions in the tooltip', () => {
    const w = mount(PynVersionFooter, {
      props: {
        webVersion: '0.1.2',
        serverVersion: '0.2.0',
        webRevision: 'abc',
        serverRevision: 'def',
      },
    })
    expect(w.text()).toContain('version mismatch')
    expect(w.attributes('title')).toBe('web abc · server def')
  })
  it('shows an unknown server without flagging it', () => {
    const w = mount(PynVersionFooter, { props: { webVersion: '0.1.2' } })
    expect(w.text()).toContain('server unknown')
    expect(w.attributes('data-mismatch')).toBe('false')
  })
  it('compares major and minor only', () => {
    expect(versionMismatch('0.1.2', '0.1.9')).toBe(false)
    expect(versionMismatch('0.1.2', '1.1.2')).toBe(true)
    expect(versionMismatch('dev', '')).toBe(false)
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

  it('shows the subject as the title and the body in a collapsed disclosure', () => {
    const r = { ...rev(2), message: 'Fix seam\nin wall\n\n\nTiling was off.\nMips regenerated.\n' }
    const w = mount(PynHistory, { props: { revisions: [r, rev(1)] } })
    expect(w.text()).toContain('Fix seam in wall')
    const d = w.findAll('details')
    expect(d).toHaveLength(1)
    expect(d[0].attributes('open')).toBeUndefined()
    expect(d[0].find('summary').exists()).toBe(true)
    expect(d[0].find('pre').text()).toBe('Tiling was off.\nMips regenerated.')
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
    id: `repo-${owner}-${name}`,
    owner_id: `owner-${owner}`,
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

  it('shows only the subject of a multi-paragraph detail', () => {
    const e = { ...entries[0], detail: 'Add lighting\n\nLong explanation here.' }
    const w = mount(PynAudit, { props: { entries: [e], plain: true } })
    expect(w.text()).toContain('Add lighting')
    expect(w.text()).not.toContain('Long explanation')
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
    expect(orgTabs(null).map((t) => t.section)).toEqual([''])
    expect(orgTabs('owner').map((t) => t.section)).toEqual([
      '',
      'members',
      'teams',
      'usage',
      'audit',
      'settings',
    ])
    expect(orgTabs('owner').find((t) => t.section === 'usage')?.label).toBe('Usage')
    expect(userTabs(true).map((t) => t.section)).toEqual(['', 'usage'])
    expect(userTabs(false).map((t) => t.section)).toEqual([''])
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

  it('describes the name field with the hint and the validation message', async () => {
    const w = mount(PynOrgForm)
    const input = w.find('input')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).not.toContain(' ')
    await input.setValue(' Bad ')
    expect(w.emitted('nameInput')?.[0]).toEqual(['Bad'])
    await w.setProps({ nameMessage: 'lowercase only' })
    expect(input.attributes('aria-invalid')).toBe('true')
    const ids = input.attributes('aria-describedby')!.split(' ')
    expect(ids).toHaveLength(2)
    expect(w.find(`[id="${ids[1]}"]`).text()).toBe('lowercase only')
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

  it('renders the notice as a polite status message, and nothing when empty', () => {
    const w = mount(PynOrgMembers, { props: { ...props, notice: 'Invitation sent.' } })
    expect(w.find('[role=status]').text()).toBe('Invitation sent.')
    expect(mount(PynOrgMembers, { props }).find('[role=status]').exists()).toBe(false)
    expect(
      mount(PynOrgMembers, { props: { ...props, notice: '' } })
        .find('[role=status]')
        .exists(),
    ).toBe(false)
  })

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

describe('PynOrgInvitation', () => {
  const invitation = orgInvitations[0]

  it('shows the organization, role, inviter and expiry', () => {
    const w = mount(PynOrgInvitation, { props: { invitation } })
    expect(w.find('[data-org]').text()).toBe('studio')
    expect(w.find('[data-role]').text()).toBe('member')
    expect(w.find('[data-invited-by]').text()).toBe('alice')
    expect(w.find('[data-expires]').text()).toBe('Nov 19 2026')
  })

  it('emits accept and decline with the organization', async () => {
    const w = mount(PynOrgInvitation, { props: { invitation } })
    await w.find('button[aria-label="Accept invitation to studio"]').trigger('click')
    await w.find('button[aria-label="Decline invitation to studio"]').trigger('click')
    expect(w.emitted('accept')?.[0]).toEqual(['studio'])
    expect(w.emitted('decline')?.[0]).toEqual(['studio'])
  })

  it('disables both buttons while busy', () => {
    const w = mount(PynOrgInvitation, { props: { invitation, busy: true } })
    expect(w.findAll('button').every((b) => b.attributes('disabled') !== undefined)).toBe(true)
  })
})

describe('PynOrgInvitations', () => {
  it('lists the invitations and relays the answer', async () => {
    const w = mount(PynOrgInvitations, { props: { invitations: orgInvitations } })
    expect(w.findAll('article')).toHaveLength(2)
    await w.find('button[aria-label="Decline invitation to modding-club"]').trigger('click')
    expect(w.emitted('decline')?.[0]).toEqual(['modding-club'])
  })

  it('disables only the invitation being answered', () => {
    const w = mount(PynOrgInvitations, {
      props: { invitations: orgInvitations, busyOrg: 'studio' },
    })
    const [first, second] = w.findAll('article')
    expect(first.find('button').attributes('disabled')).toBeDefined()
    expect(second.find('button').attributes('disabled')).toBeUndefined()
  })

  it('shows the empty state and the error', () => {
    const w = mount(PynOrgInvitations, { props: { invitations: [], error: 'frozen' } })
    expect(w.text()).toContain('No pending invitations.')
    expect(w.find('[role=alert]').text()).toBe('frozen')
  })
})

describe('PynOrgPendingInvitations', () => {
  it('renders a table with column headers', () => {
    const w = mount(PynOrgPendingInvitations, { props: { invitations: orgInvitations } })
    expect(w.findAll('th[scope=col]').map((h) => h.text())).toEqual([
      'User',
      'Role',
      'Invited by',
      'Expires',
      'Actions',
    ])
    expect(w.findAll('tbody tr')).toHaveLength(2)
    expect(w.findAll('tbody tr')[0].text()).toContain('alice')
  })

  it('emits cancel with the user', async () => {
    const w = mount(PynOrgPendingInvitations, { props: { invitations: orgInvitations } })
    await w.find('button[aria-label="Cancel invitation for dave"]').trigger('click')
    expect(w.emitted('cancel')?.[0]).toEqual(['dave'])
  })

  it('keeps the table but drops the cancel buttons and Actions column when readonly', () => {
    const w = mount(PynOrgPendingInvitations, {
      props: { invitations: orgInvitations, readonly: true },
    })
    expect(w.findAll('th').map((h) => h.text())).toEqual(['User', 'Role', 'Invited by', 'Expires'])
    expect(w.findAll('tbody tr')).toHaveLength(2)
    expect(w.findAll('tbody tr')[0].findAll('td')).toHaveLength(4)
    expect(w.find('button').exists()).toBe(false)
  })

  it('disables cancel while busy and shows the empty state', () => {
    const busy = mount(PynOrgPendingInvitations, {
      props: { invitations: orgInvitations, busy: true },
    })
    expect(busy.find('button').attributes('disabled')).toBeDefined()
    const empty = mount(PynOrgPendingInvitations, { props: { invitations: [] } })
    expect(empty.find('table').exists()).toBe(false)
    expect(empty.text()).toContain('No pending invitations.')
  })
})

describe('orgAuditLabel', () => {
  it('labels the invitation actions and a direct add', () => {
    expect(orgAuditLabel('org_member_invited')).toBe('Member invited')
    expect(orgAuditLabel('org_invitation_accepted')).toBe('Invitation accepted')
    expect(orgAuditLabel('org_invitation_declined')).toBe('Invitation declined')
    expect(orgAuditLabel('org_invitation_cancelled')).toBe('Invitation cancelled')
    expect(orgAuditLabel('org_invitation_expired')).toBe('Invitation expired')
    expect(orgAuditLabel('org_member_added')).toBe('Member added directly')
  })

  it('falls back to the raw action', () => {
    expect(orgAuditLabel('org_created')).toBe('org_created')
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
  it('starts with the initial username and never fills the password', async () => {
    const w = mount(PynSignIn, { props: { registration: 'invite', initialUsername: 'lv' } })
    expect((w.find('input').element as HTMLInputElement).value).toBe('lv')
    expect((w.find('input[type="password"]').element as HTMLInputElement).value).toBe('')
  })

  it('takes a later initial username only while the field is untouched', async () => {
    const w = mount(PynSignIn, { props: { registration: 'invite' } })
    await w.setProps({ initialUsername: 'lv' })
    expect((w.find('input').element as HTMLInputElement).value).toBe('lv')
    await w.find('input').setValue('other')
    await w.setProps({ initialUsername: 'again' })
    expect((w.find('input').element as HTMLInputElement).value).toBe('other')
  })

  it('emits the typed name and shows its validation message', async () => {
    const w = mount(PynSignIn, { props: { registration: 'open' } })
    const input = w.find('input')
    await input.setValue('al ice')
    expect(w.emitted('nameInput')?.[0]).toEqual(['al ice'])
    expect(input.attributes('aria-invalid')).toBeUndefined()
    await w.setProps({ nameMessage: 'no spaces' })
    expect(input.attributes('aria-invalid')).toBe('true')
    const id = input.attributes('aria-describedby')!
    expect(w.find(`[id="${id}"]`).text()).toBe('no spaces')
  })

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
    expect(invite.findAll('input')).toHaveLength(4)
    await fill(invite, ['wendy', 'a long password', 'a long password', 'pyni_x'])
    await invite.find('form').trigger('submit')
    expect(invite.emitted('register')?.[0]).toEqual([
      { username: 'wendy', password: 'a long password', invite: 'pyni_x' },
    ])

    const open = mount(PynSignIn, { props: { registration: 'open' } })
    await click(open, 'Create an account')
    expect(open.findAll('input')).toHaveLength(3)
  })

  it('has no confirm field when signing in', () => {
    const w = mount(PynSignIn, { props: { registration: 'open' } })
    expect(w.text()).not.toContain('Confirm password')
    expect(w.findAll('input[type="password"]')).toHaveLength(1)
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('blocks registering while the passwords differ and says so', async () => {
    const w = mount(PynSignIn, { props: { registration: 'open' } })
    await click(w, 'Create an account')
    const [user, pw, again] = w.findAll('input')
    expect(pw.attributes('autocomplete')).toBe('new-password')
    expect(again.attributes('autocomplete')).toBe('new-password')
    await user.setValue('wendy')
    await pw.setValue('a long password')
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    expect(w.find('[role="alert"]').exists()).toBe(false)
    await again.setValue('a long passw')
    expect(again.attributes('aria-invalid')).toBe('true')
    const alert = w.find('[role="alert"]')
    expect(alert.text()).toBe('The passwords do not match.')
    expect(again.attributes('aria-describedby')).toBe(alert.attributes('id'))
    await w.find('form').trigger('submit')
    expect(w.emitted('register')).toBeUndefined()
    await again.setValue('a long password')
    expect(again.attributes('aria-invalid')).toBeUndefined()
    expect(w.find('[role="alert"]').exists()).toBe(false)
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
    await w.find('form').trigger('submit')
    expect(w.emitted('register')?.[0]).toEqual([{ username: 'wendy', password: 'a long password' }])
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
    expect(w.findAll('input')).toHaveLength(4)
    await fill(w, ['wendy', 'a long password', 'a long password', 'w@example.com'])
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
    expect(accountNavItems(true).map((i) => i.id)).toEqual([
      'password',
      'keys',
      'tokens',
      'identities',
    ])
  })

  it('lists Password first, then keys and tokens', () => {
    expect(accountNav.map((i) => [i.id, i.label, i.href])).toEqual([
      ['password', 'Password', '/_/settings/password'],
      ['keys', 'SSH keys', '/_/settings/keys'],
      ['tokens', 'Access tokens', '/_/settings/tokens'],
    ])
  })
})

describe('PynAdminLayout', () => {
  it('lists the administration pages, marks the current one and renders the page', () => {
    const w = mount(PynAdminLayout, {
      props: { items: adminNavItems(), current: 'audit' },
      slots: { default: '<p>content</p>' },
    })
    expect(w.find('nav').attributes('aria-label')).toBe('Server administration')
    expect(w.findAll('a').map((a) => [a.text(), a.attributes('href')])).toEqual([
      ['Accounts', '/_/admin/accounts'],
      ['Server access', '/_/admin/access'],
      ['Audit log', '/_/admin/audit'],
      ['Webhooks', '/_/admin/webhooks'],
    ])
    expect(w.find('a[aria-current="page"]').text()).toBe('Audit log')
    expect(w.text()).toContain('content')
  })

  it('shows one Server administration entry in the sidebar for administrators', () => {
    expect(navItems(false).some((i) => i.id === 'admin')).toBe(false)
    const item = navItems(true).at(-1)
    expect(item).toMatchObject({ id: 'admin', label: 'Server administration', href: '/_/admin' })
    expect(navItems(true).some((i) => i.id === 'accounts')).toBe(false)
  })
})

describe('PynPasswordForm', () => {
  const fill = async (w: ReturnType<typeof mount>, cur: string, next: string, conf: string) => {
    const inputs = w.findAll('input')
    await inputs[0].setValue(cur)
    await inputs[1].setValue(next)
    await inputs[2].setValue(conf)
    await w.find('form').trigger('submit')
  }
  const mountForm = (props = {}) =>
    mount(PynPasswordForm, {
      props: { minLength: 10, rules: ['At least 10 characters.'], ...props },
    })

  it('labels the fields, sets autocomplete and shows the rules', () => {
    const w = mountForm()
    expect(w.findAll('input').map((i) => i.attributes('autocomplete'))).toEqual([
      'current-password',
      'new-password',
      'new-password',
    ])
    expect(w.findAll('input').every((i) => i.attributes('type') === 'password')).toBe(true)
    expect(w.text()).toContain('Current password')
    expect(w.text()).toContain('Confirm new password')
    expect(w.find('ul').text()).toContain('At least 10 characters.')
  })

  it('emits current and next when valid', async () => {
    const w = mountForm()
    await fill(w, 'old-password', 'brand-new-pass', 'brand-new-pass')
    expect(w.emitted('submit')?.[0]).toEqual([{ current: 'old-password', next: 'brand-new-pass' }])
    expect(w.find('[role="alert"]').exists()).toBe(false)
  })

  it.each([
    ['', 'brand-new-pass', 'brand-new-pass', 'current password'],
    ['old-password', 'short', 'short', 'at least 10'],
    ['old-password', 'old-password', 'old-password', 'differ'],
    ['old-password', 'brand-new-pass', 'brand-new-pasS', 'do not match'],
  ])('blocks submit: %s / %s / %s', async (cur, next, conf, text) => {
    const w = mountForm()
    await fill(w, cur, next, conf)
    expect(w.emitted('submit')).toBeUndefined()
    expect(w.find('[role="alert"]').text()).toContain(text)
  })

  it('disables while busy and does not submit', async () => {
    const w = mountForm({ busy: true })
    expect(w.find('button').attributes('disabled')).toBeDefined()
    expect(w.findAll('input').every((i) => i.attributes('disabled') !== undefined)).toBe(true)
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')).toBeUndefined()
  })

  it('shows the server error and success, and clears the fields on success', async () => {
    const w = mountForm({ error: 'The current password is wrong.' })
    expect(w.find('[role="alert"]').text()).toBe('The current password is wrong.')
    await fill(w, 'old-password', 'brand-new-pass', 'brand-new-pass')
    await w.setProps({ success: 'Password changed.' })
    expect(w.find('[role="status"]').text()).toBe('Password changed.')
    expect(w.findAll('input').map((i) => (i.element as HTMLInputElement).value)).toEqual([
      '',
      '',
      '',
    ])
  })

  it('hides the current password and emits only next when the account has none', async () => {
    const w = mountForm({ hasPassword: false })
    expect(w.findAll('input')).toHaveLength(2)
    expect(w.text()).not.toContain('Current password')
    expect(w.find('button').text()).toBe('Set a password')
    const inputs = w.findAll('input')
    await inputs[0].setValue('brand-new-pass')
    await inputs[1].setValue('brand-new-pass')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0]).toEqual([{ next: 'brand-new-pass' }])
  })

  it('validates a first password without a current one', async () => {
    const w = mountForm({ hasPassword: false })
    const inputs = w.findAll('input')
    await inputs[0].setValue('brand-new-pass')
    await inputs[1].setValue('other-new-pass')
    await w.find('form').trigger('submit')
    expect(w.find('[role="alert"]').text()).toContain('do not match')
    expect(w.emitted('submit')).toBeUndefined()
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
  const [root, bob, carol, dave, erin] = accounts
  const props = { accounts, status: '' as const, self: 'root' }
  const buttons = (w: ReturnType<typeof mount>, text: string) =>
    w.findAll('button').filter((b) => b.text().startsWith(text))

  it('picks the actions the server accepts', () => {
    expect(accountActions(root, 'root')).toEqual([])
    expect(accountActions(root, 'other')).toEqual(['disable'])
    expect(accountActions(bob, 'root')).toEqual(['approve', 'disable'])
    expect(accountActions(carol, 'root')).toEqual(['disable'])
    expect(accountActions(dave, 'root')).toEqual(['enable', 'delete'])
    expect(accountActions(dave, 'dave')).toEqual(['enable'])
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

  it('emits reset for another account but not for oneself', async () => {
    const w = mount(PynAccounts, { props })
    await buttons(w, 'Reset two-factor')[0].trigger('click')
    expect(w.emitted('reset')?.[0]).toEqual([bob.user])
    const own = mount(PynAccounts, { props: { ...props, accounts: [root] } })
    expect(buttons(own, 'Reset two-factor')).toHaveLength(0)
  })

  it('has no disable button for the signed-in administrator', () => {
    const w = mount(PynAccounts, { props: { ...props, accounts: [root] } })
    expect(buttons(w, 'Disable')).toHaveLength(0)
  })

  it('shows the deletion deadline of a scheduled account', () => {
    const w = mount(PynAccounts, { props: { ...props, accounts: [erin] } })
    expect(w.text()).toContain('Deleted Dec 01 2026')
  })

  it('needs a reason to delete and emits it with the immediately choice', async () => {
    const w = mount(PynAccounts, { props: { ...props, accounts: [dave] } })
    await buttons(w, 'Delete')[0].trigger('click')
    const submit = buttons(w, 'Delete dave')[0]
    expect(submit.attributes('disabled')).toBeDefined()
    await w.find('input[placeholder="Reason (required)"]').setValue(' Gone ')
    await w.find('input[type="checkbox"]').setValue(true)
    await w.find('form').trigger('submit')
    expect(w.emitted('delete')?.[0]).toEqual([{ user: 'dave', reason: 'Gone', immediately: true }])
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

  it('picks the administrator action', () => {
    const [, frank, gina] = adminAccounts
    expect(adminAction(frank, 'root')).toBe('grant')
    expect(adminAction(gina, 'root')).toBe('revoke')
    expect(adminAction(gina, 'root', false)).toBeNull()
    expect(adminAction(root, 'root')).toBeNull()
    expect(adminAction(bob, 'root')).toBeNull()
    expect(adminAction(carol, 'root')).toBeNull()
    expect(adminAction(dave, 'root')).toBeNull()
  })

  it('emits grantAdmin and revokeAdmin with the user', async () => {
    const w = mount(PynAccounts, { props: { ...props, accounts: adminAccounts } })
    expect(w.findAll('.pill, span').some((s) => s.text() === 'admin')).toBe(true)
    await buttons(w, 'Make administrator')[0].trigger('click')
    await buttons(w, 'Remove administrator')[0].trigger('click')
    expect(w.emitted('grantAdmin')).toEqual([['frank']])
    expect(w.emitted('revokeAdmin')).toEqual([['gina']])
    expect(buttons(w, 'Make administrator')).toHaveLength(1)
    expect(buttons(w, 'Remove administrator')).toHaveLength(1)
  })

  it('hides revoke with canRevokeAdmin false and disables both while busy', async () => {
    const w = mount(PynAccounts, {
      props: { ...props, accounts: adminAccounts, canRevokeAdmin: false },
    })
    expect(buttons(w, 'Remove administrator')).toHaveLength(0)
    expect(buttons(w, 'Make administrator')).toHaveLength(1)
    await w.setProps({ canRevokeAdmin: true, busy: true })
    for (const b of [...buttons(w, 'Make administrator'), ...buttons(w, 'Remove administrator')])
      expect(b.attributes('disabled')).toBeDefined()
  })

  it('offers no grant on pending or disabled accounts', () => {
    const w = mount(PynAccounts, { props })
    expect(buttons(w, 'Make administrator')).toHaveLength(0)
    expect(buttons(w, 'Remove administrator')).toHaveLength(0)
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

  it('notice is a status, warning by default, with an optional title', () => {
    const w = mount(PynViewNotice, { slots: { default: 'Heads up <a href="/x">link</a>' } })
    expect(w.attributes('role')).toBe('status')
    expect(w.find('h3').exists()).toBe(false)
    expect(w.find('a').text()).toBe('link')
    const info = mount(PynViewNotice, { props: { tone: 'info', title: 'FYI' } })
    expect(info.find('h3').text()).toBe('FYI')
    expect(info.classes()).not.toEqual(w.classes())
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
    owner: 'acme',
    repository_access: { mode: 'selected' as const, repos: ['acme/game'] },
    permissions: [
      { resource: 'metadata', level: 'read' as const },
      { resource: 'locks', level: 'write' as const },
    ],
    sign_in: false,
    created_at: '2026-10-08T09:00:00Z',
    expires_at: null,
    last_used_at: null,
  },
  {
    id: 'bbbbbbbbbbbb',
    user: 'alice',
    name: 'old',
    owner: 'alice',
    repository_access: { mode: 'all' as const },
    permissions: [],
    sign_in: false,
    created_at: '2026-10-01T09:00:00Z',
    revoked_at: '2026-10-02T09:00:00Z',
  },
]
const tokenOwners = [
  { name: 'alice', kind: 'account' as const },
  { name: 'acme', kind: 'org' as const },
]
const tokenProps = {
  owners: tokenOwners,
  repos: ['acme/game', 'acme/tools'],
  now: '2026-11-18T12:00:00Z',
}

describe('token state', () => {
  it('turns a date into an end-of-day expiry', () => {
    expect(expiryFromDate('2027-01-01')).toBe('2027-01-01T23:59:59Z')
    expect(expiryFromDate('')).toBeNull()
  })

  it('computes expiry dates from the choice', () => {
    const now = new Date('2026-11-18T12:00:00Z')
    expect(expiryAfter(now, 30)).toBe('2026-12-18T12:00:00.000Z')
    expect(expiryPreview(TOKEN_EXPIRY_CHOICES[1], now)).toBe('Dec 18 2026')
    expect(expiryPreview(TOKEN_EXPIRY_CHOICES[5], now)).toBeNull()
  })

  it('offers resources by owner kind and repository access', () => {
    const names = (k: 'account' | 'org', m: 'public' | 'all') =>
      availableResources(k, m).map((r) => r.resource)
    expect(names('account', 'public')).toEqual([
      'account_profile',
      'account_ssh_keys',
      'account_locks',
    ])
    expect(names('org', 'public')).toEqual([
      'org_members',
      'org_teams',
      'org_administration',
      'org_audit',
    ])
    expect(names('org', 'all')).toContain('metadata')
    expect(names('org', 'all')).not.toContain('account_locks')
  })

  it('adds metadata read only with a repository permission', () => {
    expect(buildPermissions({ contents: 'write' }, 'account', 'all')).toEqual([
      { resource: 'metadata', level: 'read' },
      { resource: 'contents', level: 'write' },
    ])
    expect(buildPermissions({ account_locks: 'read' }, 'account', 'all')).toEqual([
      { resource: 'account_locks', level: 'read' },
    ])
    expect(buildPermissions({ contents: 'read' }, 'account', 'public')).toEqual([])
  })

  it('filters repositories', () => {
    expect(filterRepos(['a/Game', 'a/tools'], ' game ')).toEqual(['a/Game'])
    expect(filterRepos(['a/b'], '')).toEqual(['a/b'])
  })
})

describe('PynTokens', () => {
  it('lists owner, access, grants and expiry and only offers revoke for live ones', () => {
    const w = mount(PynTokens, { props: { tokens: tokenList, ...tokenProps } })
    expect(w.text()).toContain('Owner acme')
    expect(w.text()).toContain('1 selected repository')
    expect(w.text()).toContain('acme/game')
    expect(w.text()).toContain('locks: write')
    expect(w.text()).toContain('never expires')
    expect(w.text()).toContain('revoked')
    expect(w.findAll('button').filter((b) => b.text() === 'Revoke')).toHaveLength(1)
  })

  it('says so when there are no tokens', () => {
    const w = mount(PynTokens, { props: { tokens: [], ...tokenProps } })
    expect(w.text()).toContain('No tokens yet')
  })

  it('opens the form and relays its events', async () => {
    const w = mount(PynTokens, { props: { tokens: [], ...tokenProps } })
    expect(w.find('form').exists()).toBe(false)
    await w.find('button').trigger('click')
    expect(w.find('form').exists()).toBe(true)
    await w.find('select').setValue('acme')
    expect(w.emitted('owner-change')?.[0]).toEqual(['acme'])
  })

  it('shows the secret once and closes the form', async () => {
    const w = mount(PynTokens, { props: { tokens: [], ...tokenProps } })
    await w.find('button').trigger('click')
    await w.setProps({ secret: 'pyn_abc' })
    expect(w.text()).toContain('pyn_abc')
    expect(w.find('form').exists()).toBe(false)
    await w.find('[role=status] button').trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
  })

  it('emits the id to revoke', async () => {
    const w = mount(PynTokens, { props: { tokens: tokenList, ...tokenProps } })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Revoke')!
      .trigger('click')
    expect(w.emitted('revoke')?.[0]).toEqual(['aaaaaaaaaaaa'])
  })
})

describe('PynTokenForm', () => {
  const radio = (w: ReturnType<typeof mount>, v: string) => w.find(`input[type=radio][value=${v}]`)

  it('shows computed dates and the default expiry', () => {
    const w = mount(PynTokenForm, { props: tokenProps })
    expect(w.text()).toContain('30 days (Dec 18 2026) (default)')
    expect(w.text()).toContain('Expires Dec 18 2026.')
  })

  it('warns on a token that never expires', async () => {
    const w = mount(PynTokenForm, { props: tokenProps })
    await w.findAll('select')[1].setValue('never')
    expect(w.find('[role=note]').text()).toContain('never expires')
  })

  it('refuses an incomplete form with a reason', async () => {
    const w = mount(PynTokenForm, { props: tokenProps })
    await w.find('form').trigger('submit')
    expect(w.find('[role=alert]').text()).toContain('name')
    await w.find('input').setValue('ci')
    await radio(w, 'selected').setValue(true)
    await w.find('form').trigger('submit')
    expect(w.find('[role=alert]').text()).toContain('repository')
    expect(w.emitted('submit')).toBeUndefined()
  })

  it('offers no repository permissions for public access', async () => {
    const w = mount(PynTokenForm, { props: tokenProps })
    expect(w.text()).toContain('Public access takes no repository permissions')
    expect(w.text()).not.toContain('Contents')
    await radio(w, 'all').setValue(true)
    expect(w.text()).toContain('Contents')
    expect(w.text()).not.toContain('Organization members')
  })

  it('swaps permissions with the owner and clears the selection', async () => {
    const w = mount(PynTokenForm, { props: tokenProps })
    await w.findAll('select')[0].setValue('acme')
    expect(w.text()).toContain('Organization members')
    expect(w.text()).not.toContain('Your locks')
  })

  it('searches, selects and removes repositories', async () => {
    const w = mount(PynTokenForm, { props: tokenProps })
    await radio(w, 'selected').setValue(true)
    await w.find('input[type=search]').setValue('tools')
    const match = w.findAll('button').filter((b) => b.text() === 'acme/tools')
    expect(match).toHaveLength(1)
    await match[0].trigger('click')
    expect(w.find('[aria-label="Selected repositories"]').text()).toContain('acme/tools')
    await w.find('[aria-label="Remove acme/tools"]').trigger('click')
    expect(w.find('[aria-label="Selected repositories"]').exists()).toBe(false)
  })

  it('emits the request with metadata added and the default expiry omitted', async () => {
    const w = mount(PynTokenForm, { props: tokenProps })
    await w.find('input').setValue(' ci ')
    await radio(w, 'selected').setValue(true)
    await w.find('input[type=search]').setValue('game')
    await w
      .findAll('button')
      .find((b) => b.text() === 'acme/game')!
      .trigger('click')
    await w.find('select[id$=contents]').setValue('write')
    await w.find('select[id$=locks]').setValue('admin')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0]).toEqual([
      {
        name: 'ci',
        owner: 'alice',
        repository_access: { mode: 'selected', repos: ['acme/game'] },
        permissions: [
          { resource: 'metadata', level: 'read' },
          { resource: 'contents', level: 'write' },
          { resource: 'locks', level: 'admin' },
        ],
      },
    ])
  })

  it('emits a custom date or never', async () => {
    const w = mount(PynTokenForm, { props: tokenProps })
    await w.find('input').setValue('ci')
    await w.find('select[id$=account_ssh_keys]').setValue('read')
    await w.findAll('select')[1].setValue('custom')
    await w.find('input[type=date]').setValue('2027-01-01')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0][0]).toMatchObject({ expires_at: '2027-01-01T23:59:59Z' })
    await w.findAll('select')[1].setValue('never')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[1][0]).toMatchObject({ never: true })
    expect(w.emitted('submit')?.[1][0]).not.toHaveProperty('expires_at')
  })

  it('rejects a past custom date and shows the server error', async () => {
    const w = mount(PynTokenForm, { props: { ...tokenProps, error: 'nope' } })
    await w.find('input').setValue('ci')
    await w.find('select[id$=account_ssh_keys]').setValue('read')
    await w.findAll('select')[1].setValue('custom')
    await w.find('input[type=date]').setValue('2020-01-01')
    await w.find('form').trigger('submit')
    expect(w.find('[role=alert]').text()).toContain('future')
    expect(w.emitted('submit')).toBeUndefined()
    await w.find('input[type=date]').setValue('2027-01-01')
    expect(w.find('[role=alert]').text()).toBe('nope')
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

  it('emits the typed administrator name and shows its validation message', async () => {
    const w = mount(PynSetup, { props: { registration: 'closed' } })
    await next(w)
    await w.find('input').setValue('tok')
    await next(w)
    const input = w.find('input')
    await input.setValue('ro ot')
    expect(w.emitted('nameInput')?.[0]).toEqual(['ro ot'])
    expect(input.attributes('aria-invalid')).toBeUndefined()
    await w.setProps({ nameMessage: 'no spaces' })
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(w.find(`[id="${input.attributes('aria-describedby')}"]`).text()).toBe('no spaces')
  })

  it('walks every step and emits the form on finish', async () => {
    const w = mount(PynSetup, { props: { registration: 'closed', publicUrl: 'http://x' } })
    expect(w.text()).toContain('Step 1 of 6')
    await next(w)
    await w.find('input').setValue('tok')
    await next(w)
    const [user, pass] = w.findAll('input')
    await user.setValue('root')
    await pass.setValue('pw')
    await w.findAll('input')[2].setValue('pw')
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

  it('asks for the password twice and blocks continuing until they match', async () => {
    const w = mount(PynSetup, { props: { registration: 'closed' } })
    await next(w)
    await w.find('input').setValue('tok')
    await next(w)
    const [user, pass, confirm] = w.findAll('input')
    expect(pass.attributes('autocomplete')).toBe('new-password')
    expect(confirm.attributes('autocomplete')).toBe('new-password')
    await user.setValue('root')
    await pass.setValue('secret')
    expect(w.find('[role=alert]').exists()).toBe(false)
    expect(w.find('button[type=submit]').attributes('disabled')).toBeDefined()
    await confirm.setValue('secrex')
    const msg = w.find('[role=alert]')
    expect(msg.text()).toBe('The passwords do not match.')
    expect(confirm.attributes('aria-invalid')).toBe('true')
    expect(confirm.attributes('aria-describedby')).toBe(msg.attributes('id'))
    await next(w)
    expect(w.text()).toContain('Step 3 of 6')
    await confirm.setValue('secret')
    expect(w.find('[role=alert]').exists()).toBe(false)
    expect(w.find('button[type=submit]').attributes('disabled')).toBeUndefined()
    await next(w)
    expect(w.text()).toContain('Step 4 of 6')
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

describe('PynSetup second administrator', () => {
  it('shows no suggestion by default', () => {
    const w = mount(PynSetup, { props: { registration: 'closed', done: true } })
    expect(w.text()).not.toContain('accounts administration page')
    expect(w.findAll('button')).toHaveLength(1)
  })

  it('suggests it when asked and emits manageAdmins without signing in', async () => {
    const w = mount(PynSetup, {
      props: { registration: 'closed', done: true, suggestSecondAdmin: true },
    })
    expect(w.text()).toContain('second administrator')
    await w.findAll('button')[0].trigger('click')
    expect(w.emitted('manageAdmins')).toHaveLength(1)
    expect(w.emitted('signIn')).toBeUndefined()
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('signIn')).toHaveLength(1)
  })
})

describe('PynPolicyEditor', () => {
  it('labels the textarea, shows the head revision and updates the model', async () => {
    const w = mount(PynPolicyEditor, { props: { text: 'a', headRevision: 7 } })
    const ta = w.find('textarea')
    expect(w.find(`label[for="${ta.attributes('id')}"]`).exists()).toBe(true)
    expect(w.text()).toContain('Head revision 7')
    await ta.setValue('b')
    expect(w.emitted('update:text')?.[0]).toEqual(['b'])
  })

  it('enables save and revert only when dirty and emits events', async () => {
    const w = mount(PynPolicyEditor, { props: { text: 'a' } })
    expect(w.findAll('button').every((b) => b.attributes('disabled') !== undefined)).toBe(true)
    await w.setProps({ dirty: true })
    const [save, revert] = w.findAll('button')
    await save.trigger('click')
    await revert.trigger('click')
    expect(w.emitted('save')).toHaveLength(1)
    expect(w.emitted('revert')).toHaveLength(1)
    expect(w.text()).toContain('Unsaved changes')
  })

  it.each([['saving'], ['readonly'], ['disabled']] as const)('blocks saving when %s', (flag) => {
    const w = mount(PynPolicyEditor, { props: { text: 'a', dirty: true, [flag]: true } })
    expect(w.findAll('button').every((b) => b.attributes('disabled') !== undefined)).toBe(true)
  })

  it('saves on Ctrl/Cmd+S only when dirty and always blocks the browser dialog', async () => {
    const w = mount(PynPolicyEditor, { props: { text: 'a' } })
    const ta = w.find('textarea')
    const press = async (init: KeyboardEventInit) => {
      const e = new KeyboardEvent('keydown', { cancelable: true, bubbles: true, ...init })
      ta.element.dispatchEvent(e)
      await w.vm.$nextTick()
      return e.defaultPrevented
    }
    expect(await press({ key: 's', ctrlKey: true })).toBe(true)
    expect(w.emitted('save')).toBeUndefined()
    await w.setProps({ dirty: true })
    expect(await press({ key: 's', ctrlKey: true })).toBe(true)
    expect(await press({ key: 'S', metaKey: true })).toBe(true)
    expect(await press({ key: 's' })).toBe(false)
    expect(w.emitted('save')).toHaveLength(2)
    await w.setProps({ readonly: true })
    await press({ key: 's', ctrlKey: true })
    expect(w.emitted('save')).toHaveLength(2)
  })

  it('highlights TOML tokens and numbers the lines', () => {
    const w = mount(PynPolicyEditor, {
      props: { text: '# c\n[[rule]]\npath = "a#b"\nn = 3\nok = true' },
    })
    expect(w.findAll('[aria-hidden="true"] > div > div').length).toBeGreaterThan(0)
    const kinds = (n: number) =>
      w
        .findAll('[data-token]')
        .filter(
          (t) => t.element.closest('div')!.parentElement!.children[n] === t.element.closest('div'),
        )
        .map((t) => `${t.attributes('data-token')}:${t.text()}`)
    expect(kinds(0)).toEqual(['comment:# c'])
    expect(kinds(1)).toEqual(['table:[[rule]]'])
    expect(kinds(2)).toContain('string:"a#b"')
    expect(kinds(3)).toContain('number:3')
    expect(kinds(4)).toContain('boolean:true')
    expect(w.text()).toContain('5')
  })

  it('marks the lines named in problemLines', () => {
    const w = mount(PynPolicyEditor, { props: { text: 'a\nb\nc', problemLines: [2] } })
    expect(w.findAll('[data-invalid]')).toHaveLength(2)
    expect(w.findAll('[data-invalid]').map((e) => e.text())).toEqual(['2', 'b'])
  })

  it('shows a problem message on hover and on caret focus, without mixing lines', async () => {
    const w = mount(PynPolicyEditor, {
      props: {
        text: 'a\nb\nc',
        problems: [
          { line: 2, message: 'bad mode' },
          { line: 2, message: 'bad path' },
          { message: 'general' },
        ],
      },
    })
    expect(w.findAll('[data-invalid]').map((e) => e.text())).toEqual(['2', 'b'])
    expect(w.find('[data-invalid][title]').attributes('title')).toBe('bad mode; bad path')
    expect(w.find('[role=status]').exists()).toBe(false)
    const ta = w.find('textarea')
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      lineHeight: '20px',
      paddingTop: '4px',
    } as CSSStyleDeclaration)
    await ta.trigger('mousemove', { clientY: 30 })
    expect(ta.attributes('title')).toBe('bad mode; bad path')
    expect(w.find('[role=status]').text()).toBe('Line 2: bad mode; bad path')
    await ta.trigger('mousemove', { clientY: 5 })
    expect(ta.attributes('title')).toBeUndefined()
    expect(w.find('[role=status]').exists()).toBe(false)
    ;(ta.element as HTMLTextAreaElement).setSelectionRange(2, 2)
    await ta.trigger('keyup')
    expect(w.find('[role=status]').text()).toContain('Line 2')
    expect(ta.attributes('aria-describedby')).toBe(w.find('[role=status]').attributes('id'))
    await ta.trigger('blur')
    expect(w.find('[role=status]').exists()).toBe(false)
    vi.restoreAllMocks()
  })

  it('makes the textarea read-only or disabled and renders the notice slot', () => {
    const ro = mount(PynPolicyEditor, {
      props: { text: 'a', readonly: true },
      slots: { notice: '<p id="n">x</p>' },
    })
    expect(ro.find('textarea').attributes('readonly')).toBeDefined()
    expect(ro.find('#n').exists()).toBe(true)
    const dis = mount(PynPolicyEditor, { props: { text: 'a', disabled: true } })
    expect(dis.find('textarea').attributes('disabled')).toBeDefined()
  })
})

describe('PynPolicyConflictNotice', () => {
  it.each([
    ['lock_required', 'Take lock', 'takeLock'],
    ['lock_required', 'Discard changes', 'discard'],
    ['lock_held', 'Reload latest', 'reload'],
    ['lock_held', 'Discard changes', 'discard'],
    ['stale_base', 'Reload latest', 'reload'],
    ['stale_base', 'Keep editing', 'dismiss'],
    ['invalid_rules', 'Keep editing', 'dismiss'],
    ['error', 'Try again', 'retry'],
    ['error', 'Keep editing', 'dismiss'],
  ] as const)('%s: "%s" emits %s', async (kind, label, event) => {
    const w = mount(PynPolicyConflictNotice, { props: { kind } })
    expect(w.attributes('role')).toBe('alert')
    await w
      .findAll('button')
      .find((b) => b.text() === label)!
      .trigger('click')
    expect(w.emitted(event)).toHaveLength(1)
  })

  it('shows the holder, the problems and the error message', () => {
    expect(
      mount(PynPolicyConflictNotice, { props: { kind: 'lock_held', holder: 'wendy' } }).text(),
    ).toContain('wendy')
    const bad = mount(PynPolicyConflictNotice, {
      props: {
        kind: 'invalid_rules',
        problems: [{ line: 4, message: 'bad mode' }, { message: 'no default' }],
      },
    })
    expect(bad.findAll('li')).toHaveLength(2)
    expect(bad.text()).toContain('Line 4')
    expect(bad.text()).toContain('bad mode')
    expect(
      mount(PynPolicyConflictNotice, { props: { kind: 'error', message: 'boom' } }).text(),
    ).toContain('boom')
  })

  it('disables the actions that change state while busy', () => {
    const w = mount(PynPolicyConflictNotice, { props: { kind: 'lock_required', busy: true } })
    expect(w.findAll('button').every((b) => b.attributes('disabled') !== undefined)).toBe(true)
  })
})

describe('PynPolicyPreview', () => {
  const preview = {
    to_exclusive: ['art/a.psd', 'art/b.psd'],
    to_shared: ['docs/x.md'],
    released_locks: [
      {
        path: 'docs/x.md',
        owner: 'wendy',
        acquired_at: '2026-10-26T09:00:00Z',
        expires_at: '2026-10-26T17:00:00Z',
      },
    ],
    stranded: [],
  }

  it('lists changed paths with from and to modes and counts per direction', () => {
    const w = mount(PynPolicyPreview, { props: { preview } })
    const rows = w.findAll('tbody tr:not([data-group])')
    expect(rows).toHaveLength(3)
    expect(rows[0].findAll('[data-mode]').map((c) => c.attributes('data-mode'))).toEqual([
      'shared',
      'exclusive',
    ])
    expect(rows[2].findAll('[data-mode]').map((c) => c.attributes('data-mode'))).toEqual([
      'exclusive',
      'shared',
    ])
    expect(w.text()).toContain('2 paths become exclusive')
    expect(w.text()).toContain('1 path become shared')
    expect(w.text()).toContain('1 lock would be released')
    expect(w.text()).toContain('held by wendy')
    expect(w.find('[data-section="stranded"]').exists()).toBe(false)
  })

  it('renders disagreement groups per kind and emits selectPath', async () => {
    const both = mount(PynPolicyPreview, {
      props: {
        preview: {
          ...preview,
          disagreements: [
            { path: 'a.psd', kind: 'lockable_shared' as const },
            { path: 'b.map', kind: 'exclusive_not_lockable' as const },
          ],
        },
      },
    })
    const sec = both.find('[data-section="disagreements"]')
    expect(sec.text()).toContain('2 paths where lockable and mode disagree')
    expect(sec.find('[data-kind="lockable_shared"]').text()).toContain('lockable, shared')
    expect(sec.find('[data-kind="exclusive_not_lockable"]').text()).toContain(
      'exclusive, not lockable',
    )
    await sec.find('[data-kind="exclusive_not_lockable"] button').trigger('click')
    expect(both.emitted('selectPath')![0]).toEqual(['b.map'])
    const one = mount(PynPolicyPreview, {
      props: {
        preview: {
          ...preview,
          disagreements: [{ path: 'a.psd', kind: 'lockable_shared' as const }],
        },
      },
    })
    expect(one.findAll('[data-kind]').map((g) => g.attributes('data-kind'))).toEqual([
      'lockable_shared',
    ])
  })

  it('renders no disagreements section when empty or absent', () => {
    expect(
      mount(PynPolicyPreview, { props: { preview } })
        .find('[data-section="disagreements"]')
        .exists(),
    ).toBe(false)
    const w = mount(PynPolicyPreview, { props: { preview: { ...preview, disagreements: [] } } })
    expect(w.find('[data-section="disagreements"]').exists()).toBe(false)
  })

  it('uses a visually hidden caption and shows lock expiry', () => {
    const w = mount(PynPolicyPreview, { props: { preview } })
    expect(w.find('table').attributes('aria-label')).toBeUndefined()
    expect(w.find('table caption').text()).toBe('Paths that change mode')
    expect(w.find('[data-section="locks"]').text()).toMatch(/expires Oct 2\d 2026/)
  })

  it('filters a large preview by direction and folder', async () => {
    const mk = (d: string, n: number) => Array.from({ length: n }, (_, i) => `${d}/f${i}`)
    const big = {
      to_exclusive: [...mk('art', 7), ...mk('lvl', 3), 'top.psd'],
      to_shared: mk('docs', 2),
      released_locks: [],
    }
    expect(mount(PynPolicyPreview, { props: { preview } }).find('select').exists()).toBe(false)
    const w = mount(PynPolicyPreview, { props: { preview: big } })
    expect(w.findAll('tbody tr:not([data-group])')).toHaveLength(13)
    const [dir, folder] = w.findAll('select')
    expect(folder.findAll('option').map((o) => o.text())).toEqual([
      'All',
      '(root)',
      'art',
      'docs',
      'lvl',
    ])
    await dir.setValue('shared')
    expect(w.findAll('tbody tr:not([data-group])')).toHaveLength(2)
    expect(w.find('[role="status"]').text()).toBe('Showing 2 of 13')
    await dir.setValue('all')
    await folder.setValue('art')
    expect(w.findAll('tbody tr:not([data-group])')).toHaveLength(7)
  })

  it('groups rows by folder and filters at any depth', async () => {
    const mk = (d: string, n: number) => Array.from({ length: n }, (_, i) => `${d}/f${i}`)
    const deep = {
      to_exclusive: [...mk('art/chars', 6), ...mk('art/props', 3), 'top.psd'],
      to_shared: mk('docs/design', 2),
      released_locks: [],
    }
    const w = mount(PynPolicyPreview, { props: { preview: deep } })
    expect(w.findAll('[data-group]').map((g) => g.find('th').text())).toEqual([
      '(root) 1 path',
      'art/chars 6 paths',
      'art/props 3 paths',
      'docs/design 2 paths',
    ])
    const folder = w.findAll('select')[1]
    expect(folder.findAll('option').map((o) => o.text())).toEqual([
      'All',
      '(root)',
      'art',
      'art/chars',
      'art/props',
      'docs',
      'docs/design',
    ])
    await folder.setValue('art')
    expect(w.findAll('tbody tr:not([data-group])')).toHaveLength(9)
    await folder.setValue('art/props')
    expect(w.findAll('tbody tr:not([data-group])')).toHaveLength(3)
    await folder.setValue('(root)')
    expect(w.findAll('tbody tr:not([data-group])')).toHaveLength(1)
  })

  it('shows the empty, loading and error states', async () => {
    const empty = mount(PynPolicyPreview, {
      props: { preview: { to_exclusive: [], to_shared: [], released_locks: [] } },
    })
    expect(empty.text()).toContain('No paths change mode')
    expect(empty.find('table').exists()).toBe(false)

    const loading = mount(PynPolicyPreview, { props: { loading: true } })
    expect(loading.find('[role="status"]').exists()).toBe(true)
    expect(loading.find('[aria-live="polite"]').exists()).toBe(true)

    const failed = mount(PynPolicyPreview, { props: { error: 'boom' } })
    expect(failed.find('[role="alert"]').text()).toContain('boom')
    await failed.find('[role="alert"] button').trigger('click')
    expect(failed.emitted('retry')).toHaveLength(1)
  })

  it('emits selectPath, confirm and back, and gates confirm', async () => {
    const w = mount(PynPolicyPreview, { props: { preview } })
    await w.find('tbody button').trigger('click')
    expect(w.emitted('selectPath')![0]).toEqual(['art/a.psd'])
    const [save, back] = w.findAll('button').slice(-2)
    await save.trigger('click')
    await back.trigger('click')
    expect(w.emitted('confirm')).toHaveLength(1)
    expect(w.emitted('back')).toHaveLength(1)
    for (const props of [{ loading: true }, { error: 'x' }, { busy: true }, { preview: null }]) {
      const g = mount(PynPolicyPreview, { props: { preview, ...props } })
      expect(g.findAll('button').at(-2)!.attributes('disabled')).toBeDefined()
    }
  })
})

const deliveries = [
  {
    id: 'd1',
    status: 'pending' as const,
    attempts: 1,
    created_at: '2026-10-08T09:00:00Z',
    next_attempt_at: '2026-10-08T09:05:00Z',
    last_status_code: 503,
    last_error: 'upstream unavailable',
    event_id: 'e1',
  },
  {
    id: 'd2',
    status: 'failed' as const,
    attempts: 5,
    created_at: '2026-10-07T09:00:00Z',
    failed_at: '2026-10-07T10:00:00Z',
    next_attempt_at: '2026-10-07T10:00:00Z',
    last_error: `connection refused ${'x'.repeat(80)}`,
    event_id: 'e2',
  },
  {
    id: 'd3',
    status: 'delivered' as const,
    attempts: 1,
    created_at: '2026-10-06T09:00:00Z',
    delivered_at: '2026-10-06T09:00:02Z',
    next_attempt_at: '2026-10-06T09:00:00Z',
    last_status_code: 200,
    event_id: 'e3',
  },
]

describe('PynWebhookDeliveries', () => {
  const mountIt = (props = {}) =>
    mount(PynWebhookDeliveries, {
      props: { deliveries, canRedeliver: true, ...props },
      attachTo: document.body,
    })

  it('renders a captioned table with next attempt for pending only', () => {
    const w = mountIt()
    expect(w.find('caption').text()).toBe('Webhook deliveries')
    const rows = w.findAll('tbody tr')
    expect(rows).toHaveLength(3)
    expect(rows[0].findAll('td')[2].text()).toContain('2026')
    expect(rows[1].findAll('td')[2].text()).toBe('')
    expect(rows[0].findAll('td')[3].text()).toBe('503')
    expect(rows[1].text()).toContain('Failed')
    expect(rows[2].text()).toContain('Delivered')
    w.unmount()
  })

  it('exposes long errors in full on expand', () => {
    const w = mountIt()
    expect(w.findAll('details')).toHaveLength(1)
    expect(w.find('details pre').text()).toContain('x'.repeat(80))
    expect(w.find('summary').text().endsWith('…')).toBe(true)
    w.unmount()
  })

  it('has a labelled status filter that emits the value', async () => {
    const w = mountIt({ status: 'failed' })
    const select = w.find('select')
    expect(w.find(`label[for="${select.attributes('id')}"]`).text()).toBe('Status')
    expect((select.element as HTMLSelectElement).value).toBe('failed')
    await select.setValue('')
    expect(w.emitted('filter')?.[0]).toEqual([''])
    w.unmount()
  })

  it('hides redeliver unless allowed', () => {
    const w = mountIt({ canRedeliver: false })
    expect(w.text()).not.toContain('Redeliver')
    expect(w.findAll('th')).toHaveLength(7)
    w.unmount()
  })

  it('emits redeliver only after confirmation, moving focus into the dialog', async () => {
    const w = mountIt()
    const trigger = w.findAll('tbody button')[1]
    await trigger.trigger('click')
    expect(w.emitted('redeliver')).toBeUndefined()
    const dialog = w.find('[role=alertdialog]')
    expect(dialog.attributes('aria-labelledby')).toBeTruthy()
    expect(document.activeElement?.textContent?.trim()).toBe('Cancel')
    await dialog.findAll('button')[0].trigger('click')
    expect(w.emitted('redeliver')?.[0]).toEqual(['d2'])
    expect(w.find('[role=alertdialog]').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger.element)
    w.unmount()
  })

  it('cancels with Escape and returns focus without emitting', async () => {
    const w = mountIt()
    const trigger = w.findAll('tbody button')[0]
    await trigger.trigger('click')
    await w.find('[role=alertdialog]').trigger('keydown', { key: 'Escape' })
    expect(w.emitted('redeliver')).toBeUndefined()
    expect(w.find('[role=alertdialog]').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger.element)
    w.unmount()
  })

  it('disables redelivery while one is running', () => {
    const w = mountIt({ redeliveringId: 'd2' })
    const buttons = w.findAll('tbody button')
    expect(buttons.every((b) => b.attributes('disabled') !== undefined)).toBe(true)
    expect(buttons[1].text()).toBe('Redelivering…')
    w.unmount()
  })

  it('shows loading, empty and error states and pages', async () => {
    let w = mountIt({ deliveries: [], loading: true })
    expect(w.find('[role=status]').text()).toContain('Loading')
    w.unmount()
    w = mountIt({ deliveries: [], error: 'boom' })
    expect(w.find('[role=alert]').text()).toBe('boom')
    expect(w.text()).toContain('No matching deliveries')
    w.unmount()
    w = mountIt({ hasMore: true })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Load more')!
      .trigger('click')
    expect(w.emitted('load-more')).toHaveLength(1)
    w.unmount()
  })
})

describe('PynDrawer', () => {
  const mountIt = (props = {}) =>
    mount(PynDrawer, {
      props: { open: true, title: 'Details', ...props },
      slots: { default: '<button>One</button><button>Two</button>', footer: '<span>foot</span>' },
      attachTo: document.body,
    })

  it('renders a labelled modal dialog with a footer slot', () => {
    const w = mountIt({ width: '20rem' })
    const d = w.find('[role="dialog"]')
    expect(d.attributes('aria-modal')).toBe('true')
    expect(w.find(`#${d.attributes('aria-labelledby')}`).text()).toBe('Details')
    expect(w.text()).toContain('foot')
    expect(d.attributes('style')).toContain('20rem')
    w.unmount()
  })

  it('renders nothing when closed and omits an empty footer', () => {
    const closed = mountIt({ open: false })
    expect(closed.find('[role="dialog"]').exists()).toBe(false)
    closed.unmount()
    const w = mount(PynDrawer, { props: { open: true, title: 'x' }, attachTo: document.body })
    expect(w.find('footer').exists()).toBe(false)
    w.unmount()
  })

  it('emits close from Escape, the close button and the backdrop', async () => {
    const w = mountIt()
    await w.find('[role="dialog"]').trigger('keydown', { key: 'Escape' })
    await w.find('button[aria-label="Close"]').trigger('click')
    await w.find('[data-test="backdrop"]').trigger('click')
    expect(w.emitted('close')).toHaveLength(3)
    w.unmount()
  })

  it('moves focus in on open and back to the opener on close, locking page scroll', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const w = mountIt({ open: false })
    await w.setProps({ open: true })
    await w.vm.$nextTick()
    expect(document.activeElement).toBe(w.find('[role="dialog"]').element)
    expect(document.body.style.overflow).toBe('hidden')
    await w.setProps({ open: false })
    await w.vm.$nextTick()
    expect(document.activeElement).toBe(opener)
    expect(document.body.style.overflow).toBe('')
    w.unmount()
    opener.remove()
  })

  it('wraps Tab and Shift+Tab inside the panel', async () => {
    const w = mountIt()
    await w.vm.$nextTick()
    const buttons = w.findAll('button')
    const last = buttons[buttons.length - 1].element as HTMLElement
    const close = w.find('button[aria-label="Close"]').element as HTMLElement
    last.focus()
    await w.find('[role="dialog"]').trigger('keydown', { key: 'Tab' })
    expect(document.activeElement).toBe(close)
    await w.find('[role="dialog"]').trigger('keydown', { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)
    w.unmount()
  })

  it('restores page scroll if unmounted while open', () => {
    const w = mountIt()
    expect(document.body.style.overflow).toBe('hidden')
    w.unmount()
    expect(document.body.style.overflow).toBe('')
  })
})

const subscriptions = [
  {
    id: 1,
    name: 'CI notifier',
    url: 'https://hooks.example.com/ci',
    enabled: true,
    event_types: ['lock.acquired', 'checkin.created'],
    secrets: [{ id: 101, created_at: '2026-10-01T09:00:00Z', encrypted: true }],
    created_by: 'alice',
    created_at: '2026-10-01T09:00:00Z',
    updated_at: '2026-10-05T09:00:00Z',
  },
  {
    id: 2,
    name: 'Audit sink',
    url: 'https://audit.example.com/in',
    enabled: false,
    event_types: [],
    secrets: [
      { id: 102, created_at: '2026-09-01T09:00:00Z', encrypted: true },
      { id: 103, created_at: '2026-10-02T09:00:00Z', encrypted: false },
    ],
    created_by: 'bob',
    created_at: '2026-09-01T09:00:00Z',
    updated_at: '2026-10-02T09:00:00Z',
  },
]

describe('webhook state helpers', () => {
  it('parses, trims and dedupes event types', () => {
    expect(parseEventTypes(' a, b\nb\n\n c ')).toEqual(['a', 'b', 'c'])
    expect(parseEventTypes('')).toEqual([])
  })

  it('labels events and detects rotation', () => {
    expect(eventTypesLabel([])).toBe('all events')
    expect(eventTypesLabel(['a', 'b'])).toBe('a, b')
    expect(isRotating(subscriptions[0])).toBe(false)
    expect(isRotating(subscriptions[1])).toBe(true)
  })
})

describe('PynWebhooks', () => {
  it('renders a captioned table and marks the selected row', () => {
    const w = mount(PynWebhooks, { props: { webhooks: subscriptions, selectedId: 2 } })
    expect(w.find('caption').text()).toBe('Webhook subscriptions')
    const rows = w.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('lock.acquired, checkin.created')
    expect(rows[0].text()).toContain('Enabled')
    expect(rows[1].text()).toContain('all events')
    expect(rows[1].text()).toContain('Disabled')
    expect(rows[1].findAll('td')[3].text()).toBe('2')
    expect(rows[0].attributes('aria-current')).toBeUndefined()
    expect(rows[1].attributes('aria-current')).toBe('true')
  })

  it('emits select from a row click and from the name button once', async () => {
    const w = mount(PynWebhooks, { props: { webhooks: subscriptions } })
    await w.findAll('tbody tr')[0].trigger('click')
    await w.findAll('tbody tr')[1].find('button').trigger('click')
    expect(w.emitted('select')).toEqual([[1], [2]])
  })

  it('emits create and shows empty, loading and error states', async () => {
    const w = mount(PynWebhooks, { props: { webhooks: [] } })
    expect(w.text()).toContain('No webhooks yet.')
    await w.find('button').trigger('click')
    expect(w.emitted('create')).toHaveLength(1)
    const loading = mount(PynWebhooks, { props: { webhooks: [], loading: true } })
    expect(loading.find('[role="status"]').text()).toContain('Loading')
    expect(loading.attributes('aria-busy')).toBe('true')
    const failed = mount(PynWebhooks, { props: { webhooks: [], error: 'nope' } })
    expect(failed.find('[role="alert"]').text()).toBe('nope')
    expect(failed.text()).not.toContain('No webhooks yet.')
  })
})

describe('PynWebhookDetail', () => {
  const mountIt = (props = {}) =>
    mount(PynWebhookDetail, {
      props: { webhook: subscriptions[0], deliveries, canRedeliver: true, ...props },
      attachTo: document.body,
    })
  const byText = (w: ReturnType<typeof mountIt>, text: string) =>
    w.findAll('button').find((b) => b.text() === text)!

  it('shows the details, secrets and embedded deliveries', () => {
    const w = mountIt()
    expect(w.text()).toContain('https://hooks.example.com/ci')
    expect(w.text()).toContain('alice')
    expect(w.text()).toContain('encrypted')
    expect(w.findComponent(PynWebhookDeliveries).exists()).toBe(true)
    expect(w.findAll('li')).toHaveLength(1)
    expect(byText(w, 'Rotate secret').attributes('disabled')).toBeUndefined()
    expect(w.text()).not.toContain('Retire')
    w.unmount()
  })

  it('emits an enabled update from the toggle', async () => {
    const w = mountIt()
    await w.find('input[type="checkbox"]').setValue(false)
    expect(w.emitted('update')![0]).toEqual([{ enabled: false }])
    w.unmount()
  })

  it('edits name, url and event types and returns focus to Edit', async () => {
    const w = mountIt()
    await byText(w, 'Edit').trigger('click')
    await w.vm.$nextTick()
    const inputs = w.findAll('form input, form textarea')
    expect(document.activeElement).toBe(inputs[0].element)
    await inputs[0].setValue(' Renamed ')
    await inputs[2].setValue('a, b')
    await w.find('form').trigger('submit')
    expect(w.emitted('update')![0]).toEqual([
      { name: 'Renamed', url: 'https://hooks.example.com/ci', event_types: ['a', 'b'] },
    ])
    await w.vm.$nextTick()
    expect(w.find('form').exists()).toBe(false)
    expect(document.activeElement).toBe(byText(w, 'Edit').element)
    w.unmount()
  })

  it('confirms delete before emitting and focuses Cancel', async () => {
    const w = mountIt()
    await byText(w, 'Delete').trigger('click')
    await w.vm.$nextTick()
    expect(w.find('[role="alertdialog"]').exists()).toBe(true)
    expect(document.activeElement).toBe(byText(w, 'Cancel').element)
    expect(w.emitted('delete')).toBeUndefined()
    await byText(w, 'Cancel').trigger('click')
    expect(w.emitted('delete')).toBeUndefined()
    await byText(w, 'Delete').trigger('click')
    await w.findAll('[role="alertdialog"] button')[0].trigger('click')
    expect(w.emitted('delete')).toEqual([[1]])
    w.unmount()
  })

  it('rotates, and while rotating retires a chosen secret after confirmation', async () => {
    const w = mountIt()
    await byText(w, 'Rotate secret').trigger('click')
    expect(w.emitted('rotate-secret')).toEqual([[1]])
    await w.setProps({ webhook: subscriptions[1] })
    expect(byText(w, 'Rotate secret').attributes('disabled')).toBeDefined()
    const retire = w.findAll('button[aria-label^="Retire secret"]')
    expect(retire).toHaveLength(2)
    await retire[1].trigger('click')
    await w.findAll('[role="alertdialog"] button')[0].trigger('click')
    expect(w.emitted('retire-secret')).toEqual([[103]])
    w.unmount()
  })

  it('reveals a one-time secret with copy and done', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    const w = mountIt({ secret: 'whsec_abc' })
    expect(w.find('[role="status"] code').text()).toBe('whsec_abc')
    await byText(w, 'Copy').trigger('click')
    expect(writeText).toHaveBeenCalledWith('whsec_abc')
    await w.vm.$nextTick()
    expect(byText(w, 'Copied').exists()).toBe(true)
    await byText(w, 'Done').trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
    w.unmount()
  })

  it('forwards the deliveries events and shows errors', async () => {
    const w = mountIt({ error: 'boom' })
    expect(w.find('[role="alert"]').text()).toBe('boom')
    await w.find('select').setValue('failed')
    expect(w.emitted('filter')![0]).toEqual(['failed'])
    w.unmount()
  })
})

describe('PynWebhookForm', () => {
  const fill = async (w: ReturnType<typeof mount>, name: string, url: string) => {
    const inputs = w.findAll('input')
    await inputs[0].setValue(name)
    await inputs[1].setValue(url)
  }

  it('emits the trimmed fields with parsed event types and enabled', async () => {
    const w = mount(PynWebhookForm)
    await fill(w, ' CI ', ' https://hooks.example.com/ci ')
    await w.find('textarea').setValue('a, b\na')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')![0]).toEqual([
      { name: 'CI', url: 'https://hooks.example.com/ci', event_types: ['a', 'b'], enabled: true },
    ])
  })

  it('sends enabled false when the toggle is cleared', async () => {
    const w = mount(PynWebhookForm)
    await fill(w, 'CI', 'https://hooks.example.com/ci')
    await w.find('input[type="checkbox"]').setValue(false)
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')![0][0]).toMatchObject({ enabled: false, event_types: [] })
  })

  it('hints and does not submit an invalid name or URL', async () => {
    const w = mount(PynWebhookForm)
    await fill(w, '', 'ftp://hooks.example.com')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')).toBeUndefined()
    expect(w.text()).toContain('Enter a name.')
    expect(w.text()).toContain('Use an https URL.')
    expect(w.find('input[aria-invalid="true"]').exists()).toBe(true)
  })

  it('validates the documented limits', () => {
    expect(webhookNameProblem('x'.repeat(256))).toBeNull()
    expect(webhookNameProblem('é'.repeat(129))).toContain('256 bytes')
    expect(webhookNameProblem('a\nb')).toContain('control')
    expect(webhookUrlProblem('https://u:p@example.com')).toContain('user name')
    expect(webhookUrlProblem('https://example.com/#x')).toContain('fragment')
    expect(webhookUrlProblem(`https://example.com/${'a'.repeat(2048)}`)).toContain('2048')
    expect(webhookUrlProblem('https://example.com/hook')).toBeNull()
    expect(webhookUrlProblem('http://example.com/hook')).toBeNull()
  })

  it('shows the error, busy state and emits cancel', async () => {
    const w = mount(PynWebhookForm, { props: { error: 'taken', busy: true } })
    expect(w.find('[role="alert"]').text()).toBe('taken')
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('cancel')).toHaveLength(1)
  })

  it('switches to the one-time secret reveal and emits dismiss', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    const w = mount(PynWebhookForm, { props: { secret: 'whsec_new' } })
    expect(w.find('form').exists()).toBe(false)
    expect(w.findComponent(PynSecretReveal).props('secret')).toBe('whsec_new')
    await w.findAll('button')[0].trigger('click')
    expect(writeText).toHaveBeenCalledWith('whsec_new')
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
  })
})

describe('PynOwnerFrozenNotice', () => {
  const freeze = {
    owner: 'acme',
    owner_id: 'id-1',
    kind: 'org' as const,
    frozen: true,
    frozen_at: '2026-06-09T14:05:00Z',
    reason: 'Billing review.',
  }

  it('shows the owner, kind, reason and time when frozen', () => {
    const w = mount(PynOwnerFrozenNotice, { props: { freeze } })
    expect(w.text()).toContain('Organization')
    expect(w.text()).toContain('acme')
    expect(w.text()).toContain('Billing review.')
    expect(w.find('time').attributes('datetime')).toBe(freeze.frozen_at)
  })

  it('omits the reason when there is none', () => {
    const w = mount(PynOwnerFrozenNotice, {
      props: { freeze: { ...freeze, kind: 'user', reason: null } },
    })
    expect(w.text()).toContain('User')
    expect(w.text()).not.toContain('Billing')
  })

  it('renders nothing when not frozen', () => {
    const w = mount(PynOwnerFrozenNotice, {
      props: { freeze: { ...freeze, frozen: false, frozen_at: null, reason: null } },
    })
    expect(w.find('section').exists()).toBe(false)
  })
})

describe('PynUpdateNotice', () => {
  const props = { current: '0.1.2', latest: '0.1.3', url: 'https://example.com/notes' }

  it('renders nothing without a latest version', () => {
    const w = mount(PynUpdateNotice, { props: { current: '0.1.2' } })
    expect(w.find('section').exists()).toBe(false)
    expect(w.html()).not.toContain('Dismiss')
  })

  it('shows the running and latest versions as a status', () => {
    const w = mount(PynUpdateNotice, { props })
    expect(w.find('[role="status"]').exists()).toBe(true)
    expect(w.find('[role="alert"]').exists()).toBe(false)
    expect(w.text()).toContain('0.1.2 to 0.1.3')
    expect(w.text()).not.toContain('pre-release')
  })

  it('tags a pre-release', () => {
    const w = mount(PynUpdateNotice, { props: { ...props, prerelease: true } })
    expect(w.text()).toContain('pre-release')
  })

  it('opens release notes in a new tab safely', () => {
    const a = mount(PynUpdateNotice, { props }).find('a')
    expect(a.text()).toBe('Release notes')
    expect(a.attributes('href')).toBe('https://example.com/notes')
    expect(a.attributes('target')).toBe('_blank')
    expect(a.attributes('rel')).toBe('noopener noreferrer')
  })

  it('omits the link without a url or for non-http urls', () => {
    expect(
      mount(PynUpdateNotice, { props: { current: '1', latest: '2' } })
        .find('a')
        .exists(),
    ).toBe(false)
    for (const url of ['javascript:alert(1)', 'data:text/html,x', '/relative']) {
      expect(
        mount(PynUpdateNotice, { props: { current: '1', latest: '2', url } })
          .find('a')
          .exists(),
      ).toBe(false)
    }
  })

  it('emits dismiss from a labelled button', async () => {
    const w = mount(PynUpdateNotice, { props })
    const b = w.find('button')
    expect(b.attributes('aria-label')).toBeTruthy()
    await b.trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
  })
})

describe('repository shell and settings', () => {
  const admin = ['read', 'manage_users', 'manage_roles', 'view_audit']
  const sections = (items: { section: string }[]) => items.map((i) => i.section)

  it('builds the tab bar from what exists', () => {
    expect(repoShellTabs(['read'], false).map((t) => t.label)).toEqual(['Code', 'Locks', 'History'])
    expect(repoShellTabs(admin, true, { insights: true }).map((t) => t.label)).toEqual([
      'Code',
      'Locks',
      'History',
      'Insights',
      'Settings',
    ])
    expect(repoShellTabs(['view_audit'], false).at(-1)?.label).toBe('Settings')
  })

  it('gates the settings navigation as the pages do', () => {
    expect(repoSettingsNav(['read'], false)).toEqual([])
    const all = [...admin, 'edit_policy']
    expect(repoSettingsNav(all, true).map((i) => i.label)).toEqual([
      'General',
      'Members',
      'Roles',
      'Invitations',
      'Policy',
      'Storage',
      'Audit log',
    ])
    expect(sections(repoSettingsNav(all, false))).toEqual([
      'members',
      'roles',
      'invites',
      'policy',
      'storage',
      'audit',
    ])
    expect(sections(repoSettingsNav(['read'], true))).toEqual(['settings', 'storage'])
    expect(sections(repoSettingsNav(['read'], false, { serverAdmin: true }))).toEqual(['storage'])
    expect(sections(repoSettingsNav(['edit_policy'], false))).toEqual(['policy'])
    expect(sections(repoSettingsNav(['manage_roles'], false))).toEqual(['roles'])
    expect(sections(repoSettingsNav(['manage_users'], false))).toEqual(['members', 'invites'])
    expect(repoSettingsPath({ owner: 'a', name: 'b' }, 'settings')).toBe('/a/b/settings')
    expect(repoSettingsPath({ owner: 'a', name: 'b' }, 'audit')).toBe('/a/b/settings/audit')
  })

  it('shows the Settings tab to everyone who can open a settings page', () => {
    const last = (p: string[], owner: boolean, serverAdmin = false) =>
      repoShellTabs(p, owner, { serverAdmin }).some((t) => t.label === 'Settings')
    expect(last(['read'], true)).toBe(true)
    expect(last(['read'], false, true)).toBe(true)
    expect(last(['edit_policy'], false)).toBe(true)
    expect(last(['read'], false)).toBe(false)
  })

  it('renders the header, badge, actions and an accessible tab bar', () => {
    const w = mount(PynRepoShell, {
      props: {
        owner: 'alice',
        name: 'game',
        visibility: 'public',
        tabs: [
          { section: '', label: 'Code' },
          { section: 'locks', label: 'Locks', count: 2 },
          { section: 'settings', label: 'Settings' },
        ],
        current: 'settings/members',
      },
      slots: { actions: '<button>Clone</button>', default: '<p>body</p>' },
    })
    expect(w.find('[data-visibility]').text()).toBe('Public')
    expect(w.find('a[href="/alice"]').text()).toBe('alice')
    expect(w.find('a[href="/alice/game"]').text()).toBe('game')
    expect(w.find('button').text()).toBe('Clone')
    expect(w.find('nav[aria-label="Repository"]').exists()).toBe(true)
    expect(w.find('[aria-current=page]').text()).toBe('Settings')
    expect(w.findAll('[aria-current=page]')).toHaveLength(1)
    expect(w.find('[data-count]').text()).toBe('2')
    expect(w.text()).toContain('body')
  })

  it('marks Code only on the files page and omits the tab bar without tabs', () => {
    const props = { owner: 'a', name: 'b', visibility: 'private' as const }
    const tabs = repoShellTabs(['read'], false)
    const code = mount(PynRepoShell, { props: { ...props, tabs, current: '' } })
    expect(code.find('[aria-current=page]').text()).toBe('Code')
    const locks = mount(PynRepoShell, { props: { ...props, tabs, current: 'locks' } })
    expect(locks.find('[aria-current=page]').text()).toBe('Locks')
    const bare = mount(PynRepoShell, { props })
    expect(bare.find('nav[aria-label="Repository"]').exists()).toBe(false)
    expect(bare.find('[data-visibility]').text()).toBe('Private')
  })

  it('renders the settings sub-navigation and content', () => {
    const w = mount(PynRepoSettings, {
      props: {
        owner: 'a',
        name: 'b',
        items: repoSettingsNav(admin, true).filter((i) => i.section !== 'storage'),
        current: 'audit',
      },
      slots: { default: '<p>page</p>' },
    })
    expect(w.find('nav').attributes('aria-label')).toBe('Repository settings')
    expect(w.findAll('nav a').map((a) => a.attributes('href'))).toEqual([
      '/a/b/settings',
      '/a/b/settings/members',
      '/a/b/settings/roles',
      '/a/b/settings/invites',
      '/a/b/settings/audit',
    ])
    expect(w.find('[aria-current=page]').text()).toBe('Audit log')
    expect(w.text()).toContain('page')
  })
})

describe('PynAccountDelete', () => {
  const blockers = { repos: ['alice/game'], orgs: ['studio'] }

  it('asks for the password and emits it', async () => {
    const w = mount(PynAccountDelete, { props: {} })
    expect(w.find('button').attributes('disabled')).toBeDefined()
    await w.find('input[type="password"]').setValue('hunter2')
    await w.find('form').trigger('submit')
    expect(w.emitted('remove')?.[0]).toEqual(['hunter2'])
  })

  it('needs no password for an external sign-in', async () => {
    const w = mount(PynAccountDelete, { props: { external: true } })
    expect(w.find('input').exists()).toBe(false)
    await w.find('form').trigger('submit')
    expect(w.emitted('remove')?.[0]).toEqual([undefined])
  })

  it('lists blockers and refuses to delete', async () => {
    const w = mount(PynAccountDelete, { props: { external: true, blockers } })
    expect(w.text()).toContain('alice/game')
    expect(w.text()).toContain('studio')
    expect(w.find('button').attributes('disabled')).toBeDefined()
    await w.find('form').trigger('submit')
    expect(w.emitted('remove')).toBeUndefined()
  })

  it('states the recovery window and shows the error', () => {
    const w = mount(PynAccountDelete, { props: { recoveryDays: 30, error: 'Wrong password.' } })
    expect(w.text()).toContain('30 days')
    expect(w.find('[role="alert"]').text()).toBe('Wrong password.')
  })
})

describe('PynAccountPendingDeletion', () => {
  it('shows the deadline and emits restore', async () => {
    const w = mount(PynAccountPendingDeletion, {
      props: { deadline: '2026-12-01T10:00:00Z', user: 'alice' },
    })
    expect(w.text()).toContain('alice')
    expect(w.text()).toContain('Dec 01 2026')
    await w.find('button').trigger('click')
    expect(w.emitted('restore')).toHaveLength(1)
  })

  it('disables restore while busy', () => {
    const w = mount(PynAccountPendingDeletion, {
      props: { deadline: '2026-12-01T10:00:00Z', busy: true, error: 'Try again.' },
    })
    expect(w.find('button').attributes('disabled')).toBeDefined()
    expect(w.text()).toContain('Try again.')
  })
})

describe('PynProfileForm', () => {
  const profile = { display_name: 'Alice', bio: 'Hi', links: ['https://example.com'] }

  it('fills the fields and emits the cleaned profile', async () => {
    const w = mount(PynProfileForm, { props: { profile } })
    const inputs = w.findAll('input[type="text"], input:not([type])')
    await inputs[0].setValue('  Alicia  ')
    await w.find('textarea[placeholder]').setValue('https://a.example\n\n https://b.example ')
    await w.find('form').trigger('submit')
    expect(w.emitted('save')?.[0]).toEqual([
      {
        display_name: 'Alicia',
        bio: 'Hi',
        location: '',
        company: '',
        links: ['https://a.example', 'https://b.example'],
      },
    ])
  })

  it('refuses a link that is not http or https', async () => {
    const w = mount(PynProfileForm, { props: { profile } })
    await w.find('textarea[placeholder]').setValue('ftp://x.example')
    await w.find('form').trigger('submit')
    expect(w.emitted('save')).toBeUndefined()
    expect(w.find('[role="alert"]').text()).toContain('ftp://x.example')
  })

  it('shows an avatar with a remove button, or an initial', () => {
    const none = mount(PynProfileForm, { props: { profile, user: 'alice' } })
    expect(none.find('img').exists()).toBe(false)
    expect(none.text()).toContain('A')
    expect(none.text()).not.toContain('Remove avatar')
    const some = mount(PynProfileForm, {
      props: { profile, avatarUrl: '/v1/users/alice/avatar?v=1' },
    })
    expect(some.find('img').attributes('src')).toBe('/v1/users/alice/avatar?v=1')
  })

  it('emits a valid image and rejects a wrong type or size', async () => {
    const w = mount(PynProfileForm, { props: { profile } })
    const input = w.find('input[type="file"]')
    const set = async (file: File) => {
      Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
      await input.trigger('change')
    }
    const png = new File(['x'], 'a.png', { type: 'image/png' })
    await set(png)
    expect(w.emitted('avatar')?.[0]).toEqual([png])
    await set(new File(['x'], 'a.gif', { type: 'image/gif' }))
    expect(w.emitted('avatar')).toHaveLength(1)
    expect(w.find('[role="alert"]').text()).toContain('PNG, JPEG or WebP')
    await set(new File([new Uint8Array(1024 * 1024 + 1)], 'b.png', { type: 'image/png' }))
    expect(w.emitted('avatar')).toHaveLength(1)
    expect(w.find('[role="alert"]').text()).toContain('1 MiB')
  })

  it('emits removeAvatar and shows messages', async () => {
    const w = mount(PynProfileForm, {
      props: { profile, avatarUrl: '/a', success: 'Saved.', error: 'Nope.' },
    })
    await w.find('button[type="button"]').trigger('click')
    expect(w.emitted('removeAvatar')).toHaveLength(1)
    expect(w.find('[role="status"]').text()).toBe('Saved.')
    expect(w.find('form [role="alert"]').text()).toBe('Nope.')
  })

  it('reloads the fields when the profile changes', async () => {
    const w = mount(PynProfileForm, { props: { profile } })
    await w.setProps({ profile: { display_name: 'Bob' } })
    expect((w.find('input:not([type])').element as HTMLInputElement).value).toBe('Bob')
  })
})

describe('PynEmailAddresses', () => {
  const emails = [
    { address: 'a@x.example', verified: true, primary: true, added_at: '2026-01-04T10:00:00Z' },
    { address: 'b@x.example', verified: true, primary: false, added_at: '2026-02-04T10:00:00Z' },
    { address: 'c@x.example', verified: false, primary: false, added_at: '2026-03-04T10:00:00Z' },
  ]
  const button = (w: ReturnType<typeof mount>, row: number, label: string) => {
    const li = w.findAll('li')[row]
    return li.findAll('button').find((b) => b.text() === label)
  }

  it('shows primary, verified and pending states', () => {
    const w = mount(PynEmailAddresses, { props: { emails } })
    const rows = w.findAll('li')
    expect(rows[0].text()).toContain('Primary')
    expect(rows[1].text()).toContain('Verified')
    expect(rows[2].text()).toContain('Pending')
  })

  it('offers the right actions per state and emits the address', async () => {
    const w = mount(PynEmailAddresses, { props: { emails } })
    expect(button(w, 0, 'Make primary')).toBeUndefined()
    await button(w, 1, 'Make primary')!.trigger('click')
    expect(button(w, 1, 'Resend link')).toBeUndefined()
    await button(w, 2, 'Resend link')!.trigger('click')
    await button(w, 2, 'Remove')!.trigger('click')
    expect(w.emitted('primary')?.[0]).toEqual(['b@x.example'])
    expect(w.emitted('resend')?.[0]).toEqual(['c@x.example'])
    expect(w.emitted('remove')?.[0]).toEqual(['c@x.example'])
  })

  it('adds a trimmed address and clears the field', async () => {
    const w = mount(PynEmailAddresses, { props: { emails } })
    const input = w.find('input[type="email"]')
    await input.setValue('  new@x.example ')
    await w.find('form').trigger('submit')
    expect(w.emitted('add')?.[0]).toEqual(['new@x.example'])
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('stops adding at the limit and shows the error and the sent note', () => {
    const w = mount(PynEmailAddresses, {
      props: { emails, max: 3, error: 'Not available.', sent: 'c@x.example' },
    })
    expect(w.find('input[type="email"]').attributes('disabled')).toBeDefined()
    expect(w.text()).toContain('at most 3')
    expect(w.text()).toContain('link sent')
    expect(w.find('[role="alert"]').text()).toBe('Not available.')
  })

  it('says when there are none', () => {
    expect(mount(PynEmailAddresses, { props: { emails: [] } }).text()).toContain('No addresses')
  })
})

describe('PynUsernameChange', () => {
  async function fill(w: ReturnType<typeof mount>, name: string, password?: string) {
    await w.find('input[autocapitalize]').setValue(name)
    if (password !== undefined) await w.find('input[type="password"]').setValue(password)
    await w.find('input[type="checkbox"]').setValue(true)
  }

  it('states the consequences and lists the repositories', () => {
    const w = mount(PynUsernameChange, {
      props: { current: 'alice', repositories: ['alice/game'] },
    })
    expect(w.text()).toContain('alice')
    expect(w.text()).toContain('not reserved')
    expect(w.text()).toContain('alice/game')
  })

  it('needs the acknowledgement and the password', async () => {
    const w = mount(PynUsernameChange, { props: { current: 'alice' } })
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    await fill(w, 'alicia', 'pw')
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
    await w.find('form').trigger('submit')
    expect(w.emitted('rename')?.[0]).toEqual([{ username: 'alicia', password: 'pw' }])
  })

  it('omits the password for an account without one', async () => {
    const w = mount(PynUsernameChange, { props: { current: 'alice', hasPassword: false } })
    expect(w.find('input[type="password"]').exists()).toBe(false)
    await fill(w, 'alicia')
    await w.find('form').trigger('submit')
    expect(w.emitted('rename')?.[0]).toEqual([{ username: 'alicia' }])
  })

  it('rejects an invalid or unchanged name', async () => {
    const w = mount(PynUsernameChange, { props: { current: 'alice', hasPassword: false } })
    await fill(w, 'Bad Name')
    await w.find('form').trigger('submit')
    expect(w.emitted('rename')).toBeUndefined()
    expect(w.find('[role="alert"]').text()).toContain('lowercase')
    await w.find('input[autocapitalize]').setValue('alice')
    await w.find('form').trigger('submit')
    expect(w.find('[role="alert"]').text()).toContain('already')
  })

  it('shows the server error', () => {
    const w = mount(PynUsernameChange, { props: { current: 'alice', error: 'Taken.' } })
    expect(w.find('[role="alert"]').text()).toBe('Taken.')
  })
})

describe('PynQrCode', () => {
  it('draws a square code with a finder pattern in each corner', () => {
    const w = mount(PynQrCode, { props: { value: 'hello' } })
    expect(w.find('svg').attributes('viewBox')).toBe('0 0 29 29')
    expect(w.find('path').attributes('d')).toContain('M4 4h1v1h-1z')
  })

  it('draws nothing when the text is too long to encode', () => {
    expect(
      mount(PynQrCode, { props: { value: 'x'.repeat(400) } })
        .find('svg')
        .exists(),
    ).toBe(false)
  })
})

describe('PynTotpEnrolment', () => {
  const enrolment = {
    id: 'f1',
    secret: 'JBSWY3DPEHPK3PXP',
    uri: 'otpauth://totp/Pyn:a?secret=JBSWY3DPEHPK3PXP',
  }

  const copyButton = (w: ReturnType<typeof mount>) =>
    w.findAll('button').find((b) => b.text() === 'Copy key')!

  it('shows the QR code and hides the key text by default', () => {
    const w = mount(PynTotpEnrolment, { props: { enrolment } })
    expect(w.find('svg').exists()).toBe(true)
    expect(w.text()).not.toContain('JBSW')
    expect(w.find('code').exists()).toBe(false)
  })

  it('copies the key with the clipboard API and keeps it hidden', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const w = mount(PynTotpEnrolment, { props: { enrolment } })
    await copyButton(w).trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('JBSWY3DPEHPK3PXP')
    expect(w.text()).toContain('Copied')
    expect(w.find('code').exists()).toBe(false)
    vi.unstubAllGlobals()
  })

  it('falls back to execCommand when the clipboard API is missing', async () => {
    vi.stubGlobal('navigator', {})
    const exec = vi.fn().mockReturnValue(true)
    document.execCommand = exec
    const w = mount(PynTotpEnrolment, { props: { enrolment } })
    await copyButton(w).trigger('click')
    await flushPromises()
    expect(exec).toHaveBeenCalledWith('copy')
    expect(w.text()).toContain('Copied')
    expect(w.find('code').exists()).toBe(false)
    expect(document.querySelector('textarea')).toBeNull()
    vi.unstubAllGlobals()
  })

  it('reveals the key and says so when copying fails', async () => {
    vi.stubGlobal('navigator', {})
    document.execCommand = vi.fn().mockReturnValue(false)
    const w = mount(PynTotpEnrolment, { props: { enrolment } })
    await copyButton(w).trigger('click')
    await flushPromises()
    expect(w.find('[role="status"]').text()).toContain('Could not copy')
    expect(w.find('code').text()).toBe('JBSW Y3DP EHPK 3PXP')
    vi.unstubAllGlobals()
  })

  it('emits the code without spaces, and cancel', async () => {
    const w = mount(PynTotpEnrolment, { props: { enrolment } })
    await w.find('input').setValue('123 456')
    await w.find('form').trigger('submit')
    expect(w.emitted('confirm')?.[0]).toEqual(['123456'])
    await w.findAll('button').at(-1)!.trigger('click')
    expect(w.emitted('cancel')).toHaveLength(1)
  })

  it('shows the error and does not submit while busy', async () => {
    const w = mount(PynTotpEnrolment, { props: { enrolment, busy: true, error: 'Wrong code.' } })
    expect(w.find('[role="alert"]').text()).toBe('Wrong code.')
    await w.find('input').setValue('123456')
    await w.find('form').trigger('submit')
    expect(w.emitted('confirm')).toBeUndefined()
  })
})

describe('PynRecoveryCodes', () => {
  const codes = ['aaaa-bbbb', 'cccc-dddd']

  it('lists the codes and confirms they were saved', async () => {
    const w = mount(PynRecoveryCodes, { props: { codes } })
    expect(w.findAll('li').map((l) => l.text())).toEqual(codes)
    await w
      .findAll('button')
      .find((b) => b.text() === 'I saved them')!
      .trigger('click')
    expect(w.emitted('saved')).toHaveLength(1)
  })

  it('copies the codes, one per line', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const w = mount(PynRecoveryCodes, { props: { codes } })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Copy')!
      .trigger('click')
    expect(writeText).toHaveBeenCalledWith('aaaa-bbbb\ncccc-dddd')
    vi.unstubAllGlobals()
  })

  it('shows Could not copy when both copy paths fail', async () => {
    vi.stubGlobal('navigator', {})
    document.execCommand = vi.fn().mockReturnValue(false)
    const w = mount(PynRecoveryCodes, { props: { codes } })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Copy')!
      .trigger('click')
    await flushPromises()
    expect(w.text()).toContain('Could not copy')
    vi.unstubAllGlobals()
  })

  it('downloads a text file with the chosen name', async () => {
    const create = vi.fn().mockReturnValue('blob:x')
    const revoke = vi.fn()
    vi.stubGlobal('URL', { createObjectURL: create, revokeObjectURL: revoke })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const w = mount(PynRecoveryCodes, { props: { codes, filename: 'codes.txt' } })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Download')!
      .trigger('click')
    expect(create).toHaveBeenCalledTimes(1)
    expect(click).toHaveBeenCalledTimes(1)
    expect(revoke).toHaveBeenCalledWith('blob:x')
    click.mockRestore()
    vi.unstubAllGlobals()
  })
})

describe('PynSecondFactor', () => {
  it('emits an authenticator code, then a recovery code after switching', async () => {
    const w = mount(PynSecondFactor)
    await w.find('input').setValue('123456')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0]).toEqual([{ kind: 'totp', code: '123456' }])
    await w
      .findAll('button')
      .find((b) => b.text() === 'Use a recovery code')!
      .trigger('click')
    expect(w.text()).toContain('Enter one of your recovery codes')
    await w.find('input').setValue('aaaa-bbbb')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[1]).toEqual([{ kind: 'recovery', code: 'aaaa-bbbb' }])
  })

  it('offers a passkey only when passkeys are offered', async () => {
    expect(mount(PynSecondFactor).text()).not.toContain('Use a passkey')
    const w = mount(PynSecondFactor, { props: { passkeys: true } })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Use a passkey')!
      .trigger('click')
    expect(w.emitted('passkey')).toHaveLength(1)
  })

  it('goes back to sign-in and shows the error', async () => {
    const w = mount(PynSecondFactor, { props: { error: 'Wrong code.' } })
    expect(w.find('[role="alert"]').text()).toBe('Wrong code.')
    await w
      .findAll('button')
      .find((b) => b.text() === 'Back to sign in')!
      .trigger('click')
    expect(w.emitted('cancel')).toHaveLength(1)
  })
})

describe('PynPasskeys', () => {
  const passkeys = [
    {
      id: 'pk1',
      name: 'Laptop',
      created_at: '2026-10-08T09:00:00Z',
      last_used_at: null,
      transports: ['usb', 'nfc'],
      sign_count: 0,
      backup_eligible: true,
      backup_state: false,
    },
  ]

  it('lists passkeys with dates, backup state and transports', () => {
    const w = mount(PynPasskeys, { props: { passkeys, available: true } })
    expect(w.text()).toContain('Laptop')
    expect(w.text()).toContain('Added Oct 08 2026')
    expect(w.text()).toContain('never used')
    expect(w.text()).toContain('Can be synced')
    expect(w.text()).toContain('usb, nfc')
  })

  it('emits add, rename and remove', async () => {
    const w = mount(PynPasskeys, { props: { passkeys, available: true } })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Add a passkey')!
      .trigger('click')
    expect(w.emitted('add')).toHaveLength(1)
    await w
      .findAll('button')
      .find((b) => b.text() === 'Rename')!
      .trigger('click')
    await w.find('input').setValue('Work laptop')
    await w.find('form').trigger('submit')
    expect(w.emitted('rename')?.[0]).toEqual([{ id: 'pk1', name: 'Work laptop' }])
    await w
      .findAll('button')
      .find((b) => b.text() === 'Remove')!
      .trigger('click')
    expect(w.emitted('remove')?.[0]).toEqual(['pk1'])
  })

  it('disables adding and explains when the server offers none', () => {
    const w = mount(PynPasskeys, { props: { passkeys: [], available: false } })
    expect(w.find('[role="note"]').text()).toContain("can't register passkeys")
    expect(
      w
        .findAll('button')
        .find((b) => b.text() === 'Add a passkey')!
        .attributes('disabled'),
    ).toBeDefined()
  })
})

describe('PynSignIn passkey button', () => {
  it('shows only when passkeys are offered and emits passkey', async () => {
    expect(mount(PynSignIn, { props: { registration: 'open' } }).text()).not.toContain('passkey')
    const w = mount(PynSignIn, { props: { registration: 'open', passkeys: true } })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Sign in with a passkey')!
      .trigger('click')
    expect(w.emitted('passkey')).toHaveLength(1)
  })
})

describe('PynPasswordPrompt', () => {
  it('emits the password and cancel, and blocks an empty password', async () => {
    const w = mount(PynPasswordPrompt, { props: { error: 'Nope' } })
    expect(w.text()).toContain('Confirm your password')
    expect(w.text()).toContain('Nope')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')).toBeUndefined()
    await w.find('input').setValue('hunter2')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')?.[0]).toEqual(['hunter2'])
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('cancel')).toHaveLength(1)
  })

  it('does not submit while busy', async () => {
    const w = mount(PynPasswordPrompt, { props: { busy: true } })
    await w.find('input').setValue('x')
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')).toBeUndefined()
  })
})

describe('PynTwoFactor', () => {
  const button = (w: ReturnType<typeof mount>, text: string) =>
    w.findAll('button').find((b) => b.text() === text)!

  it('lists the app and the recovery codes left', () => {
    const w = mount(PynTwoFactor, { props: { status: twoFactorStatus } })
    expect(w.text()).toContain('Phone')
    expect(w.text()).toContain('8 recovery codes left')
  })

  it('hides recovery codes until a factor is on', () => {
    const w = mount(PynTwoFactor, { props: { status: emptyStatus } })
    expect(w.text()).not.toContain('Recovery codes')
    expect(w.text()).toContain('No authenticator app yet')
  })

  it('adds with the label at once when a factor already exists', async () => {
    const w = mount(PynTwoFactor, { props: { status: twoFactorStatus } })
    await w.find('input').setValue(' Tablet ')
    await w.find('form').trigger('submit')
    expect(w.emitted('addTotp')?.[0]).toEqual(['Tablet'])
  })

  it('asks for the password before the first factor and sends it with the label', async () => {
    const w = mount(PynTwoFactor, { props: { status: emptyStatus } })
    await w.find('input').setValue('Phone')
    await w.find('form').trigger('submit')
    expect(w.emitted('addTotp')).toBeUndefined()
    await w.find('input[type="password"]').setValue('hunter2')
    await w.find('form').trigger('submit')
    expect(w.emitted('addTotp')?.[0]).toEqual(['Phone', 'hunter2'])
  })

  it('skips the prompt for an account without a password', async () => {
    const w = mount(PynTwoFactor, { props: { status: emptyStatus, hasPassword: false } })
    await w.find('form').trigger('submit')
    expect(w.emitted('addTotp')?.[0]).toEqual([''])
  })

  it('emits remove and regenerateCodes', async () => {
    const w = mount(PynTwoFactor, { props: { status: twoFactorStatus } })
    await button(w, 'Remove').trigger('click')
    await button(w, 'Generate new codes').trigger('click')
    expect(w.emitted('remove')?.[0]).toEqual(['f1'])
    expect(w.emitted('regenerateCodes')).toHaveLength(1)
  })

  it('disables the buttons while busy', () => {
    const w = mount(PynTwoFactor, { props: { status: twoFactorStatus, busy: true } })
    expect(w.findAll('button').every((b) => b.attributes('disabled') !== undefined)).toBe(true)
  })
})

describe('PynNotices', () => {
  it('renders nothing without notices', () => {
    expect(
      mount(PynNotices, { props: { notices: [] } })
        .find('ul')
        .exists(),
    ).toBe(false)
  })

  it('titles known kinds, shows the detail and emits dismiss', async () => {
    const w = mount(PynNotices, { props: { notices } })
    expect(w.text()).toContain('Two-factor authentication was reset')
    expect(w.text()).toContain('The studio moved to a new address.')
    expect(w.text()).toContain('Oct 09 2026')
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('dismiss')?.[0]).toEqual(['n2'])
  })
})

describe('PynTwoFactorNag', () => {
  const deadline = '2026-12-01T00:00:00Z'

  it('names the server and the deadline before it passes', () => {
    const w = mount(PynTwoFactorNag, {
      props: { required: { by: 'server', deadline, enforced: false }, href: '/s' },
    })
    expect(w.text()).toContain('This server requires two-factor authentication from Dec 01 2026')
    expect(w.find('a').attributes('href')).toBe('/s')
  })

  it('names the organization and says access is limited once enforced', () => {
    const w = mount(PynTwoFactorNag, {
      props: {
        required: { by: 'organization', organization: 'acme', deadline, enforced: true },
        href: '/s',
      },
    })
    expect(w.text()).toContain('The organization acme requires two-factor authentication.')
    expect(w.text()).toContain('to keep using your account')
  })
})

describe('PynTwoFactorRequirement', () => {
  it('emits the requirement with the grace period', async () => {
    const w = mount(PynTwoFactorRequirement, { props: { setting: { required: false } } })
    await w.find('input[type="checkbox"]').setValue(true)
    await w.find('input[type="number"]').setValue(14)
    await w.find('form').trigger('submit')
    expect(w.emitted('change')?.[0]).toEqual([{ required: true, grace_days: 14 }])
  })

  it('defaults the grace period to 7 days and shows since', () => {
    const w = mount(PynTwoFactorRequirement, {
      props: { setting: { required: true, since: '2026-11-01T00:00:00Z' } },
    })
    expect((w.find('input[type="number"]').element as HTMLInputElement).value).toBe('7')
    expect(w.text()).toContain('Required since Nov 01 2026')
  })

  it('refuses a grace period outside 0 to 90', async () => {
    const w = mount(PynTwoFactorRequirement, { props: { setting: { required: true } } })
    await w.find('input[type="number"]').setValue(91)
    await w.find('form').trigger('submit')
    expect(w.emitted('change')).toBeUndefined()
    expect(w.text()).toContain('0 to 90')
  })

  it('writes nothing when readonly', async () => {
    const w = mount(PynTwoFactorRequirement, {
      props: { setting: { required: true }, readonly: true },
    })
    await w.find('form').trigger('submit')
    expect(w.emitted('change')).toBeUndefined()
    expect(w.find('button').attributes('disabled')).toBeDefined()
  })
})

describe('PynOrgSettings', () => {
  it('shows an unset default and saves null for it', async () => {
    const w = mount(PynOrgSettings, { props: { settings: { exclusive_read_only: null } } })
    expect((w.find('select').element as HTMLSelectElement).value).toBe('default')
    await w.find('form').trigger('submit')
    expect(w.emitted('save')?.[0]).toEqual([{ exclusive_read_only: null }])
  })

  it('saves on and off as booleans', async () => {
    const w = mount(PynOrgSettings, { props: { settings: { exclusive_read_only: true } } })
    expect((w.find('select').element as HTMLSelectElement).value).toBe('on')
    await w.find('select').setValue('off')
    await w.find('form').trigger('submit')
    expect(w.emitted('save')?.[0]).toEqual([{ exclusive_read_only: false }])
  })

  it('writes nothing when readonly', async () => {
    const w = mount(PynOrgSettings, { props: { settings: {}, readonly: true } })
    await w.find('form').trigger('submit')
    expect(w.emitted('save')).toBeUndefined()
  })
})

describe('PynSecretReveal copy', () => {
  const copy = (w: ReturnType<typeof mount>) =>
    w
      .findAll('button')
      .find((b) => b.text() === 'Copy')!
      .trigger('click')

  it('uses the execCommand fallback without the clipboard API', async () => {
    vi.stubGlobal('navigator', {})
    const exec = vi.fn().mockReturnValue(true)
    document.execCommand = exec
    const w = mount(PynSecretReveal, { props: { secret: 'whsec_x' } })
    await copy(w)
    await flushPromises()
    expect(exec).toHaveBeenCalledWith('copy')
    expect(w.text()).toContain('Copied')
    vi.unstubAllGlobals()
  })

  it('shows Could not copy when both paths fail', async () => {
    vi.stubGlobal('navigator', {})
    document.execCommand = vi.fn().mockReturnValue(false)
    const w = mount(PynSecretReveal, { props: { secret: 'whsec_x' } })
    await copy(w)
    await flushPromises()
    expect(w.text()).toContain('Could not copy')
    vi.unstubAllGlobals()
  })
})

describe('copyText', () => {
  it('restores focus after the fallback copy', async () => {
    vi.stubGlobal('navigator', {})
    document.execCommand = vi.fn().mockReturnValue(true)
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()
    expect(await copyText('x')).toBe(true)
    expect(document.activeElement).toBe(button)
    button.remove()
    vi.unstubAllGlobals()
  })
})

describe('branch-aware links', () => {
  const b = 'feature/levels'
  const q = '?branch=feature%2Flevels'

  it('keeps the branch in the helpers and leaves them unchanged without one', () => {
    expect(treePath(r, 'a b', b)).toBe(`/acme/castle-quest/tree/a%20b${q}`)
    expect(treePath(r, '', b)).toBe(`/acme/castle-quest${q}`)
    expect(blobPath(r, 'a.ts', b)).toBe(`/acme/castle-quest/blob/a.ts${q}`)
    expect(historyLink(r, 'a.ts', b)).toBe(
      '/acme/castle-quest/history?path=a.ts&branch=feature%2Flevels',
    )
    expect(contentUrl(r, 'a.ts', 3, b)).toBe(
      '/v1/repos/acme/castle-quest/content?path=a.ts&revision=3&branch=feature%2Flevels',
    )
    expect(contentUrl(r, 'a.ts')).toBe('/v1/repos/acme/castle-quest/content?path=a.ts')
    expect(fileCrumbs(r, 'a/b.ts', b)[1].href).toBe(`/acme/castle-quest/tree/a${q}`)
    expect(breadcrumbs(r, 'a/b', b)[0].href).toBe(`/acme/castle-quest${q}`)
    expect(repoPath(r, 'history', b)).toBe(`/acme/castle-quest/history${q}`)
  })

  it('keeps the branch on tree rows, the file bar and the README', () => {
    const tree = mount(PynTree, { props: { entries: rootEntries, ...r, now, branch: b } })
    for (const a of tree.findAll('a'))
      expect(a.attributes('href')).toContain('branch=feature%2Flevels')
    const bar = mount(PynFileBar, { props: { entry: fileEntry, ...r, now, branch: b } })
    for (const a of bar.findAll('a'))
      expect(a.attributes('href')).toContain('branch=feature%2Flevels')
    const readme = mount(PynReadme, {
      props: {
        readme: { name: 'README.md', path: 'README.md', text: '[a](docs/a.md)' },
        ...r,
        branch: b,
      },
    })
    expect(readme.findAll('a').map((a) => a.attributes('href'))).toEqual([
      `/acme/castle-quest/blob/README.md${q}`,
      `/acme/castle-quest/blob/docs/a.md${q}`,
    ])
  })

  it('keeps the branch in markdown links and images', () => {
    const html = renderMarkdown('[a](x.md) ![i](p.png)', r, '', b)
    expect(html).toContain(`href="/acme/castle-quest/blob/x.md${q}"`)
    expect(html).toContain('branch=feature%2Flevels')
    expect(renderMarkdown('[a](x.md)', r, '')).not.toContain('branch=')
  })

  it('keeps the branch in the repository nav on Code and History only', () => {
    const tabs = [
      { section: '', label: 'Code' },
      { section: 'locks', label: 'Locks' },
      { section: 'history', label: 'History' },
    ]
    const hrefs = (w: ReturnType<typeof mount>) => w.findAll('a').map((a) => a.attributes('href'))
    const shell = mount(PynRepoShell, {
      props: { ...r, visibility: 'private', tabs, current: '', branch: b },
    })
    expect(hrefs(shell)).toContain('/acme/castle-quest/locks')
    expect(hrefs(shell)).toContain(`/acme/castle-quest/history${q}`)
    expect(
      hrefs(mount(PynRepoShell, { props: { ...r, visibility: 'private', tabs, current: '' } })),
    ).toContain('/acme/castle-quest/locks')
  })

  it('keeps the branch in the file view and landing links', () => {
    const view = mount(PynFileView, {
      props: { ...r, path: 'a/b.ts', entry: fileEntry, body: null, now, branch: b },
    })
    for (const a of view.findAll('a'))
      expect(a.attributes('href')).toContain('branch=feature%2Flevels')
    const gone = mount(PynFileView, { props: { ...r, path: 'a/b.ts', missing: true, branch: b } })
    expect(gone.find('[role="alert"] a').attributes('href')).toBe(`/acme/castle-quest/tree/a${q}`)
    const landing = mount(PynRepoLanding, {
      props: { repo, path: 'x', listing: null, missing: true, branch: b },
    })
    expect(landing.find('[role="alert"] a').attributes('href')).toBe(`/acme/castle-quest${q}`)
  })
})

describe('PynBreadcrumbs', () => {
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'acme', href: '/acme' },
    { label: 'game', href: '/acme/game' },
    { label: 'Code', href: '/acme/game' },
    { label: 'Locks' },
  ]

  it('renders nothing for an empty or single-item trail', () => {
    expect(
      mount(PynBreadcrumbs, { props: { items: [] } })
        .find('nav')
        .exists(),
    ).toBe(false)
    expect(
      mount(PynBreadcrumbs, { props: { items: [{ label: 'Home' }] } })
        .find('nav')
        .exists(),
    ).toBe(false)
  })

  it('links every item but the last, which is the current page', () => {
    const w = mount(PynBreadcrumbs, { props: { items: trail.slice(0, 3) } })
    expect(w.find('nav').attributes('aria-label')).toBe('Breadcrumb')
    expect(w.findAll('a').map((a) => a.attributes('href'))).toEqual(['/', '/acme'])
    const current = w.find('[aria-current=page]')
    expect(current.text()).toBe('game')
    expect(current.element.tagName).toBe('SPAN')
    expect(w.find('[data-more]').exists()).toBe(false)
  })

  it('never links the last item even when it has an href', () => {
    const w = mount(PynBreadcrumbs, { props: { items: trail.slice(0, 2) } })
    expect(w.findAll('a')).toHaveLength(1)
    expect(w.find('[aria-current=page]').text()).toBe('acme')
  })

  it('collapses the middle items behind a button that reveals them', async () => {
    const w = mount(PynBreadcrumbs, { props: { items: trail }, attachTo: document.body })
    const hidden = () => w.findAll('[data-collapsible]')
    expect(hidden().map((l) => l.text())).toEqual(['acme', 'game'])
    expect(hidden().some((l) => l.classes().some((c) => c.includes('shown')))).toBe(false)
    const btn = w.find('[data-more] button')
    expect(btn.attributes('aria-expanded')).toBe('false')
    await btn.trigger('click')
    expect(btn.attributes('aria-expanded')).toBe('true')
    expect(hidden().every((l) => l.classes().some((c) => c.includes('shown')))).toBe(true)
    expect(w.find('[aria-current=page]').text()).toBe('Locks')
    w.unmount()
  })

  it('closes on Escape, returning focus, and on an outside click', async () => {
    const w = mount(PynBreadcrumbs, { props: { items: trail }, attachTo: document.body })
    const btn = w.find('[data-more] button')
    await btn.trigger('click')
    await w.find('nav').trigger('keydown', { key: 'Escape' })
    expect(btn.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(btn.element)
    await btn.trigger('click')
    document.body.click()
    await flushPromises()
    expect(btn.attributes('aria-expanded')).toBe('false')
    w.unmount()
  })

  it('is a real button, reachable by keyboard', () => {
    const w = mount(PynBreadcrumbs, { props: { items: trail } })
    const btn = w.find('[data-more] button')
    expect(btn.attributes('type')).toBe('button')
    expect(btn.attributes('aria-label')).toBeTruthy()
  })

  it('shows in the shell content area only with a trail of two or more', () => {
    const shell = (breadcrumbs?: { label: string; href?: string }[]) =>
      mount(PynShell, { props: { bare: true, breadcrumbs }, slots: { default: '<p>body</p>' } })
    expect(shell().find('nav').exists()).toBe(false)
    expect(
      shell([{ label: 'Home' }])
        .find('nav')
        .exists(),
    ).toBe(false)
    const w = shell(trail.slice(0, 3))
    expect(w.find('main nav[aria-label=Breadcrumb]').exists()).toBe(true)
    expect(w.find('main').text()).toContain('body')
  })
})

describe('PynSecondFactor alternatives and hints', () => {
  it('lists the other ways to verify with the default recovery hint', () => {
    const w = mount(PynSecondFactor)
    expect(w.find('h3').text()).toBe('Other ways to verify')
    expect(w.find('[data-recovery-hint]').text()).toContain('shown once')
    expect(w.find('[data-help-hint]').exists()).toBe(false)
  })

  it('offers authenticator code, passkey and recovery as alternatives in turn', async () => {
    const w = mount(PynSecondFactor, { props: { passkeys: true } })
    const labels = () => w.findAll('section button').map((b) => b.text())
    expect(labels()).toEqual(['Use a passkey', 'Use a recovery code'])
    await w.findAll('section button')[1].trigger('click')
    expect(labels()).toEqual(['Use an authenticator code', 'Use a passkey'])
    expect(w.find('[data-recovery-hint]').exists()).toBe(false)
    await w.findAll('section button')[0].trigger('click')
    expect(w.text()).toContain('six-digit code')
  })

  it('takes the wording from props', () => {
    const w = mount(PynSecondFactor, {
      props: { recoveryHint: 'Saved codes only.', helpHint: 'Ask an administrator.' },
    })
    expect(w.find('[data-recovery-hint]').text()).toBe('Saved codes only.')
    expect(w.find('[data-help-hint]').text()).toBe('Ask an administrator.')
  })

  it('disables every alternative while busy', () => {
    const w = mount(PynSecondFactor, { props: { passkeys: true, busy: true } })
    for (const b of w.findAll('section button')) expect(b.attributes('disabled')).toBeDefined()
  })
})

describe('PynPageNotFound links', () => {
  it('keeps the single home link by default', () => {
    const w = mount(PynPageNotFound)
    expect(w.findAll('a').map((a) => a.attributes('href'))).toEqual(['/'])
  })

  it('adds a back link with a default or given label', () => {
    const plain = mount(PynPageNotFound, { props: { backHref: '/alice' } })
    expect(plain.findAll('a').map((a) => a.attributes('href'))).toEqual(['/', '/alice'])
    expect(plain.find('[data-back]').text()).toBe('Go back')
    const named = mount(PynPageNotFound, {
      props: { backHref: '/alice', backLabel: 'Go to alice' },
    })
    expect(named.find('[data-back]').text()).toBe('Go to alice')
  })

  it('renders the actions slot after the home link and ignores a label without a href', () => {
    const w = mount(PynPageNotFound, {
      props: { backLabel: 'Orphan' },
      slots: { actions: '<a href="/explore">Explore</a>' },
    })
    expect(w.findAll('a').map((a) => a.attributes('href'))).toEqual(['/', '/explore'])
    expect(w.text()).not.toContain('Orphan')
  })
})

describe('PynWebhookForm event types', () => {
  const options = [
    { value: 'lock.acquired', label: 'lock.acquired', description: 'A lock was taken.' },
    { value: 'checkin.created', label: 'checkin.created' },
  ]
  const fillBasics = async (w: ReturnType<typeof mount>) => {
    await w.find('input').setValue('CI')
    await w.find('input[type="url"]').setValue('https://hooks.example.com/ci')
  }

  it('keeps the textarea without options', () => {
    const w = mount(PynWebhookForm)
    expect(w.find('textarea').exists()).toBe(true)
    expect(w.findComponent(PynMultiSelect).exists()).toBe(false)
  })

  it('picks from the options, labels the control and emits the chosen array', async () => {
    const w = mount(PynWebhookForm, {
      props: { eventTypeOptions: options },
      attachTo: document.body,
    })
    expect(w.find('textarea').exists()).toBe(false)
    const select = w.findComponent(PynMultiSelect)
    const trigger = select.find('[role="combobox"]')
    const label = select.find('label')
    expect(label.attributes('for')).toBe(trigger.attributes('id'))
    expect(select.text()).toContain('None chosen: all events')
    await trigger.trigger('click')
    await select.findAll('[role="option"]')[1].trigger('click')
    await fillBasics(w)
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')![0][0]).toMatchObject({ event_types: ['checkin.created'] })
    w.unmount()
  })

  it('emits an empty array when nothing is chosen', async () => {
    const w = mount(PynWebhookForm, { props: { eventTypeOptions: options } })
    await fillBasics(w)
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')![0][0]).toMatchObject({ event_types: [] })
  })

  it('shows a loading state and blocks create meanwhile', () => {
    const w = mount(PynWebhookForm, { props: { eventTypesLoading: true } })
    expect(w.find('[role="status"]').text()).toBe('Loading event types…')
    expect(w.find('textarea').exists()).toBe(false)
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('shows the load error and falls back to the textarea', async () => {
    const w = mount(PynWebhookForm, {
      props: { eventTypeOptions: options, eventTypesError: 'Could not load.' },
    })
    expect(w.find('[role="alert"]').text()).toBe('Could not load.')
    await w.find('textarea').setValue('a\nb')
    await fillBasics(w)
    await w.find('form').trigger('submit')
    expect(w.emitted('submit')![0][0]).toMatchObject({ event_types: ['a', 'b'] })
  })
})

describe('PynWebhookDetail event types', () => {
  const options = [
    { value: 'lock.acquired', label: 'lock.acquired' },
    { value: 'checkin.created', label: 'checkin.created' },
  ]
  const edit = async (webhook: (typeof subscriptions)[number], props = {}) => {
    const w = mount(PynWebhookDetail, {
      props: { webhook, deliveries, eventTypeOptions: options, ...props },
      attachTo: document.body,
    })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Edit')!
      .trigger('click')
    return w
  }

  it('marks a stored type the server no longer lists and explains it', async () => {
    const w = await edit({ ...subscriptions[0], event_types: ['lock.acquired', 'repo.archived'] })
    const chips = w.findAll('[data-test="chip"]').map((c) => c.text())
    expect(chips).toEqual(expect.arrayContaining(['lock.acquired ×', 'repo.archived (unknown) ×']))
    expect(w.text()).toContain('The server no longer lists repo.archived')
    w.unmount()
  })

  it('shows no hint when every stored type is listed, and saves the chosen array', async () => {
    const w = await edit({ ...subscriptions[0], event_types: ['lock.acquired'] })
    expect(w.text()).not.toContain('no longer lists')
    await w.find('[aria-label="Remove lock.acquired"]').trigger('click')
    await w.find('form').trigger('submit')
    expect(w.emitted('update')![0][0]).toMatchObject({ event_types: [] })
    w.unmount()
  })

  it('keeps the textarea without options', async () => {
    const w = mount(PynWebhookDetail, {
      props: { webhook: subscriptions[0], deliveries },
      attachTo: document.body,
    })
    await w
      .findAll('button')
      .find((b) => b.text() === 'Edit')!
      .trigger('click')
    expect(w.find('textarea').element.value).toBe(subscriptions[0].event_types.join('\n'))
    w.unmount()
  })

  it('shows loading and blocks save', async () => {
    const w = await edit(subscriptions[0], { eventTypesLoading: true })
    expect(w.text()).toContain('Loading event types…')
    expect(
      w
        .findAll('button')
        .find((b) => b.text() === 'Save')!
        .attributes('disabled'),
    ).toBeDefined()
    w.unmount()
  })
})

describe('PynServerInvitations', () => {
  const mountIt = (props = {}) =>
    mount(PynServerInvitations, { props: { invitations, targets, roles, ...props } })

  it('labels every status with text and hides revoke for used and revoked', () => {
    const w = mountIt()
    const items = w.findAll('li')
    expect(items.map((i) => i.find('[data-status]').text())).toEqual([
      'Pending',
      'Used',
      'Revoked',
      'Expired',
    ])
    expect(items[0].text()).toContain('writer in alice/site')
    expect(items[1].text()).toContain('No role')
    expect(items[1].text()).toContain('used by erin')
    expect(items.map((i) => i.find('button').exists())).toEqual([true, false, false, true])
  })

  it('emits revoke with the id', async () => {
    const w = mountIt()
    await w.find('button[aria-label="Revoke invitation dana@example.com"]').trigger('click')
    expect(w.emitted('revoke')).toEqual([['pynv_a1']])
  })

  it('uses the empty state for no invitations', () => {
    const w = mountIt({ invitations: [] })
    expect(w.findComponent(PynEmptyState).exists()).toBe(true)
    expect(w.text()).toContain('No invitations')
  })

  it('creates with the defaults: 7 days, no email, no grant', async () => {
    const w = mountIt()
    const days = w.find('input[type="number"]')
    expect(days.attributes('min')).toBe('1')
    expect(days.attributes('max')).toBe('90')
    expect((days.element as HTMLInputElement).value).toBe('7')
    expect(w.find('select option').text()).toBe('No role')
    await w.find('form').trigger('submit')
    expect(w.emitted('create')).toEqual([[{ expires_in_days: 7 }]])
  })

  it('emits email, days and a repository or organization grant', async () => {
    const w = mountIt()
    await w.find('input[type="email"]').setValue(' gus@example.com ')
    await w.find('input[type="number"]').setValue(30)
    const selects = w.findAll('select')
    await selects[0].setValue('repository:alice/site')
    expect(
      w
        .findAll('select')[1]
        .findAll('option')
        .map((o) => o.text()),
    ).toEqual(['reader', 'writer', 'maintainer', 'admin'])
    await w.findAll('select')[1].setValue('maintainer')
    await w.find('form').trigger('submit')
    await selects[0].setValue('organization:acme')
    await w.find('form').trigger('submit')
    expect(w.emitted('create')).toEqual([
      [
        {
          email: 'gus@example.com',
          expires_in_days: 30,
          grant: { repository: 'alice/site', role: 'maintainer' },
        },
      ],
      [
        {
          email: 'gus@example.com',
          expires_in_days: 30,
          grant: { organization: 'acme', role: 'member' },
        },
      ],
    ])
  })

  it('refuses an expiry outside 1 to 90', async () => {
    const w = mountIt()
    await w.find('input[type="number"]').setValue(91)
    await w.find('form').trigger('submit')
    expect(w.emitted('create')).toBeUndefined()
    expect(w.text()).toContain('from 1 to 90')
    expect(w.find('input[aria-invalid="true"]').exists()).toBe(true)
    expect(validExpiry(90)).toBe(true)
    expect(validExpiry(0)).toBe(false)
  })

  it('shows the one-time code with the register hint and emits dismiss', async () => {
    const w = mountIt({ created: 'pynv_abc', serverUrl: 'https://pyn.example.com', emailed: true })
    const reveal = w.findComponent(PynSecretReveal)
    expect(reveal.text()).toContain('pynv_abc')
    expect(reveal.text()).toContain('pyn register <name> --invite pynv_abc')
    expect(reveal.text()).toContain('https://pyn.example.com')
    expect(reveal.text()).toContain('also emailed')
    await reveal.findAll('button')[1].trigger('click')
    expect(w.emitted('dismiss')).toHaveLength(1)
  })

  it('shows the error, busy state and hides grant controls without targets', () => {
    const w = mountIt({ error: 'no such repository', busy: true, targets: [] })
    expect(w.find('[role="alert"]').text()).toBe('no such repository')
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    expect(w.find('select').exists()).toBe(false)
  })
})

describe('PynAddAccount', () => {
  it('emits the trimmed name and password, then clears the password', async () => {
    const w = mount(PynAddAccount)
    const [name, pass] = w.findAll('input')
    expect(pass.attributes('type')).toBe('password')
    expect(pass.attributes('minlength')).toBe('10')
    expect(w.text()).toContain('must choose their own password')
    await name.setValue(' hana ')
    await pass.setValue('one-time-pass')
    await w.find('form').trigger('submit')
    expect(w.emitted('add')).toEqual([[{ username: 'hana', password: 'one-time-pass' }]])
    expect((pass.element as HTMLInputElement).value).toBe('')
  })

  it('shows the error and disables while busy', () => {
    const w = mount(PynAddAccount, { props: { error: 'taken', busy: true } })
    expect(w.find('[role="alert"]').text()).toBe('taken')
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })
})

describe('PynEmailStatus', () => {
  it.each([
    ['none', 'the server sends no email', 'None'],
    ['log', 'Nothing is delivered to anyone', 'Log only'],
    ['smtp', 'delivers email through an SMTP server', 'SMTP'],
  ] as const)('says plainly what the %s mailer does', (mailer, sentence, label) => {
    const w = mount(PynEmailStatus, { props: { mailer, verification: false } })
    expect(w.text()).toContain(label)
    expect(w.text()).toContain(sentence)
  })

  it('states address verification in words and has a labelled heading', () => {
    const on = mount(PynEmailStatus, { props: { mailer: 'smtp', verification: true } })
    expect(on.text()).toContain('On')
    expect(on.text()).toContain('must confirm the email address')
    const off = mount(PynEmailStatus, { props: { mailer: 'smtp', verification: false } })
    expect(off.text()).toContain('Off')
    expect(off.text()).toContain('does not confirm')
    const section = on.find('section')
    expect(on.find(`#${section.attributes('aria-labelledby')}`).text()).toBe('Email')
  })
})

describe('PynAccounts resend confirmation', () => {
  const pending = { ...accounts[2], pending_verification: true }
  const base = { accounts: [accounts[0], pending], status: '' as const, self: 'root' }

  it('offers resend only for pending accounts and emits the user name', async () => {
    const w = mount(PynAccounts, { props: base })
    const buttons = w.findAll('button').filter((b) => b.text() === 'Resend confirmation')
    expect(buttons).toHaveLength(1)
    await buttons[0].trigger('click')
    expect(w.emitted('resendConfirmation')).toEqual([['carol']])
  })

  it('offers nothing when the marker is absent', () => {
    const w = mount(PynAccounts, { props: { ...base, accounts } })
    expect(w.text()).not.toContain('Resend confirmation')
  })

  it('marks the row being resent and disables the buttons', () => {
    const w = mount(PynAccounts, { props: { ...base, resendingUser: 'carol' } })
    const b = w.find('button[aria-label="Resend confirmation to carol"]')
    expect(b.text()).toBe('Sending…')
    expect(b.attributes('disabled')).toBeDefined()
  })
})

describe('PynPasswordForm reason', () => {
  it('shows the reason above the form as a status', () => {
    const w = mount(PynPasswordForm, { props: { reason: 'Choose your own password.' } })
    const note = w.find('[role="status"]')
    expect(note.text()).toBe('Choose your own password.')
    expect(w.find('form').element.firstElementChild).toBe(note.element)
  })

  it('leaves the output unchanged without a reason', () => {
    const w = mount(PynPasswordForm)
    expect(w.find('[role="status"]').exists()).toBe(false)
  })
})
