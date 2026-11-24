import type { Meta, StoryObj } from '@storybook/vue3'
import PynTextField from '../components/PynTextField.vue'

const meta: Meta<typeof PynTextField> = {
  title: 'Forms/PynTextField',
  component: PynTextField,
  args: { label: 'Title', modelValue: 'Add level two', placeholder: 'Title' },
  decorators: [() => ({ template: '<div style="max-width: 32rem"><story /></div>' })],
}
export default meta
type Story = StoryObj<typeof PynTextField>

export const Default: Story = {}
export const WithHelp: Story = {
  args: { label: 'Name', modelValue: '', help: 'Letters, digits, dots, dashes and underscores.' },
}
export const WithCounter: Story = { args: { maxlength: 80 } }
export const Error: Story = { args: { modelValue: '', error: 'Enter a title.', required: true } }
export const Optional: Story = { args: { label: 'Website', modelValue: '', optional: true } }
export const Disabled: Story = { args: { disabled: true } }
export const Mono: Story = { args: { label: 'Commit', modelValue: '210e2fe', mono: true } }
