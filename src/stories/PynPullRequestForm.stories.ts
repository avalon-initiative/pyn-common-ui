import type { Meta, StoryObj } from '@storybook/vue3'
import PynPullRequestForm from '../components/PynPullRequestForm.vue'
import { prBranches } from './pull-request-data'

const meta: Meta<typeof PynPullRequestForm> = {
  title: 'Pull requests/PynPullRequestForm',
  component: PynPullRequestForm,
  args: { branches: prBranches, base: 'main', head: 'feature/level-two' },
}
export default meta
type Story = StoryObj<typeof PynPullRequestForm>

export const Default: Story = {}
export const Filled: Story = {
  args: {
    title: 'Add level two and rebalance the tutorial',
    body: 'Adds **Level02** and trims the tutorial.',
    cancelHref: '/acme/castle-quest/pulls',
  },
}
export const NoHeadYet: Story = { args: { head: '' } }
export const SameBranch: Story = { args: { head: 'main' } }
export const Draft: Story = { args: { title: 'Boss arena, first pass', draft: true } }
export const Creating: Story = {
  args: { title: 'Add level two and rebalance the tutorial', busy: true },
}
export const Failed: Story = {
  args: {
    title: 'Add level two and rebalance the tutorial',
    error: 'A pull request for these branches is already open (#42).',
  },
}
export const WithCompareSummary: Story = {
  render: (args) => ({
    components: { PynPullRequestForm },
    setup: () => ({ args }),
    template: `<PynPullRequestForm v-bind="args">
      <template #compare>
        <p style="margin: 0; color: var(--pyn-success)">These branches can be merged automatically. 3 commits, 6 files changed.</p>
      </template>
    </PynPullRequestForm>`,
  }),
}
export const LongBranchNames: Story = {
  args: {
    branches: [
      ...prBranches,
      { name: 'release/2026-11-hotfix' },
      { name: 'feature/castle-quest-level-two-lighting-and-navmesh-rebuild' },
    ],
    base: 'release/2026-11-hotfix',
    head: 'feature/castle-quest-level-two-lighting-and-navmesh-rebuild',
  },
}
