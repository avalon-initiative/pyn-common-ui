import type { Meta, StoryObj } from '@storybook/vue3'
import PynTwoFactor from '../components/PynTwoFactor.vue'
import { emptyStatus, status } from './two-factor-data'

const meta: Meta<typeof PynTwoFactor> = {
  title: 'Account/PynTwoFactor',
  component: PynTwoFactor,
  args: { status },
}
export default meta
type Story = StoryObj<typeof PynTwoFactor>

export const Enabled: Story = {}
export const NoneYet: Story = { args: { status: emptyStatus } }
export const NoPassword: Story = { args: { status: emptyStatus, hasPassword: false } }
export const Failed: Story = { args: { error: 'That code did not match.' } }
export const Busy: Story = { args: { busy: true } }
