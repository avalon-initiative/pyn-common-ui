import type { Meta, StoryObj } from '@storybook/vue3'
import PynAccounts from '../components/PynAccounts.vue'
import { accounts, adminAccounts, pendingAccounts } from './admin-data'

const meta: Meta<typeof PynAccounts> = {
  title: 'Admin/PynAccounts',
  component: PynAccounts,
  args: { accounts, status: '', self: 'root' },
}
export default meta
type Story = StoryObj<typeof PynAccounts>

export const Default: Story = {}
export const WaitingForApproval: Story = {
  args: { accounts: accounts.slice(1, 2), status: 'pending_approval' },
}
export const Failed: Story = {
  args: { error: 'That account does not exist.' },
}
export const None: Story = { args: { accounts: [], status: 'active' } }
export const ScheduledDeletion: Story = {
  args: { accounts: accounts.slice(3), status: 'disabled' },
}
export const Administrators: Story = { args: { accounts: adminAccounts } }
export const LastAdministrator: Story = {
  args: { accounts: adminAccounts, canRevokeAdmin: false },
}
export const Busy: Story = { args: { accounts: adminAccounts, busy: true } }
export const PendingConfirmation: Story = { args: { accounts: pendingAccounts } }
export const ResendingConfirmation: Story = {
  args: { accounts: pendingAccounts, resendingUser: 'carol' },
}
