import type { Meta, StoryObj } from '@storybook/vue3'
import PynPolicyConflictNotice from '../components/PynPolicyConflictNotice.vue'

const meta: Meta<typeof PynPolicyConflictNotice> = {
  title: 'Policy/PynPolicyConflictNotice',
  component: PynPolicyConflictNotice,
}
export default meta
type Story = StoryObj<typeof PynPolicyConflictNotice>

export const LockRequired: Story = { args: { kind: 'lock_required' } }
export const LockHeld: Story = { args: { kind: 'lock_held', holder: 'wendy' } }
export const StaleBase: Story = { args: { kind: 'stale_base' } }
export const InvalidRules: Story = {
  args: {
    kind: 'invalid_rules',
    problems: [
      { line: 4, message: 'unknown mode "locked"; expected shared or exclusive' },
      { line: 9, message: 'invalid glob "[a-"' },
      { message: 'no default rule' },
    ],
  },
}
export const GenericError: Story = {
  args: { kind: 'error', message: 'The server is unreachable.' },
}
export const Busy: Story = { args: { kind: 'lock_required', busy: true } }
