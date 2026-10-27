import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import PynDrawer from '../components/PynDrawer.vue'

const meta: Meta<typeof PynDrawer> = {
  title: 'Primitives/PynDrawer',
  component: PynDrawer,
}
export default meta
type Story = StoryObj<typeof PynDrawer>

export const Open: Story = {
  args: { open: true, title: 'Drawer title' },
  render: (args) => ({
    components: { PynDrawer },
    setup: () => ({ args }),
    template: `<PynDrawer v-bind="args"><p>Content that scrolls inside the panel.</p></PynDrawer>`,
  }),
}

export const WithFooter: Story = {
  args: { open: true, title: 'Edit item', width: '24rem' },
  render: (args) => ({
    components: { PynDrawer },
    setup: () => ({ args }),
    template: `<PynDrawer v-bind="args">
      <p>Body</p>
      <template #footer><button type="button">Save</button></template>
    </PynDrawer>`,
  }),
}

export const OpenedByButton: Story = {
  args: { title: 'Details', open: false },
  render: (args) => ({
    components: { PynDrawer },
    setup: () => ({ args, open: ref(false) }),
    template: `<div>
      <button type="button" @click="open = true">Open drawer</button>
      <PynDrawer v-bind="args" :open="open" @close="open = false">
        <p>Escape, the close button or the backdrop closes it and focus returns to the button.</p>
        <button type="button">Inside</button>
      </PynDrawer>
    </div>`,
  }),
}
