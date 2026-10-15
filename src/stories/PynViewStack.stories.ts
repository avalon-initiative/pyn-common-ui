import type { Meta, StoryObj } from '@storybook/vue3'
import PynViewGroup from '../components/PynViewGroup.vue'
import PynViewHeader from '../components/PynViewHeader.vue'
import PynViewStack from '../components/PynViewStack.vue'

const meta: Meta<typeof PynViewStack> = {
  title: 'Layout/PynViewStack',
  component: PynViewStack,
}
export default meta

export const Default: StoryObj<typeof PynViewStack> = {
  render: () => ({
    components: { PynViewStack, PynViewHeader, PynViewGroup },
    template: `<PynViewStack>
      <PynViewHeader title="Accounts" />
      <PynViewGroup title="Server audit log"><p>Entries go here.</p></PynViewGroup>
    </PynViewStack>`,
  }),
}
