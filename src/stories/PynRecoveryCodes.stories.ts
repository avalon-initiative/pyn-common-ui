import type { Meta, StoryObj } from '@storybook/vue3'
import PynRecoveryCodes from '../components/PynRecoveryCodes.vue'
import { recoveryCodes } from './two-factor-data'

const meta: Meta<typeof PynRecoveryCodes> = {
  title: 'Account/PynRecoveryCodes',
  component: PynRecoveryCodes,
}
export default meta
type Story = StoryObj<typeof PynRecoveryCodes>

export const Default: Story = { args: { codes: recoveryCodes } }
