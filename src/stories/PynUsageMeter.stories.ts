import type { Meta, StoryObj } from '@storybook/vue3'
import PynUsageMeter from '../components/PynUsageMeter.vue'

const GB = 1024 ** 3

const meta: Meta<typeof PynUsageMeter> = {
  title: 'Usage/PynUsageMeter',
  component: PynUsageMeter,
  args: { label: 'Storage', unit: 'bytes', used: 4 * GB, limit: 10 * GB },
}
export default meta
type Story = StoryObj<typeof PynUsageMeter>

export const Default: Story = {}
export const NearLimit: Story = { args: { used: 9 * GB } }
export const OverLimit: Story = { args: { used: 12 * GB } }
export const Unlimited: Story = { args: { limit: null } }
export const Count: Story = { args: { label: 'Repositories', unit: 'count', used: 3, limit: 10 } }
