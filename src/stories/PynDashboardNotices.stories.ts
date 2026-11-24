import type { Meta, StoryObj } from '@storybook/vue3'
import PynDashboardNotices from '../components/PynDashboardNotices.vue'
import { instanceNotices, now } from './dashboard-data'

const meta: Meta<typeof PynDashboardNotices> = {
  title: 'Dashboard/PynDashboardNotices',
  component: PynDashboardNotices,
  args: {
    notices: instanceNotices,
    now,
    viewAllHref: '/_/notices',
    viewAllLabel: 'View all notices',
  },
}
export default meta
type Story = StoryObj<typeof PynDashboardNotices>

export const Default: Story = {}
export const Empty: Story = { args: { notices: [] } }
