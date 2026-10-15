import type { Meta, StoryObj } from '@storybook/vue3'
import PynViewAction from '../components/PynViewAction.vue'

const meta: Meta<typeof PynViewAction> = {
  title: 'Layout/PynViewAction',
  component: PynViewAction,
  render: (args) => ({
    components: { PynViewAction },
    setup: () => ({ args }),
    template: '<PynViewAction v-bind="args">New organization</PynViewAction>',
  }),
}
export default meta

type Story = StoryObj<typeof PynViewAction>

export const Primary: Story = { args: { href: '/_/new-org', primary: true } }
export const Secondary: Story = { args: { href: '/_/locks' } }
