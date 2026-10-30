import type { Meta, StoryObj } from '@storybook/vue3'
import PynOrgInvitation from '../components/PynOrgInvitation.vue'
import { orgInvitations } from './org-data'

const meta: Meta<typeof PynOrgInvitation> = {
  title: 'Organizations/PynOrgInvitation',
  component: PynOrgInvitation,
  args: { invitation: orgInvitations[0] },
}
export default meta
type Story = StoryObj<typeof PynOrgInvitation>

export const Default: Story = {}
export const Busy: Story = { args: { busy: true } }
