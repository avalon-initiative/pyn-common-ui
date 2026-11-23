import type { Meta, StoryObj } from '@storybook/vue3'
import PynRecentItems from '../components/PynRecentItems.vue'
import { recent } from './dashboard-data'

const meta: Meta<typeof PynRecentItems> = {
  title: 'Dashboard/PynRecentItems',
  component: PynRecentItems,
  args: { items: recent },
}
export default meta
type Story = StoryObj<typeof PynRecentItems>

export const Default: Story = {}
export const Clearable: Story = { args: { clearable: true } }
export const Empty: Story = { args: { items: [] } }
