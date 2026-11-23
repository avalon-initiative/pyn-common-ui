import type { Meta, StoryObj } from '@storybook/vue3'
import PynSecondFactor from '../components/PynSecondFactor.vue'

const meta: Meta<typeof PynSecondFactor> = {
  title: 'Account/PynSecondFactor',
  component: PynSecondFactor,
}
export default meta
type Story = StoryObj<typeof PynSecondFactor>

/** Authenticator code and recovery code. */
export const Default: Story = {}
/** Authenticator code, passkey and recovery code. */
export const WithPasskeys: Story = { args: { passkeys: true } }
export const WrongCode: Story = { args: { error: 'That code is not right.' } }
export const CustomHints: Story = {
  args: {
    passkeys: true,
    recoveryHint: 'Use one of the ten codes you saved when you set this up.',
    helpHint: 'Lost every factor? An administrator of this server can help.',
  },
}
export const Busy: Story = { args: { passkeys: true, busy: true } }
