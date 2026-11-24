import type { Meta, StoryObj } from '@storybook/vue3'
import PynTextArea from '../components/PynTextArea.vue'

const meta: Meta<typeof PynTextArea> = {
  title: 'Forms/PynTextArea',
  component: PynTextArea,
  args: {
    label: 'Description',
    modelValue: 'Adds **Level02** and trims the tutorial.',
    help: 'Markdown is supported.',
  },
  decorators: [() => ({ template: '<div style="max-width: 40rem"><story /></div>' })],
}
export default meta
type Story = StoryObj<typeof PynTextArea>

export const Default: Story = {}
export const WithCounter: Story = { args: { maxlength: 350 } }
export const OverLimit: Story = {
  args: { maxlength: 20, counter: true, modelValue: 'A description longer than the limit' },
}
export const Error: Story = { args: { modelValue: '', error: 'Enter a description.' } }
export const Disabled: Story = { args: { disabled: true } }
export const HiddenLabel: Story = {
  args: { hideLabel: true, modelValue: '', placeholder: 'Leave a comment' },
}
