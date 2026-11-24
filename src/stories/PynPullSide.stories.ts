import type { Meta, StoryObj } from '@storybook/vue3'
import PynPullSide from '../components/PynPullSide.vue'
import { closedPull, emptyPull, openPull } from './pull-request-data'

const meta: Meta<typeof PynPullSide> = {
  title: 'Pull requests/PynPullSide',
  component: PynPullSide,
  decorators: [() => ({ template: '<div style="width: 18.5rem"><story /></div>' })],
  args: { pull: openPull, canManage: true },
}
export default meta
type Story = StoryObj<typeof PynPullSide>

export const Open: Story = {}
export const Closed: Story = { args: { pull: closedPull } }
export const NoParticipants: Story = { args: { pull: emptyPull } }
export const ReadOnly: Story = { args: { canManage: false } }
