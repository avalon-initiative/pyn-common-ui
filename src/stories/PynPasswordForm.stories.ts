import type { Meta, StoryObj } from '@storybook/vue3'
import PynPasswordForm from '../components/PynPasswordForm.vue'

const meta: Meta<typeof PynPasswordForm> = {
  title: 'Account/PynPasswordForm',
  component: PynPasswordForm,
  args: {
    minLength: 10,
    rules: [
      'At least 10 characters, at most 256.',
      'Other web sessions and sign-in tokens end; you stay signed in here.',
    ],
  },
}
export default meta
type Story = StoryObj<typeof PynPasswordForm>

export const Empty: Story = {}
export const Busy: Story = { args: { busy: true } }
export const ServerError: Story = { args: { error: 'The current password is wrong.' } }
export const RateLimited: Story = {
  args: { error: 'Too many attempts. Try again in 15 minutes.' },
}
export const Changed: Story = {
  args: { success: 'Password changed. Your other sessions were signed out.' },
}
