import type { Meta, StoryObj } from '@storybook/vue3'
import PynRepoForm from '../components/PynRepoForm.vue'
import PynSettingsToggle from '../components/PynSettingsToggle.vue'

const meta: Meta<typeof PynRepoForm> = {
  title: 'Repositories/PynRepoForm',
  component: PynRepoForm,
}
export default meta
type Story = StoryObj<typeof PynRepoForm>

export const Create: Story = { args: { owner: 'alice' } }
export const OwnerPicker: Story = {
  args: { owner: 'studio', owners: ['alice', 'studio', 'modding-club'] },
}
export const Edit: Story = {
  args: {
    owner: 'alice',
    repo: { name: 'game', visibility: 'public', lease_hours: 24 },
  },
}
export const EditWithLimit: Story = {
  args: {
    owner: 'alice',
    repo: {
      name: 'game',
      visibility: 'public',
      lease_hours: 24,
      max_locks_per_user_setting: 5,
    },
    effectiveMaxLocks: 5,
  },
}
export const EditDefaultLimit: Story = {
  args: {
    owner: 'alice',
    repo: {
      name: 'game',
      visibility: 'public',
      lease_hours: 24,
      max_locks_per_user_setting: null,
    },
    effectiveMaxLocks: 10,
  },
}
export const LimitSetByPolicy: Story = {
  args: {
    owner: 'alice',
    repo: {
      name: 'game',
      visibility: 'public',
      lease_hours: 24,
      max_locks_per_user_setting: 5,
      max_locks_set_by_policy: true,
    },
    effectiveMaxLocks: 3,
  },
}
export const WithCancel: Story = { args: { owner: 'alice', cancelHref: '/' } }
export const NameTaken: Story = {
  args: {
    owner: 'alice',
    error: 'A repository with that name already exists for this owner.',
  },
}
export const CreationForbidden: Story = {
  args: {
    owner: 'modding-club',
    owners: ['alice', 'modding-club', 'studio'],
    error: 'Members may not create public repositories in modding-club.',
  },
}
export const ReadOnly: Story = {
  args: {
    owner: 'alice',
    repo: { name: 'game', visibility: 'public', lease_hours: 24 },
    readonly: true,
  },
}

const steps = {
  steps: true,
  owner: 'alice',
  owners: ['alice', 'studio'],
  intro: 'Repositories contain a project’s files and version history.',
  suggestion: 'bookish-octo-winner',
  describable: true,
}
export const Steps: Story = { args: steps }
export const StepsWithWebsiteAndTopics: Story = {
  args: { ...steps, websiteField: true, topicsField: true },
}
export const StepsSingleOwner: Story = { args: { ...steps, owners: ['alice'] } }
export const StepsWithPolicyOption: Story = {
  args: steps,
  render: (args) => ({
    components: { PynRepoForm, PynSettingsToggle },
    setup: () => ({ args }),
    template: `<PynRepoForm v-bind="args">
      <template #options>
        <PynSettingsToggle title="Add starter policy" help="Adds a .pyn/pyn.toml that marks common binary assets exclusive." />
      </template>
    </PynRepoForm>`,
  }),
}
export const StepsWithError: Story = {
  args: { ...steps, error: 'A repository with that name already exists for this owner.' },
}
export const StepsWithCancel: Story = { args: { ...steps, cancelHref: '/' } }
export const StepsWithNamePreview: Story = {
  args: { ...steps, nameCanonical: 'my-first-game' },
}
