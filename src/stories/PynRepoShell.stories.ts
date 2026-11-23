import type { Meta, StoryObj } from '@storybook/vue3'
import PynRepoShell from '../components/PynRepoShell.vue'
import PynBranchBar from '../components/PynBranchBar.vue'
import PynBreadcrumb from '../components/PynBreadcrumb.vue'
import PynButton from '../components/PynButton.vue'
import PynCloneMenu from '../components/PynCloneMenu.vue'
import { repoShellTabs } from '../state/repo.state'

const admin = ['read', 'manage_users', 'manage_roles', 'view_audit']

const meta: Meta<typeof PynRepoShell> = {
  title: 'Repository/PynRepoShell',
  component: PynRepoShell,
  args: {
    owner: 'studio',
    name: 'game',
    visibility: 'private',
    tabs: repoShellTabs(admin, true),
    current: '',
  },
  render: (args) => ({
    components: { PynRepoShell, PynButton },
    setup: () => ({ args }),
    template: `<PynRepoShell v-bind="args">
      <template #actions><PynButton label="Clone" /></template>
      <p>Page content</p>
    </PynRepoShell>`,
  }),
}
export default meta
type Story = StoryObj<typeof PynRepoShell>

export const Default: Story = {}
export const Counts: Story = {
  args: {
    tabs: [
      { section: '', label: 'Code' },
      { section: 'locks', label: 'Locks', count: 3 },
      { section: 'history', label: 'History' },
      { section: 'settings', label: 'Settings' },
    ],
    current: 'locks',
  },
}
export const PublicReader: Story = {
  args: { visibility: 'public', tabs: repoShellTabs(['read'], false), current: 'history' },
}
export const WithInsights: Story = {
  args: { tabs: repoShellTabs(admin, true, { insights: true }), current: 'insights' },
}
export const SettingsOpen: Story = { args: { current: 'settings/members' } }
export const NoAccess: Story = { args: { tabs: undefined } }
export const HidePath: Story = { args: { hidePath: true } }
export const OnBranch: Story = { args: { branch: 'feature/levels' } }
export const LockStrip: Story = {
  args: { lockedCount: 3, lockHolders: ['jamie', 'riley', 'sam', 'alex', 'lee'], current: 'locks' },
}
export const OneLock: Story = { args: { lockedCount: 1, lockHolders: ['jamie'] } }
export const MoreMenu: Story = { args: { maxTabs: 3, current: 'settings' } }
export const LockPending: Story = { args: { lockPending: true } }

export const HeaderActions: Story = {
  render: (args) => ({
    components: { PynRepoShell, PynButton, PynCloneMenu },
    setup: () => ({ args }),
    template: `<PynRepoShell v-bind="args">
      <template #watch><PynButton label="Watch" variant="secondary" /></template>
      <template #fork><PynButton label="Fork" variant="secondary" /></template>
      <template #star><PynButton label="Star" variant="secondary" /></template>
      <template #actions><PynCloneMenu https-url="https://pyn.example.com/studio/game.pyn" command="pyn clone studio/game" /></template>
      <p>Page content</p>
    </PynRepoShell>`,
  }),
}

const branches = [
  { name: 'main', isDefault: true, updatedAt: '2026-10-08T10:00:00Z' },
  { name: 'feature/rig-update', updatedAt: '2026-10-05T09:30:00Z' },
  { name: 'release/1.0', updatedAt: '2026-09-20T16:00:00Z' },
]

const codeTab = (args: object) => ({
  components: { PynRepoShell, PynBranchBar, PynBreadcrumb, PynCloneMenu },
  setup: () => ({
    args,
    branches,
    crumbs: [
      { label: 'game', href: '/studio/game' },
      { label: 'assets', href: '/studio/game/tree/assets' },
      { label: 'characters' },
    ],
    now: new Date('2026-10-08T12:00:00Z'),
  }),
  template: `<div style="min-height: 24rem">
    <PynRepoShell v-bind="args">
      <PynBranchBar branch="main" :branches="branches" branches-href="/studio/game/branches" :branch-count="3" :now="now">
        <PynBreadcrumb :crumbs="crumbs" />
        <template #actions><PynCloneMenu https-url="https://pyn.example.com/studio/game.pyn" command="pyn clone studio/game" /></template>
      </PynBranchBar>
    </PynRepoShell>
  </div>`,
})

export const CodeTab: Story = { args: { lockedCount: 2, lockHolders: ['jamie'] }, render: codeTab }
export const CodeTabPickerOpen: Story = {
  render: codeTab,
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>('button[aria-haspopup=listbox]')?.click()
    await new Promise((resolve) => setTimeout(resolve))
  },
}
