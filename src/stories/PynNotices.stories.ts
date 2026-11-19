import type { Meta, StoryObj } from '@storybook/vue3'
import PynNotices from '../components/PynNotices.vue'
import { notices } from './two-factor-data'

const meta: Meta<typeof PynNotices> = {
  title: 'Account/PynNotices',
  component: PynNotices,
  args: { notices },
}
export default meta
type Story = StoryObj<typeof PynNotices>

export const Default: Story = {}
export const Busy: Story = { args: { busy: true } }
