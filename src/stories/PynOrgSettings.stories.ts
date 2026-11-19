import type { Meta, StoryObj } from '@storybook/vue3'
import PynOrgSettings from '../components/PynOrgSettings.vue'

const meta: Meta<typeof PynOrgSettings> = {
  title: 'Organizations/PynOrgSettings',
  component: PynOrgSettings,
  args: { settings: { exclusive_read_only: null } },
}
export default meta
type Story = StoryObj<typeof PynOrgSettings>

export const NotSet: Story = {}
export const Off: Story = { args: { settings: { exclusive_read_only: false } } }
export const ReadOnly: Story = { args: { readonly: true } }
export const Failed: Story = { args: { error: 'You are not an owner of this organization.' } }
export const Busy: Story = { args: { busy: true } }
