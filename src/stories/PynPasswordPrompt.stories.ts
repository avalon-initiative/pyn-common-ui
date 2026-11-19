import type { Meta, StoryObj } from '@storybook/vue3'
import PynPasswordPrompt from '../components/PynPasswordPrompt.vue'

const meta: Meta<typeof PynPasswordPrompt> = {
  title: 'Account/PynPasswordPrompt',
  component: PynPasswordPrompt,
}
export default meta
type Story = StoryObj<typeof PynPasswordPrompt>

export const Default: Story = {}
export const WrongPassword: Story = { args: { error: 'That password is not right.' } }
export const Busy: Story = { args: { busy: true } }
