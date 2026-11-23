import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import PynDialog from '../components/PynDialog.vue'

const meta: Meta<typeof PynDialog> = {
  title: 'Primitives/PynDialog',
  component: PynDialog,
  args: { open: true, title: 'Delete branch' },
}
export default meta
type Story = StoryObj<typeof PynDialog>

const render: Story['render'] = (args) => ({
  components: { PynDialog },
  setup: () => ({ args }),
  template: `<PynDialog v-bind="args">
    <p style="margin: 0">The branch and its unmerged revisions are removed. This cannot be undone.</p>
    <template #footer>
      <button type="button">Cancel</button>
      <button type="button">Delete branch</button>
    </template>
  </PynDialog>`,
})

export const Small: Story = { args: { size: 'sm' }, render }
export const Medium: Story = { args: { size: 'md' }, render }
export const Large: Story = { args: { size: 'lg' }, render }

export const WithoutFooter: Story = {
  render: (args) => ({
    components: { PynDialog },
    setup: () => ({ args }),
    template: `<PynDialog v-bind="args"><p style="margin: 0">Read-only content.</p></PynDialog>`,
  }),
}

export const OpenedByButton: Story = {
  args: { open: false },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLElement>('button')!.click()
    await new Promise((resolve) => setTimeout(resolve, 50))
  },
  render: (args) => ({
    components: { PynDialog },
    setup: () => ({ args, open: ref(false) }),
    template: `<div>
      <button type="button" @click="open = true">Open dialog</button>
      <PynDialog v-bind="args" :open="open" @close="open = false">
        <p style="margin: 0">Escape, the close button or the backdrop closes it and focus returns to the button.</p>
        <template #footer><button type="button" @click="open = false">Close</button></template>
      </PynDialog>
    </div>`,
  }),
}
