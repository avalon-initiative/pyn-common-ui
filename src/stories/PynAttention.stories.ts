import type { Meta, StoryObj } from '@storybook/vue3'
import PynAttention from '../components/PynAttention.vue'
import { orgInvitations } from './org-data'
import { heldLocks, manyLocks, notices, now } from './dashboard-data'

const meta: Meta<typeof PynAttention> = {
  title: 'Dashboard/PynAttention',
  component: PynAttention,
  args: { now },
}
export default meta
type Story = StoryObj<typeof PynAttention>

export const Everything: Story = {
  args: { locks: heldLocks, invitations: orgInvitations, notices },
}
export const LocksOnly: Story = { args: { locks: heldLocks } }
export const ManyLocks: Story = { args: { locks: manyLocks } }
export const InvitationsOnly: Story = { args: { invitations: orgInvitations } }
export const NoticesOnly: Story = { args: { notices } }
export const CaughtUp: Story = {}
