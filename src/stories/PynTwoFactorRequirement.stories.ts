import type { Meta, StoryObj } from '@storybook/vue3'
import PynTwoFactorRequirement from '../components/PynTwoFactorRequirement.vue'

const meta: Meta<typeof PynTwoFactorRequirement> = {
  title: 'Admin/PynTwoFactorRequirement',
  component: PynTwoFactorRequirement,
  args: { setting: { required: false } },
}
export default meta
type Story = StoryObj<typeof PynTwoFactorRequirement>

export const NotRequired: Story = {}
export const Required: Story = {
  args: { setting: { required: true, grace_days: 14, since: '2026-11-01T00:00:00Z' } },
}
export const ReadOnly: Story = {
  args: {
    setting: { required: true, grace_days: 7, since: '2026-11-01T00:00:00Z' },
    readonly: true,
  },
}
export const Failed: Story = { args: { error: 'You are not an owner of this organization.' } }
export const Busy: Story = { args: { busy: true } }
