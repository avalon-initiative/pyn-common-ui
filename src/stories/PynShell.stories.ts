import type { Meta, StoryObj } from '@storybook/vue3'
import PynBranchBar from '../components/PynBranchBar.vue'
import PynRepoHeader from '../components/PynRepoHeader.vue'
import PynShell from '../components/PynShell.vue'
import PynSideNav from '../components/PynSideNav.vue'
import PynTopBar from '../components/PynTopBar.vue'
import { repoTabs } from '../state/repo.state'
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

/** Repository page mockup: top bar, sidebar, header and branch bar. */
export const RepositoryPage: StoryObj<typeof PynShell> = {
  render: () => ({
    components: { PynShell, PynTopBar, PynSideNav, PynRepoHeader, PynBranchBar },
    setup: () => ({ repos, mainNav, tabs: repoTabs(['read'], false) }),
    template: `
      <PynShell>
        <template #top><PynTopBar user="alice" :repos="['alice/castle-quest']" theme="system" /></template>
        <template #side><PynSideNav account="alice" :items="mainNav" current="" :repos="repos" current-repo="alice/castle-quest" /></template>
        <PynRepoHeader owner="alice" name="castle-quest" visibility="private" :lease-hours="24" role="admin" :tabs="tabs" current="" />
        <PynBranchBar branch="main" :files="128" updated-at="2026-10-08T10:00:00Z" :now="new Date('2026-10-08T12:00:00Z')" />
      </PynShell>`,
  }),
}
