import type { Meta, StoryObj } from '@storybook/vue3'
import PynViewGroup from '../components/PynViewGroup.vue'

const meta: Meta<typeof PynViewGroup> = {
  title: 'Layout/PynViewGroup',
  component: PynViewGroup,
}
export default meta

export const Default: StoryObj<typeof PynViewGroup> = {
  args: { title: 'Server audit log' },
  render: (args) => ({
    components: { PynViewGroup },
    setup: () => ({ args }),
    template: '<PynViewGroup v-bind="args"><p>Entries go here.</p></PynViewGroup>',
  }),
}
