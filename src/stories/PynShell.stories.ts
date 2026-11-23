import type { Meta, StoryObj } from '@storybook/vue3'
import PynBranchBar from '../components/PynBranchBar.vue'
import PynShell from '../components/PynShell.vue'
import PynSideNav from '../components/PynSideNav.vue'
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
