import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import PynTeamForm from '../components/PynTeamForm.vue'
import PynTeamList from '../components/PynTeamList.vue'
import PynViewStack from '../components/PynViewStack.vue'
import { teams } from './org-data'

const meta: Meta<typeof PynTeamList> = {
  title: 'Organizations/PynTeamList',
  component: PynTeamList,
  args: { org: 'studio', teams },
}
export default meta
type Story = StoryObj<typeof PynTeamList>

export const Default: Story = {}
export const Empty: Story = { args: { teams: [] } }
/** Counts of one read in the singular. */
export const OneEach: Story = {
  args: {
    teams: [{ ...teams[0]!, members: ['bob'], repos: [{ repo: 'studio/game', role: 'writer' }] }],
  },
}

const page = (open: boolean): Story => ({
  render: (args) => ({
    components: { PynTeamForm, PynTeamList, PynViewStack },
    setup: () => ({ args, adding: ref(open) }),
    template: `<PynViewStack>
      <PynTeamForm v-model:adding="adding" />
      <PynTeamList v-bind="args" />
    </PynViewStack>`,
  }),
})
/** The teams page: New team opens the create form above the list. */
export const TeamsPage: Story = page(false)
export const TeamsPageCreating: Story = page(true)
