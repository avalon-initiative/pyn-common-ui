import type { Meta, StoryObj } from '@storybook/vue3'
import PynRepoShell from '../components/PynRepoShell.vue'
import PynButton from '../components/PynButton.vue'
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
      <template #actions><PynButton>Clone</PynButton></template>
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
