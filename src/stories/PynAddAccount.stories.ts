import type { Meta, StoryObj } from '@storybook/vue3'
import PynAddAccount from '../components/PynAddAccount.vue'

const meta: Meta<typeof PynAddAccount> = {
  title: 'Admin/PynAddAccount',
  component: PynAddAccount,
}
export default meta
type Story = StoryObj<typeof PynAddAccount>

export const Default: Story = {}
export const Busy: Story = { args: { busy: true } }
export const Failed: Story = { args: { error: 'That user name is taken.' } }
