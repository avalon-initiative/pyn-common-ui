import type { Meta, StoryObj } from '@storybook/vue3'
import PynAddAccount from '../components/PynAddAccount.vue'

const meta: Meta<typeof PynAddAccount> = {
  title: 'Admin/PynAddAccount',
  component: PynAddAccount,
}
export default meta
type Story = StoryObj<typeof PynAddAccount>

export const Default: Story = {}
export const Adding: Story = { args: { adding: true } }
export const Busy: Story = { args: { adding: true, busy: true } }
export const Failed: Story = { args: { adding: true, error: 'That user name is taken.' } }
