import type { Meta, StoryObj } from '@storybook/vue3'
import PynBranchBar from '../components/PynBranchBar.vue'

const meta: Meta<typeof PynBranchBar> = {
  title: 'Browse/PynBranchBar',
  component: PynBranchBar,
  args: {
    branch: 'main',
    files: 128,
    updatedAt: '2026-10-08T10:00:00Z',
    now: new Date('2026-10-08T12:00:00Z'),
  },
}
export default meta
type Story = StoryObj<typeof PynBranchBar>

export const Default: Story = {}
export const Empty: Story = { args: { files: 0, updatedAt: null } }
