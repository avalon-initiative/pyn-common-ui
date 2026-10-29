import type { Meta, StoryObj } from '@storybook/vue3'
import PynOwnerUsage from '../components/PynOwnerUsage.vue'
import { ownerUsage, unlimitedOwnerUsage } from './usage-data'

const meta: Meta<typeof PynOwnerUsage> = {
  title: 'Usage/PynOwnerUsage',
  component: PynOwnerUsage,
  args: { usage: ownerUsage },
}
export default meta
type Story = StoryObj<typeof PynOwnerUsage>

export const Organization: Story = {}
export const UserUnlimited: Story = { args: { usage: unlimitedOwnerUsage } }
export const NoRepositories: Story = {
  args: { usage: { ...unlimitedOwnerUsage, repositories: [] } },
}
