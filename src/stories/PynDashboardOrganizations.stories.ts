import type { Meta, StoryObj } from '@storybook/vue3'
import PynDashboardOrganizations from '../components/PynDashboardOrganizations.vue'
import { orgs } from './org-data'

const meta: Meta<typeof PynDashboardOrganizations> = {
  title: 'Dashboard/PynDashboardOrganizations',
  component: PynDashboardOrganizations,
  args: { orgs },
}
export default meta
type Story = StoryObj<typeof PynDashboardOrganizations>

export const Default: Story = {}
export const Empty: Story = { args: { orgs: [] } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load your organizations.' } }
