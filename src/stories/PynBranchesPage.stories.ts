import type { Meta, StoryObj } from '@storybook/vue3'
import PynBranchesPage from '../components/PynBranchesPage.vue'
import { branchesPageBranches } from './branches-page-data'

const hrefs = {
  branches: '/alice/game/branches',
  yours: '/alice/game/branches/yours',
  active: '/alice/game/branches/active',
  stale: '/alice/game/branches/stale',
  all: '/alice/game/branches/all',
}
const meta: Meta<typeof PynBranchesPage> = {
  title: 'Browse/PynBranchesPage',
  component: PynBranchesPage,
  args: {
    now: new Date('2026-11-22T12:00:00Z'),
    branches: branchesPageBranches,
    defaultBranch: 'main',
    hrefs,
    canDelete: true,
  },
}
export default meta
type Story = StoryObj<typeof PynBranchesPage>

export const Default: Story = {}
export const WithFilters: Story = {
  args: {
    yours: ['level-3-rework', 'audio-pass'],
    active: ['dependabot/npm/vite-5', 'level-3-rework'],
    stale: ['old-experiment'],
  },
}
export const Yours: Story = {
  args: { ...WithFilters.args, view: 'yours' },
}
export const AllBranches: Story = { args: { view: 'all' } }
export const Searching: Story = { args: { query: 'level' } }
export const NoMatches: Story = { args: { query: 'zzz' } }
export const ReadOnly: Story = { args: { canDelete: false, canCreate: false } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load branches.' } }
export const Mobile: Story = {
  args: WithFilters.args,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
