import type { Meta, StoryObj } from '@storybook/vue3'
import PynAccountPendingDeletion from '../components/PynAccountPendingDeletion.vue'

const meta: Meta<typeof PynAccountPendingDeletion> = {
  title: 'Shell/PynAccountPendingDeletion',
  component: PynAccountPendingDeletion,
  args: { deadline: '2026-12-01T10:00:00Z', user: 'alice' },
}
export default meta
type Story = StoryObj<typeof PynAccountPendingDeletion>

export const Default: Story = {}
export const Restoring: Story = { args: { busy: true } }
export const Failed: Story = { args: { error: 'The account could not be restored.' } }
