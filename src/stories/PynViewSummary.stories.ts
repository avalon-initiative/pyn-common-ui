import type { Meta, StoryObj } from '@storybook/vue3'
import PynViewSummary from '../components/PynViewSummary.vue'

const meta: Meta<typeof PynViewSummary> = {
  title: 'Layout/PynViewSummary',
  component: PynViewSummary,
}
export default meta

export const Default: StoryObj<typeof PynViewSummary> = {
  render: () => ({
    components: { PynViewSummary },
    template:
      '<PynViewSummary>You have no role in this repository. Ask an admin to add you or send an invitation.</PynViewSummary>',
  }),
}
