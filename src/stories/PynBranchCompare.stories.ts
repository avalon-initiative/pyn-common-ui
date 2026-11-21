import type { Meta, StoryObj } from '@storybook/vue3'
import PynBranchCompare from '../components/PynBranchCompare.vue'

const changes = [
  { path: 'art/hero.psd', kind: 'modified' as const },
  { path: 'docs/notes.md', kind: 'added' as const },
  { path: 'old/readme.txt', kind: 'deleted' as const },
]

const meta: Meta<typeof PynBranchCompare> = {
  title: 'Browse/PynBranchCompare',
  component: PynBranchCompare,
  args: { base: 'main', head: 'feature/art', status: 'ahead', ahead: 3, behind: 0 },
}
export default meta
type Story = StoryObj<typeof PynBranchCompare>

export const Identical: Story = { args: { status: 'identical', ahead: 0, behind: 0 } }
export const Ahead: Story = {}
export const Behind: Story = { args: { status: 'behind', ahead: 0, behind: 1 } }
export const Diverged: Story = { args: { status: 'diverged', ahead: 3, behind: 2 } }
export const CappedCounts: Story = {
  args: { status: 'diverged', ahead: 1000, behind: 1000, countsCapped: true, maxCommits: 1000 },
}
export const WithChanges: Story = { args: { changes } }
export const Truncated: Story = { args: { changes, truncated: true } }
export const Loading: Story = { args: { loading: true } }
export const ErrorState: Story = { args: { error: 'Could not compare these branches.' } }
