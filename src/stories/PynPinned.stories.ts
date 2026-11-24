import type { Meta, StoryObj } from '@storybook/vue3'
import PynPinned from '../components/PynPinned.vue'

const meta: Meta<typeof PynPinned> = {
  title: 'Profile/PynPinned',
  component: PynPinned,
}
export default meta
type Story = StoryObj<typeof PynPinned>

export const NotSupported: Story = {}
export const CustomContent: Story = {
  render: (args) => ({
    components: { PynPinned },
    setup: () => ({ args }),
    template: '<PynPinned v-bind="args"><p>Pinned items go here.</p></PynPinned>',
  }),
}
