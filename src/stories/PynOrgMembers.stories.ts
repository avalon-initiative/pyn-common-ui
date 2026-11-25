import type { Meta, StoryObj } from '@storybook/vue3'
import PynOrgMembers from '../components/PynOrgMembers.vue'
import PynOrgSettingsLayout from '../components/PynOrgSettingsLayout.vue'
import { orgSettingsNav, orgSettingsPath } from '../state/org.state'
import { orgMembers } from './org-data'
import { aliceIdentity } from './person-data'

const meta: Meta<typeof PynOrgMembers> = {
  title: 'Organizations/PynOrgMembers',
  component: PynOrgMembers,
  args: { members: orgMembers, self: 'alice', owner: true },
}
export default meta
type Story = StoryObj<typeof PynOrgMembers>

export const Owner: Story = {}
export const Member: Story = { args: { self: 'bob', owner: false } }
export const LastOwner: Story = {
  args: {
    error: 'An organization needs at least one owner. Make someone else an owner first.',
  },
}
export const Adding: Story = { args: { adding: true } }
export const NotAUser: Story = { args: { adding: true, error: 'That account does not exist.' } }
export const WithNotice: Story = { args: { notice: 'Invitation sent to dave.' } }
export const WithIdentities: Story = {
  args: {
    members: orgMembers.map((m, i) => (i === 0 ? { ...m, identity: aliceIdentity } : m)),
  },
}

/** Organization settings Members: Add member opens the form under the list. */
export const InSettings: Story = {
  render: (args) => ({
    components: { PynOrgMembers, PynOrgSettingsLayout },
    setup: () => ({
      args,
      sections: orgSettingsNav('owner').map((t) => ({
        id: t.section,
        label: t.label,
        group: t.group,
        icon: t.icon,
        href: orgSettingsPath('studio', t.section),
      })),
    }),
    template: `<PynOrgSettingsLayout :sections="sections" current="members" title="Settings">
      <PynOrgMembers v-bind="args" />
    </PynOrgSettingsLayout>`,
  }),
}
export const InSettingsAdding: Story = { ...InSettings, args: { adding: true } }
