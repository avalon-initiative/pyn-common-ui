import type { Meta, StoryObj } from '@storybook/vue3'
import PynAdminLayout from '../components/PynAdminLayout.vue'
import { adminNavItems } from '../state/shell.state'

const meta: Meta<typeof PynAdminLayout> = {
  title: 'Shell/PynAdminLayout',
  component: PynAdminLayout,
  args: { items: adminNavItems(), current: 'audit' },
  render: (args) => ({
    components: { PynAdminLayout },
    setup: () => ({ args }),
    template: '<PynAdminLayout v-bind="args"><p>Page content</p></PynAdminLayout>',
  }),
}
export default meta
export const Default: StoryObj<typeof PynAdminLayout> = {}
