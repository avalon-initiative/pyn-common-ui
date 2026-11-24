import type { Meta, StoryObj } from '@storybook/vue3'
import PynButton from '../components/PynButton.vue'
import PynEmptyState from '../components/PynEmptyState.vue'
import PynRepoList from '../components/PynRepoList.vue'

const meta: Meta<typeof PynRepoList> = {
  title: 'Repositories/PynRepoList',
  component: PynRepoList,
}
export default meta
type Story = StoryObj<typeof PynRepoList>

const repo = (owner: string, name: string, role: string, visibility = 'private') => ({
  id: `repo-${owner}-${name}`,
  owner_id: `owner-${owner}`,
  owner,
  name,
  visibility: visibility as 'private' | 'public',
  max_locks_per_user: 10,
  max_locks_set_by_policy: false,
  lease_hours: 8,
  created_at: '2026-10-01T09:00:00Z',
  role,
})

export const Repositories: Story = {
  args: {
    repos: [
      repo('alice', 'game', 'admin'),
      repo('alice', 'tools', 'admin', 'public'),
      repo('bob', 'assets', 'writer'),
    ],
  },
}
export const Filterable: Story = {
  args: {
    repos: [repo('alice', 'game', 'admin'), repo('bob', 'assets', 'writer')],
    filterable: true,
  },
}
export const Empty: Story = { args: { repos: [] } }
export const EmptySilenced: Story = { args: { repos: [], empty: '' } }
export const EmptySlot: Story = {
  args: { repos: [] },
  render: (args) => ({
    components: { PynRepoList, PynEmptyState },
    setup: () => ({ args }),
    template: `<PynRepoList v-bind="args"><template #empty><PynEmptyState title="Nothing here yet" description="Custom empty state." compact /></template></PynRepoList>`,
  }),
}

const rows = [
  {
    ...repo('alice', 'maps', 'owner', 'public'),
    description: 'Level layouts and blockouts for the castle project.',
    language: 'Unreal',
    topics: ['levels', 'unreal'],
    updated_at: '2026-11-15T09:00:00Z',
  },
  { ...repo('alice', 'notes', '', 'public'), updated_at: '2026-11-10T09:00:00Z' },
  {
    ...repo('alice', 'textures', 'owner', 'private'),
    description: 'Source art, kept exclusive.',
    updated_at: '2026-11-14T09:00:00Z',
  },
]
const actions = '<template #actions><PynButton label="New" variant="primary" /></template>'
const boxedRender = (args: object) => ({
  components: { PynRepoList, PynButton },
  setup: () => ({ args }),
  template: `<PynRepoList v-bind="args">${actions}</PynRepoList>`,
})
const now = new Date('2026-11-15T12:00:00Z')

export const Boxed: Story = { args: { boxed: true, repos: rows, now }, render: boxedRender }
export const BoxedPaged: Story = {
  args: {
    boxed: true,
    pageSize: 2,
    now,
    repos: [...rows, ...rows.map((r) => ({ ...r, name: `${r.name}-2` }))],
  },
  render: boxedRender,
}
export const BoxedEmpty: Story = { args: { boxed: true, repos: [] }, render: boxedRender }
