import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import PynAvatar from '../components/PynAvatar.vue'
import PynButton from '../components/PynButton.vue'
import PynSettingsGeneral from '../components/PynSettingsGeneral.vue'
import PynSettingsLayout from '../components/PynSettingsLayout.vue'
import PynSettingsRow from '../components/PynSettingsRow.vue'
import PynSettingsSection from '../components/PynSettingsSection.vue'
import PynSettingsToggle from '../components/PynSettingsToggle.vue'
import PynRepoForm from '../components/PynRepoForm.vue'
import PynOrgSettings from '../components/PynOrgSettings.vue'

const meta: Meta<typeof PynSettingsSection> = {
  title: 'Shell/Settings sections',
  component: PynSettingsSection,
}
export default meta
type Story = StoryObj<typeof PynSettingsSection>

const repoSections = [
  { id: 'settings', label: 'General', icon: 'settings', href: '/studio/game/settings' },
  {
    id: 'members',
    label: 'Members',
    group: 'Access',
    icon: 'user',
    href: '/studio/game/settings/members',
  },
  {
    id: 'roles',
    label: 'Roles',
    group: 'Access',
    icon: 'key',
    href: '/studio/game/settings/roles',
  },
  {
    id: 'invites',
    label: 'Invitations',
    group: 'Access',
    icon: 'plus',
    href: '/studio/game/settings/invites',
  },
  {
    id: 'policy',
    label: 'Policy',
    group: 'Collaboration',
    icon: 'lock',
    href: '/studio/game/settings/policy',
  },
  {
    id: 'storage',
    label: 'Storage',
    group: 'Collaboration',
    icon: 'folder',
    href: '/studio/game/settings/storage',
  },
  {
    id: 'audit',
    label: 'Audit log',
    group: 'Collaboration',
    icon: 'history',
    href: '/studio/game/settings/audit',
  },
]

const orgSections = [
  { id: 'general', label: 'General', icon: 'settings', href: '/studio/-/settings' },
  {
    id: 'members',
    label: 'Members',
    group: 'Access',
    icon: 'user',
    href: '/studio/-/settings/members',
  },
  { id: 'teams', label: 'Teams', group: 'Access', icon: 'user', href: '/studio/-/settings/teams' },
  {
    id: 'policy',
    label: 'Repository policy',
    group: 'Repositories',
    icon: 'lock',
    href: '/studio/-/settings/policy',
  },
]

export const Rows: Story = {
  args: { title: 'Collaboration', description: 'How people work together in this repository.' },
  render: (args) => ({
    components: { PynSettingsSection, PynSettingsRow, PynSettingsToggle, PynButton },
    setup: () => ({ args, on: ref(true), off: ref(false) }),
    template: `<PynSettingsSection v-bind="args">
      <PynSettingsRow title="Visibility" help="Who can see this repository."><PynButton label="Change visibility" variant="secondary" /></PynSettingsRow>
      <PynSettingsToggle v-model="on" title="Read-only until locked" help="Exclusive files stay read-only in work trees until their lock is taken." />
      <PynSettingsToggle v-model="off" title="Require a lock note" help="Ask for a reason when taking a lock." />
    </PynSettingsSection>`,
  }),
}

export const DangerZone: Story = {
  args: { title: 'Danger zone', danger: true },
  render: (args) => ({
    components: { PynSettingsSection, PynSettingsRow, PynButton },
    setup: () => ({ args }),
    template: `<PynSettingsSection v-bind="args">
      <PynSettingsRow title="Transfer ownership" help="Move this repository to another owner."><PynButton label="Transfer" variant="danger" /></PynSettingsRow>
      <PynSettingsRow title="Delete this repository" help="Removes its files, history and locks. The audit log is kept."><PynButton label="Delete repository" variant="danger" /></PynSettingsRow>
    </PynSettingsSection>`,
  }),
}

export const General: StoryObj<typeof PynSettingsGeneral> = {
  render: () => ({
    components: { PynSettingsGeneral, PynAvatar, PynButton, PynOrgSettings },
    template: `<PynSettingsGeneral picture-title="Profile picture">
      <PynOrgSettings :settings="{ exclusive_read_only: null }" />
      <template #picture>
        <PynAvatar username="studio" size="xl" />
        <PynButton label="Upload new picture" variant="secondary" />
      </template>
    </PynSettingsGeneral>`,
  }),
}

export const RepositorySettings: StoryObj<typeof PynSettingsLayout> = {
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: {
      PynSettingsLayout,
      PynSettingsSection,
      PynSettingsRow,
      PynSettingsToggle,
      PynRepoForm,
      PynButton,
    },
    setup: () => ({ sections: repoSections, on: ref(true) }),
    template: `<PynSettingsLayout :sections="sections" current="settings" label="Repository settings" title="General">
      <PynSettingsSection title="Repository" plain>
        <PynRepoForm owner="studio" :repo="{ name: 'game', visibility: 'private', lease_hours: 8 }" />
      </PynSettingsSection>
      <PynSettingsSection title="Exclusive files">
        <PynSettingsToggle v-model="on" title="Read-only until locked" help="Exclusive files stay read-only in work trees until their lock is taken." />
      </PynSettingsSection>
      <PynSettingsSection title="Danger zone" danger>
        <PynSettingsRow title="Delete this repository" help="Removes its files, history and locks. The audit log is kept."><PynButton label="Delete repository" variant="danger" /></PynSettingsRow>
      </PynSettingsSection>
    </PynSettingsLayout>`,
  }),
}

export const OrganizationSettings: StoryObj<typeof PynSettingsLayout> = {
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: {
      PynSettingsLayout,
      PynSettingsSection,
      PynSettingsGeneral,
      PynSettingsRow,
      PynSettingsToggle,
      PynOrgSettings,
      PynAvatar,
      PynButton,
    },
    setup: () => ({ sections: orgSections, on: ref(false) }),
    template: `<PynSettingsLayout :sections="sections" current="general" label="Organization settings" title="General">
      <PynSettingsGeneral picture-title="Profile picture">
        <PynOrgSettings :settings="{ exclusive_read_only: null }" />
        <template #picture>
          <PynAvatar username="studio" size="xl" />
          <PynButton label="Upload new picture" variant="secondary" />
        </template>
      </PynSettingsGeneral>
      <PynSettingsSection title="Members">
        <PynSettingsToggle v-model="on" title="Members create repositories" help="Let any member create a repository under this organization." />
      </PynSettingsSection>
      <PynSettingsSection title="Danger zone" danger>
        <PynSettingsRow title="Delete this organization" help="Removes the organization and its repositories."><PynButton label="Delete organization" variant="danger" /></PynSettingsRow>
      </PynSettingsSection>
    </PynSettingsLayout>`,
  }),
}
