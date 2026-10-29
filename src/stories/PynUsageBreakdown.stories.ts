import type { Meta, StoryObj } from '@storybook/vue3'
import PynUsageBreakdown from '../components/PynUsageBreakdown.vue'
import { breakdown, emptyBreakdown } from './usage-data'

const meta: Meta<typeof PynUsageBreakdown> = {
  title: 'Usage/PynUsageBreakdown',
  component: PynUsageBreakdown,
  args: { breakdown },
}
export default meta
type Story = StoryObj<typeof PynUsageBreakdown>

export const Default: Story = {}
export const Empty: Story = { args: { breakdown: emptyBreakdown } }
