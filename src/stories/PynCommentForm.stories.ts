import type { Meta, StoryObj } from '@storybook/vue3'
import PynCommentForm from '../components/PynCommentForm.vue'

const meta: Meta<typeof PynCommentForm> = {
  title: 'Pull requests/PynCommentForm',
  component: PynCommentForm,
  args: { modelValue: '' },
  decorators: [() => ({ template: '<div style="max-width: 48rem"><story /></div>' })],
}
export default meta
type Story = StoryObj<typeof PynCommentForm>

export const Empty: Story = {}
export const Typed: Story = { args: { modelValue: 'Looks good once the timer test passes.' } }
export const WithClose: Story = { args: { canClose: true } }
export const CloseWithComment: Story = {
  args: { canClose: true, modelValue: 'Superseded by #44.' },
}
export const Busy: Story = { args: { modelValue: 'Posting this.', busy: true } }
export const Failed: Story = {
  args: { modelValue: 'Posting this.', error: 'The comment could not be posted. Try again.' },
}
export const EditDescription: Story = {
  args: {
    modelValue: 'Adds **Level02** and trims the tutorial.',
    label: 'Description',
    submitLabel: 'Save',
    allowEmpty: true,
    cancelable: true,
  },
}
export const CardWithHeading: Story = {
  args: { heading: 'Add a comment', card: true, canClose: true },
}
