import type { Meta, StoryObj } from '@storybook/vue3'
import PynEmptyState from '../components/PynEmptyState.vue'
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
export const EmptySilenced: Story = { args: { invitations: [], empty: '' } }
export const EmptySlot: Story = {
  args: { invitations: [] },
  render: (args) => ({
    components: { PynOrgInvitations, PynEmptyState },
    setup: () => ({ args }),
    template: `<PynOrgInvitations v-bind="args"><template #empty><PynEmptyState title="Nothing here yet" description="Custom empty state." compact /></template></PynOrgInvitations>`,
  }),
}
