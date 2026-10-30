import type { Meta, StoryObj } from '@storybook/vue3'
import PynOrgPendingInvitations from '../components/PynOrgPendingInvitations.vue'
import { orgInvitations } from './org-data'

const meta: Meta<typeof PynOrgPendingInvitations> = {
  title: 'Organizations/PynOrgPendingInvitations',
  component: PynOrgPendingInvitations,
  args: { invitations: orgInvitations },
}
export default meta
type Story = StoryObj<typeof PynOrgPendingInvitations>

export const Default: Story = {}
export const Busy: Story = { args: { busy: true } }
export const Empty: Story = { args: { invitations: [] } }
export const Failed: Story = { args: { error: 'No pending invitation for that user.' } }
export const Readonly: Story = { args: { readonly: true } }
