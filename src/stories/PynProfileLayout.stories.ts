import type { Meta, StoryObj } from '@storybook/vue3'
import PynProfileHeader from '../components/PynProfileHeader.vue'
import PynProfileLayout from '../components/PynProfileLayout.vue'
import { activity, orgs, profile, repos } from './profile-data'

const meta: Meta<typeof PynProfileLayout> = {
  title: 'Profile/PynProfileLayout',
  component: PynProfileLayout,
  args: { repos, orgs, activityEntries: activity, now: new Date('2026-11-15T12:00:00Z') },
  render: (args) => ({
    components: { PynProfileLayout, PynProfileHeader },
    setup: () => ({ args, profile }),
    template:
      '<PynProfileLayout v-bind="args"><template #header><PynProfileHeader v-bind="profile" /></template></PynProfileLayout>',
  }),
}
export default meta
type Story = StoryObj<typeof PynProfileLayout>

export const Default: Story = {}
export const SignedOut: Story = { args: { orgs: [], activityEntries: undefined } }
export const NoRepositories: Story = { args: { repos: [] } }
