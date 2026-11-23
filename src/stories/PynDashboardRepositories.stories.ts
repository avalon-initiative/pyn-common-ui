import type { Meta, StoryObj } from '@storybook/vue3'
import PynDashboardRepositories from '../components/PynDashboardRepositories.vue'
import { dashboardRepos } from './dashboard-data'

const meta: Meta<typeof PynDashboardRepositories> = {
  title: 'Dashboard/PynDashboardRepositories',
  component: PynDashboardRepositories,
  args: { repos: dashboardRepos },
}
export default meta
type Story = StoryObj<typeof PynDashboardRepositories>

export const Default: Story = {}
export const WithSeeAll: Story = { args: { max: 2, seeAllHref: '/_/repos' } }
export const Empty: Story = { args: { repos: [] } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load your repositories.' } }
