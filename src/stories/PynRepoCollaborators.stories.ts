import type { Meta, StoryObj } from '@storybook/vue3'
import PynRepoCollaborators from '../components/PynRepoCollaborators.vue'
import { accessRoles, directRows } from './access-page-data'

const meta: Meta<typeof PynRepoCollaborators> = {
  title: 'Repository/PynRepoCollaborators',
  component: PynRepoCollaborators,
  args: {
    rows: directRows,
    count: directRows.length,
    roles: accessRoles,
    teams: ['engine', 'qa'],
    invites: [],
    canManage: true,
    canManageVisibility: true,
    baseRoleHref: '#',
    directPeople: 3,
    directTeams: 1,
    organization: 'studio',
    organizationHref: '#',
  },
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof PynRepoCollaborators>

export const Default: Story = {}
export const AddingPeople: Story = { args: { adding: 'people' } }
export const AddingTeams: Story = { args: { adding: 'teams' } }
export const InviteCreated: Story = { args: { inviteCode: 'pyn-invite-3f9a1c' } }
export const ReadOnly: Story = { args: { canManage: false, canManageVisibility: false } }
