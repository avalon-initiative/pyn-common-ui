import type { Meta, StoryObj } from '@storybook/vue3'
import PynDashboardLocks from '../components/PynDashboardLocks.vue'
import { heldLocks, now } from './dashboard-data'

const meta: Meta<typeof PynDashboardLocks> = {
  title: 'Dashboard/PynDashboardLocks',
  component: PynDashboardLocks,
  args: { locks: heldLocks, now },
}
export default meta
type Story = StoryObj<typeof PynDashboardLocks>

export const Held: Story = {}
export const AboutToExpire: Story = { args: { kind: 'expiring', withinMs: 4 * 3600_000 } }
export const HeldEmpty: Story = { args: { locks: [] } }
export const ExpiringEmpty: Story = { args: { kind: 'expiring', locks: [] } }
export const Loading: Story = { args: { loading: true } }
export const Failed: Story = { args: { error: 'Could not load your locks.' } }
