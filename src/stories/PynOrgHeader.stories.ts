import type { Meta, StoryObj } from '@storybook/vue3'
import PynOrgHeader from '../components/PynOrgHeader.vue'

const meta: Meta<typeof PynOrgHeader> = {
  title: 'Organizations/PynOrgHeader',
  component: PynOrgHeader,
  args: { name: 'studio', createdAt: '2026-09-02T08:00:00Z' },
}
export default meta
type Story = StoryObj<typeof PynOrgHeader>

export const Owner: Story = { args: { role: 'owner', current: '' } }
export const OwnerUsage: Story = { args: { role: 'owner', current: 'usage' } }
export const Member: Story = { args: { role: 'member', current: 'members' } }
export const Visitor: Story = {}
export const Full: Story = {
  args: {
    role: 'owner',
    displayName: 'Studio Games',
    description: 'We make levels, tools and the occasional boss fight.',
    avatarUrl: null,
    url: 'https://studio.example',
  },
}
export const NarrowOwner: Story = {
  args: { role: 'owner', current: 'settings' },
  render: (args) => ({
    components: { PynOrgHeader },
    setup: () => ({ args }),
    template: `<div style="max-width: 22rem"><PynOrgHeader v-bind="args" /></div>`,
  }),
}
