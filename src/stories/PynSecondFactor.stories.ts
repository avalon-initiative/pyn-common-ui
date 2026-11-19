import type { Meta, StoryObj } from '@storybook/vue3'
import PynSecondFactor from '../components/PynSecondFactor.vue'

const meta: Meta<typeof PynSecondFactor> = {
  title: 'Account/PynSecondFactor',
  component: PynSecondFactor,
}
export default meta
type Story = StoryObj<typeof PynSecondFactor>

export const Default: Story = {}
export const WithPasskeys: Story = { args: { passkeys: true } }
export const WrongCode: Story = { args: { error: 'That code is not right.' } }
