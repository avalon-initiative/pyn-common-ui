import type { Meta, StoryObj } from '@storybook/vue3'
import PynViewAction from '../components/PynViewAction.vue'
import PynViewHeader from '../components/PynViewHeader.vue'

const meta: Meta<typeof PynViewHeader> = {
  title: 'Layout/PynViewHeader',
  component: PynViewHeader,
}
export default meta

type Story = StoryObj<typeof PynViewHeader>

export const Title: Story = { args: { title: 'New repository' } }

export const WithActions: Story = {
  args: { title: 'Repositories' },
  render: (args) => ({
    components: { PynViewHeader, PynViewAction },
    setup: () => ({ args }),
    template: `<PynViewHeader v-bind="args">
      <PynViewAction href="/_/locks">Your active locks</PynViewAction>
      <PynViewAction href="/_/new" primary>New repository</PynViewAction>
    </PynViewHeader>`,
  }),
}
