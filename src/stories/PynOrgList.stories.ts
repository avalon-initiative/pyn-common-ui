import type { Meta, StoryObj } from '@storybook/vue3'
import PynEmptyState from '../components/PynEmptyState.vue'
import PynOrgList from '../components/PynOrgList.vue'
import { orgs } from './org-data'

const meta: Meta<typeof PynOrgList> = { title: 'Organizations/PynOrgList', component: PynOrgList }
export default meta
type Story = StoryObj<typeof PynOrgList>

export const Default: Story = { args: { orgs } }
export const Empty: Story = { args: { orgs: [] } }
export const EmptySilenced: Story = { args: { orgs: [], empty: '' } }
export const EmptySlot: Story = {
  args: { orgs: [] },
  render: (args) => ({
    components: { PynOrgList, PynEmptyState },
    setup: () => ({ args }),
    template: `<PynOrgList v-bind="args"><template #empty><PynEmptyState title="Nothing here yet" description="Custom empty state." compact /></template></PynOrgList>`,
  }),
}
