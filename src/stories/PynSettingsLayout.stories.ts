import type { Meta, StoryObj } from '@storybook/vue3'
import PynSettingsLayout from '../components/PynSettingsLayout.vue'
import PynButton from '../components/PynButton.vue'
import PynOrgSettingsLayout from '../components/PynOrgSettingsLayout.vue'
import PynRepoForm from '../components/PynRepoForm.vue'
import { adminNavItems } from '../state/shell.state'

const sections = [
  { id: 'profile', label: 'Profile', href: '/_/settings/profile' },
  { id: 'emails', label: 'Emails', href: '/_/settings/emails' },
  { id: 'password', label: 'Password', group: 'Access', href: '/_/settings/password' },
  { id: 'keys', label: 'SSH keys', group: 'Access', href: '/_/settings/keys' },
  { id: 'tokens', label: 'Access tokens', group: 'Access', href: '/_/settings/tokens' },
  { id: 'delete', label: 'Delete account', group: 'Danger zone', href: '/_/settings/delete' },
]

const meta: Meta<typeof PynSettingsLayout> = {
  title: 'Shell/PynSettingsLayout',
  component: PynSettingsLayout,
  args: { sections, current: 'keys', label: 'Account settings', title: 'Settings' },
  render: (args) => ({
    components: { PynSettingsLayout, PynButton },
    setup: () => ({ args }),
    template: `<PynSettingsLayout v-bind="args">
      <template v-if="args.variant" #actions><PynButton>Leave administration</PynButton></template>
      <p>Page content</p>
    </PynSettingsLayout>`,
  }),
}
export default meta
type Story = StoryObj<typeof PynSettingsLayout>

export const Default: Story = {}
export const WithRepositoryForm: Story = {
  args: { title: 'General' },
  render: (args) => ({
    components: { PynSettingsLayout, PynRepoForm },
    setup: () => ({ args }),
    template: `<PynSettingsLayout v-bind="args">
      <PynRepoForm owner="studio" :repo="{ name: 'game', visibility: 'private', lease_hours: 8 }" />
    </PynSettingsLayout>`,
  }),
}
export const Untitled: Story = { args: { title: undefined } }
export const Administration: Story = {
  args: {
    sections: adminNavItems(),
    current: 'audit',
    label: 'Server administration',
    title: 'Server administration',
    variant: 'admin',
  },
}
export const Organization: StoryObj<typeof PynOrgSettingsLayout> = {
  render: () => ({
    components: { PynOrgSettingsLayout },
    setup: () => ({
      sections: [
        { id: 'general', label: 'General', href: '/studio/-/settings' },
        { id: 'policy', label: 'Repository policy', href: '/studio/-/settings/policy' },
      ],
    }),
    template:
      '<PynOrgSettingsLayout :sections="sections" current="general" title="Settings"><p>Page content</p></PynOrgSettingsLayout>',
  }),
}
