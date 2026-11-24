import type { Meta, StoryObj } from '@storybook/vue3'
import PynConfirmDialog from '../components/PynConfirmDialog.vue'

const meta: Meta<typeof PynConfirmDialog> = {
  title: 'Primitives/PynConfirmDialog',
  component: PynConfirmDialog,
  args: { open: true, title: 'Remove member', confirmLabel: 'Remove' },
  render: (args) => ({
    components: { PynConfirmDialog },
    setup: () => ({ args }),
    template: `<PynConfirmDialog v-bind="args"><p style="margin: 0">Alice loses access to this repository.</p></PynConfirmDialog>`,
  }),
}
export default meta
type Story = StoryObj<typeof PynConfirmDialog>

export const Default: Story = {}
export const Danger: Story = { args: { danger: true } }
export const Busy: Story = { args: { busy: true } }
export const Failed: Story = { args: { error: 'The server could not remove the member.' } }
