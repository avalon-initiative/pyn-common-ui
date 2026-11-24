import type { Meta, StoryObj } from '@storybook/vue3'
import PynDiffStat from '../components/PynDiffStat.vue'

const meta: Meta<typeof PynDiffStat> = {
  title: 'Diff/PynDiffStat',
  component: PynDiffStat,
  args: { additions: 474, deletions: 468 },
}
export default meta
type Story = StoryObj<typeof PynDiffStat>

export const Balanced: Story = {}
export const MostlyAdditions: Story = { args: { additions: 90, deletions: 4 } }
export const Plain: Story = { args: { plain: true } }
export const NoChanges: Story = { args: { additions: 0, deletions: 0 } }
