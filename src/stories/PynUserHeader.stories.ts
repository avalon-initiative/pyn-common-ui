import type { Meta, StoryObj } from '@storybook/vue3'
import PynUserHeader from '../components/PynUserHeader.vue'

const meta: Meta<typeof PynUserHeader> = {
  title: 'Organizations/PynUserHeader',
  component: PynUserHeader,
  args: { name: 'alice' },
}
export default meta
type Story = StoryObj<typeof PynUserHeader>

export const OwnProfile: Story = { args: { self: true, current: '' } }
export const OwnUsage: Story = { args: { self: true, current: 'usage' } }
export const OtherUser: Story = {}
