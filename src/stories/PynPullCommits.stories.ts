import type { Meta, StoryObj } from '@storybook/vue3'
import PynPullCommits from '../components/PynPullCommits.vue'
import { now } from './landing-data'
import { pullCommits } from './pull-request-data'

const meta: Meta<typeof PynPullCommits> = {
  title: 'Pull requests/PynPullCommits',
  component: PynPullCommits,
  args: { commits: pullCommits, now },
}
export default meta
type Story = StoryObj<typeof PynPullCommits>

export const Default: Story = {}
export const Empty: Story = { args: { commits: [] } }
