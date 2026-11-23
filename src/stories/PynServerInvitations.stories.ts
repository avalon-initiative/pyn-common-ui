import type { Meta, StoryObj } from '@storybook/vue3'
import PynServerInvitations from '../components/PynServerInvitations.vue'
import { invitations, roles, targets } from './server-invitation-data'

const meta: Meta<typeof PynServerInvitations> = {
  title: 'Admin/PynServerInvitations',
  component: PynServerInvitations,
  args: { invitations, targets, roles, serverUrl: 'https://pyn.example.com' },
}
export default meta
type Story = StoryObj<typeof PynServerInvitations>

export const Default: Story = {}
export const Empty: Story = { args: { invitations: [] } }
export const CodeShown: Story = { args: { created: 'pynv_a1b2c3d4e5f6' + '0'.repeat(8) } }
export const CodeShownAndEmailed: Story = {
  args: { created: 'pynv_a1b2c3d4e5f6' + '0'.repeat(8), emailed: true },
}
export const NoGrantOptions: Story = { args: { targets: [], roles: [] } }
export const Busy: Story = { args: { busy: true } }
export const Failed: Story = { args: { error: 'repository alice/site does not exist.' } }
