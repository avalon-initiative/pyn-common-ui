import type { Meta, StoryObj } from '@storybook/vue3'
import PynOrgDelete from '../components/PynOrgDelete.vue'
import PynSettingsSection from '../components/PynSettingsSection.vue'

const meta: Meta<typeof PynOrgDelete> = {
  title: 'Organizations/PynOrgDelete',
  component: PynOrgDelete,
  args: { name: 'studio' },
}
export default meta
type Story = StoryObj<typeof PynOrgDelete>

export const Default: Story = {}
export const NotEmpty: Story = {
  args: { error: 'Delete the repositories the organization owns first.' },
}
export const ReadOnly: Story = { args: { readonly: true } }
export const InPlainDangerZone: Story = {
  render: (args) => ({
    components: { PynOrgDelete, PynSettingsSection },
    setup: () => ({ args }),
    template: `<PynSettingsSection title="Danger zone" danger plain><PynOrgDelete v-bind="args" /></PynSettingsSection>`,
  }),
}
export const InDangerZone: Story = {
  render: (args) => ({
    components: { PynOrgDelete, PynSettingsSection },
    setup: () => ({ args }),
    template: `<PynSettingsSection title="Danger zone" danger><PynOrgDelete v-bind="args" /></PynSettingsSection>`,
  }),
}
