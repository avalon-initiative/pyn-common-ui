import type { Meta, StoryObj } from '@storybook/vue3'
import PynAttention from '../components/PynAttention.vue'
import PynDashboard from '../components/PynDashboard.vue'
import PynDashboardCard from '../components/PynDashboardCard.vue'
import PynDashboardFirstRun from '../components/PynDashboardFirstRun.vue'
import PynDashboardOrganizations from '../components/PynDashboardOrganizations.vue'
import PynDashboardRepositories from '../components/PynDashboardRepositories.vue'
import PynRecentItems from '../components/PynRecentItems.vue'
import PynViewAction from '../components/PynViewAction.vue'
import PynViewHeader from '../components/PynViewHeader.vue'
import { orgInvitations, orgs } from './org-data'
import { dashboardRepos, heldLocks, notices, now, recent } from './dashboard-data'

const meta: Meta<typeof PynDashboard> = {
  title: 'Dashboard/PynDashboard',
  component: PynDashboard,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof PynDashboard>

const parts = {
  PynAttention,
  PynDashboard,
  PynDashboardCard,
  PynDashboardFirstRun,
  PynDashboardOrganizations,
  PynDashboardRepositories,
  PynRecentItems,
  PynViewAction,
  PynViewHeader,
}
const setup = () => ({ dashboardRepos, orgs, orgInvitations, heldLocks, notices, recent, now })

const full = `
  <PynDashboard>
    <template #header>
      <PynViewHeader title="Dashboard">
        <PynViewAction href="/_/explore">Explore</PynViewAction>
        <PynViewAction href="/_/new" primary>New repository</PynViewAction>
      </PynViewHeader>
    </template>
    <template #main>
      <PynDashboardRepositories :repos="dashboardRepos" />
      <PynDashboardCard heading="Recently opened"><PynRecentItems :items="recent" clearable /></PynDashboardCard>
    </template>
    <template #side>
      <PynDashboardCard heading="Needs your attention">
        <PynAttention :locks="heldLocks" :invitations="orgInvitations" :notices="notices" :now="now" />
      </PynDashboardCard>
      <PynDashboardOrganizations :orgs="orgs" />
    </template>
  </PynDashboard>`

export const Default: Story = { render: () => ({ components: parts, setup, template: full }) }

export const FirstRun: Story = {
  render: () => ({
    components: parts,
    template: `
      <PynDashboard>
        <template #main><PynDashboardFirstRun /></template>
      </PynDashboard>`,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: parts,
    template: `
      <PynDashboard>
        <template #main><PynDashboardRepositories :repos="[]" loading /></template>
        <template #side><PynDashboardCard heading="Needs your attention" loading /></template>
      </PynDashboard>`,
  }),
}

export const Errors: Story = {
  render: () => ({
    components: parts,
    template: `
      <PynDashboard>
        <template #main><PynDashboardRepositories :repos="[]" error="Could not load your repositories." /></template>
        <template #side><PynDashboardCard heading="Needs your attention" error="Could not load." /></template>
      </PynDashboard>`,
  }),
}

export const CaughtUp: Story = {
  render: () => ({
    components: parts,
    setup,
    template: `
      <PynDashboard>
        <template #main><PynDashboardRepositories :repos="dashboardRepos" /></template>
        <template #side>
          <PynDashboardCard heading="Needs your attention"><PynAttention /></PynDashboardCard>
          <PynDashboardOrganizations :orgs="[]" />
        </template>
      </PynDashboard>`,
  }),
}

export const Narrow: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => ({ components: parts, setup, template: full }),
}
