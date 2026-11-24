import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import PynAccessPage from '../components/PynAccessPage.vue'
import PynInvites from '../components/PynInvites.vue'
import { accessRoles, directRows, orgRows } from './access-page-data'

const meta: Meta<typeof PynAccessPage> = {
  title: 'Repository/PynAccessPage',
  component: PynAccessPage,
  args: {
    rows: directRows,
    count: directRows.length,
    roles: accessRoles,
    visibility: 'private',
    canManage: true,
    canManageVisibility: true,
    baseRoleHref: '#',
    directPeople: 3,
    directTeams: 1,
    organization: 'studio',
    organizationHref: '#',
    orgPeople: 1,
    orgTeams: 1,
  },
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof PynAccessPage>

export const Default: Story = {}
export const WithBaseRole: Story = { args: { baseRole: 'reader', visibility: 'public' } }
export const OrganizationTab: Story = {
  args: { tab: 'organization', rows: orgRows, count: orgRows.length },
}
export const Empty: Story = { args: { rows: [], count: 0, directPeople: 0, directTeams: 0 } }
export const EmptyOrganizationTab: Story = {
  args: { tab: 'organization', rows: [], count: 0, orgPeople: 0, orgTeams: 0 },
}
export const NoMatches: Story = { args: { rows: [], count: 0, query: 'zzz' } }
export const OwnedByPerson: Story = { args: { organization: undefined } }
export const ReadOnly: Story = { args: { canManage: false, canManageVisibility: false } }
export const Paginated: Story = { args: { count: 74, pageSize: 4, page: 2 } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load access.' } }
export const WithInvitations: Story = {
  render: (args) => ({
    components: { PynAccessPage, PynInvites },
    setup: () => ({ args, adding: ref(undefined) }),
    template: `<PynAccessPage v-bind="args" v-model:adding="adding">
      <template #invites><PynInvites :invites="[]" :roles="args.roles" /></template>
    </PynAccessPage>`,
  }),
}
export const AddingPeople: Story = {
  args: { adding: 'people' },
  render: (args) => ({
    components: { PynAccessPage },
    setup: () => ({ args }),
    template: `<PynAccessPage v-bind="args"><template #addPeople>Add people form goes here.</template></PynAccessPage>`,
  }),
}
export const WithAvatars: Story = {
  args: {
    rows: [
      {
        kind: 'person',
        name: 'alice',
        role: 'admin',
        source: 'direct',
        identity: { user: 'alice', display_name: 'Alice Anders' },
      },
      ...directRows.slice(1),
    ],
  },
}
