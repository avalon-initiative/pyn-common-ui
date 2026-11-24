import type { Meta, StoryObj } from '@storybook/vue3'
import PynPullRequestHeader from '../components/PynPullRequestHeader.vue'
import PynPullRequestBar from '../components/PynPullRequestBar.vue'
import { now } from './landing-data'
import { closedPull, mergedPull, openPull } from './pull-request-data'

const meta: Meta<typeof PynPullRequestHeader> = {
  title: 'Pull requests/PynPullRequestHeader',
  component: PynPullRequestHeader,
  args: { pull: openPull, now, editable: true },
}
export default meta
type Story = StoryObj<typeof PynPullRequestHeader>

export const Open: Story = {}
export const Merged: Story = { args: { pull: mergedPull } }
export const Closed: Story = { args: { pull: closedPull } }
export const StickyBar: Story = {
  render: () => ({
    components: { PynPullRequestBar },
    template:
      '<PynPullRequestBar :number="42" title="Add level two and rebalance the tutorial" state="open"><button type=\'button\'>Merge status</button></PynPullRequestBar>',
  }),
}
