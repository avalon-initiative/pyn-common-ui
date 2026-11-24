import type { Meta, StoryObj } from '@storybook/vue3'
import PynBranchBar from '../components/PynBranchBar.vue'
import PynShell from '../components/PynShell.vue'
import PynSecurityNotice from '../components/PynSecurityNotice.vue'
import PynSideNav from '../components/PynSideNav.vue'
import PynSideRail from '../components/PynSideRail.vue'
import PynSubNav from '../components/PynSubNav.vue'
import PynTopBar from '../components/PynTopBar.vue'
import PynRepoShell from '../components/PynRepoShell.vue'
import { repoShellTabs } from '../state/repo.state'
import { mainNav } from '../state/shell.state'

const meta: Meta<typeof PynShell> = {
  title: 'Shell/PynShell',
  component: PynShell,
  parameters: { layout: 'fullscreen' },
}
export default meta

const repos = [
  { owner: 'alice', name: 'castle-quest' },
  { owner: 'alice', name: 'core-engine' },
]

/** Repository page mockup with the legacy sidebar slot: top bar, sidebar, header and branch bar. */
export const RepositoryPage: StoryObj<typeof PynShell> = {
  render: () => ({
    components: { PynShell, PynTopBar, PynSideNav, PynRepoShell, PynBranchBar },
    setup: () => ({ repos, mainNav, tabs: repoShellTabs(['read'], false) }),
    template: `
      <PynShell>
        <template #top><PynTopBar user="alice" :repos="['alice/castle-quest']" theme="system" /></template>
        <template #side><PynSideNav account="alice" :items="mainNav" current="" :repos="repos" current-repo="alice/castle-quest" /></template>
        <PynRepoShell owner="alice" name="castle-quest" visibility="private" :tabs="tabs" current="">
          <PynBranchBar branch="main" :files="128" updated-at="2026-10-08T10:00:00Z" :now="new Date('2026-10-08T12:00:00Z')" />
        </PynRepoShell>
      </PynShell>`,
  }),
}

/** Repository page: the same top bar, no side navigation. */
export const RepositoryPageWithoutSidebar: StoryObj<typeof PynShell> = {
  render: () => ({
    components: { PynShell, PynTopBar, PynRepoShell },
    setup: () => ({ tabs: repoShellTabs(['read'], false) }),
    template: `
      <PynShell>
        <template #top><PynTopBar user="alice" :repos="['alice/castle-quest']" theme="system" :locks-held="2" /></template>
        <PynRepoShell owner="alice" name="castle-quest" visibility="private" :tabs="tabs" current=""><p>Page content</p></PynRepoShell>
      </PynShell>`,
  }),
}

/** Public page: signed-out top bar, no sidebar. */
export const SignedOutPage: StoryObj<typeof PynShell> = {
  render: () => ({
    components: { PynShell, PynTopBar },
    template: `
      <PynShell>
        <template #top><PynTopBar signed-out theme="system" /></template>
        <p>Public page content</p>
      </PynShell>`,
  }),
}

/** Breadcrumb trail above the page content. */
export const WithBreadcrumbs: StoryObj<typeof PynShell> = {
  render: () => ({
    components: { PynShell, PynTopBar },
    setup: () => ({
      trail: [
        { label: 'Home', href: '/' },
        { label: 'Account settings', href: '/_/settings' },
        { label: 'SSH keys' },
      ],
    }),
    template: `
      <PynShell :breadcrumbs="trail">
        <template #top><PynTopBar user="alice" theme="system" /></template>
        <p>Page content</p>
      </PynShell>`,
  }),
}

/** A banner directly above the page heading keeps a gap below it. */
export const WithBanner: StoryObj<typeof PynShell> = {
  render: () => ({
    components: { PynShell, PynTopBar, PynSecurityNotice },
    template: `
      <PynShell>
        <template #top><PynTopBar user="alice" :repos="[]" theme="system" /></template>
        <PynSecurityNotice message="Protect your account: add two-factor authentication." action-label="Set up two-factor authentication" action-href="/_/settings/security" dismissible />
        <h1>Dashboard</h1>
      </PynShell>`,
  }),
}

/** The footer slot renders after the content with a top border, not over it. */
export const WithFooter: StoryObj<typeof PynShell> = {
  render: () => ({
    components: { PynShell, PynTopBar },
    template: `
      <PynShell>
        <template #top><PynTopBar user="alice" :repos="[]" theme="system" /></template>
        <p v-for="n in 40" :key="n">Page content line {{ n }}</p>
        <template #footer><small style="display: block; padding: 0.5rem 1rem; text-align: right">web v0.2.1 · server v0.2.1</small></template>
      </PynShell>`,
  }),
}

const railRepos = [
  'avalon-protocol',
  'pyn',
  'entitlemap-frontend',
  'pyn-web',
  'pyn-common-ui',
  'nova',
].map((name) => ({ owner: 'alice', name }))

/** Dashboard with the side rail: account switcher, Home and Top repositories. */
export const DashboardWithSideRail: StoryObj<typeof PynShell> = {
  render: () => ({
    components: { PynShell, PynTopBar, PynSideRail },
    setup: () => ({
      repos: railRepos,
      items: [{ id: 'home', label: 'Home', href: '/', icon: 'home' }],
    }),
    template: `
      <PynShell>
        <template #top><PynTopBar user="alice" theme="system" /></template>
        <template #side><PynSideRail account="alice" :items="items" current="home" :repos="repos" :orgs="[{ name: 'studio' }, { name: 'tools-guild' }]" /></template>
        <p>Dashboard content</p>
      </PynShell>`,
  }),
}

/** List page with the sub-navigation and its grouped headings. */
export const ListPageWithSubNav: StoryObj<typeof PynShell> = {
  render: () => ({
    components: { PynShell, PynTopBar, PynSubNav },
    setup: () => ({
      groups: [
        {
          id: 'lists',
          items: [
            { id: 'mine', label: 'My repositories', href: '/_/repos', icon: 'repo' },
            { id: 'locks', label: 'My locks', href: '/_/locks', icon: 'lock' },
          ],
        },
        {
          id: 'account',
          heading: 'Account',
          items: [{ id: 'orgs', label: 'Organizations', href: '/_/orgs', icon: 'user' }],
        },
      ],
    }),
    template: `
      <PynShell>
        <template #top><PynTopBar user="alice" theme="system" /></template>
        <template #side><PynSubNav :groups="groups" current="mine" label="Repositories" /></template>
        <p>List content</p>
      </PynShell>`,
  }),
}
