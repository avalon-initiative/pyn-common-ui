import type { Meta, StoryObj } from '@storybook/vue3'
import PynBranchDialog from '../components/PynBranchDialog.vue'

const meta: Meta<typeof PynBranchDialog> = {
  title: 'Browse/PynBranchDialog',
  component: PynBranchDialog,
  args: {
    open: true,
    mode: 'create',
    branches: [
      { name: 'main', isDefault: true },
      { name: 'feature/rig-update' },
      { name: 'release/1.0' },
    ],
  },
}
export default meta
type Story = StoryObj<typeof PynBranchDialog>

export const Create: Story = {}
export const CreateFromBranch: Story = { args: { from: 'release/1.0' } }
export const Rename: Story = { args: { mode: 'rename', name: 'feature/rig-update' } }
export const Delete: Story = { args: { mode: 'delete', name: 'feature/rig-update' } }
export const DeleteUnmerged: Story = {
  args: { mode: 'delete', name: 'feature/rig-update', unmerged: true },
}
export const Failed: Story = { args: { error: 'The server rejected the branch name.' } }
