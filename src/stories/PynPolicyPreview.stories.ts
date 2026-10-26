import type { Meta, StoryObj } from '@storybook/vue3'
import PynPolicyPreview from '../components/PynPolicyPreview.vue'
import type { PolicyPreview } from '../types/policy.types'

const preview: PolicyPreview = {
  to_exclusive: ['art/hero.psd', 'art/logo.psd', 'levels/forest.map'],
  to_shared: ['docs/design.md'],
  released_locks: [
    {
      path: 'docs/design.md',
      owner: 'wendy',
      acquired_at: '2026-10-26T09:00:00Z',
      expires_at: '2026-10-26T17:00:00Z',
    },
  ],
  stranded: [
    {
      path: 'levels/forest.map',
      branch: 'feature/rework',
      branch_owner: 'sam',
      revision: 7,
      commit: '3f2a9c1',
      author: 'sam',
      created_at: '2026-10-20T12:00:00Z',
    },
  ],
}

const meta: Meta<typeof PynPolicyPreview> = {
  title: 'Policy/PynPolicyPreview',
  component: PynPolicyPreview,
  args: { preview },
}
export default meta
type Story = StoryObj<typeof PynPolicyPreview>

export const Default: Story = {}
export const OneDirection: Story = {
  args: { preview: { to_exclusive: ['art/hero.psd'], to_shared: [], released_locks: [] } },
}
export const NoChanges: Story = {
  args: { preview: { to_exclusive: [], to_shared: [], released_locks: [] } },
}
export const Loading: Story = { args: { preview: null, loading: true } }
export const Failed: Story = {
  args: { preview: null, error: 'The server is unreachable.' },
}
export const Saving: Story = { args: { busy: true } }
