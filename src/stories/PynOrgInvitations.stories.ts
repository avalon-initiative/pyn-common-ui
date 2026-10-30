import type { Meta, StoryObj } from '@storybook/vue3'
import PynOrgInvitations from '../components/PynOrgInvitations.vue'
import { orgInvitations } from './org-data'

const meta: Meta<typeof PynOrgInvitations> = {
  title: 'Organizations/PynOrgInvitations',
  component: PynOrgInvitations,
  args: { invitations: orgInvitations },
}
export default meta
type Story = StoryObj<typeof PynOrgInvitations>

export const Default: Story = {}
export const Answering: Story = { args: { busyOrg: 'studio' } }
export const Empty: Story = { args: { invitations: [] } }
export const Failed: Story = {
  args: { error: 'The organization is frozen, so the invitation cannot be accepted.' },
}
