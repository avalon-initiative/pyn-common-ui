import type { Meta, StoryObj } from '@storybook/vue3'
import PynSettingsSection from '../components/PynSettingsSection.vue'
import PynTeamDelete from '../components/PynTeamDelete.vue'
import PynTeamDetail from '../components/PynTeamDetail.vue'
import PynTeamForm from '../components/PynTeamForm.vue'
import { teams } from './org-data'

const meta: Meta<typeof PynTeamDetail> = {
  title: 'Organizations/PynTeamDetail',
  component: PynTeamDetail,
  args: { team: teams[0], candidates: ['alice', 'dave'], owner: true },
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof PynTeamDetail>

export const Owner: Story = {}
export const WholePage: Story = {
  render: (args) => ({
    components: { PynTeamDetail, PynTeamForm, PynTeamDelete, PynSettingsSection },
    setup: () => ({ args, team: teams[0] }),
    template: `<div><PynTeamDetail v-bind="args" /><PynTeamForm :team="team" /><PynSettingsSection title="Danger zone" danger plain><PynTeamDelete :slug="team.slug" /></PynSettingsSection></div>`,
  }),
}
export const AddingAMember: Story = { args: { adding: true } }
export const EveryoneInTeam: Story = { args: { adding: true, candidates: [] } }
export const Member: Story = { args: { owner: false } }
export const Empty: Story = { args: { team: teams[1] } }
export const NotAMember: Story = {
  args: { adding: true, error: 'That user is not a member of the organization.' },
}
