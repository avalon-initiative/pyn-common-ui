import type { Meta, StoryObj } from '@storybook/vue3'
import PynRepoSettings from '../components/PynRepoSettings.vue'
import { repoSettingsNav } from '../state/repo.state'

const meta: Meta<typeof PynRepoSettings> = {
  title: 'Repository/PynRepoSettings',
  component: PynRepoSettings,
  args: {
    owner: 'studio',
    name: 'game',
    items: repoSettingsNav(['manage_users', 'manage_roles', 'view_audit', 'edit_policy'], true),
    current: 'members',
  },
  render: (args) => ({
    components: { PynRepoSettings },
    setup: () => ({ args }),
    template: '<PynRepoSettings v-bind="args"><p>Page content</p></PynRepoSettings>',
  }),
}
export default meta
type Story = StoryObj<typeof PynRepoSettings>

export const Default: Story = {}
export const General: Story = { args: { current: 'settings' } }
export const Policy: Story = { args: { current: 'policy' } }
export const AuditorOnly: Story = {
  args: { items: repoSettingsNav(['view_audit'], false), current: 'audit' },
}
