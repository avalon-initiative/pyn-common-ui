import type { Meta, StoryObj } from '@storybook/vue3'
import PynDashboardActivity from '../components/PynDashboardActivity.vue'
import { now, repoActivity } from './dashboard-data'

const meta: Meta<typeof PynDashboardActivity> = {
  title: 'Dashboard/PynDashboardActivity',
  component: PynDashboardActivity,
  args: { entries: repoActivity, now, viewAllHref: '/_/activity' },
}
export default meta
type Story = StoryObj<typeof PynDashboardActivity>

export const Default: Story = {}
export const Empty: Story = { args: { entries: [] } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load recent activity.' } }
