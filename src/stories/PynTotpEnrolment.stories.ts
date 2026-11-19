import type { Meta, StoryObj } from '@storybook/vue3'
import PynTotpEnrolment from '../components/PynTotpEnrolment.vue'
import { enrolment } from './two-factor-data'

const meta: Meta<typeof PynTotpEnrolment> = {
  title: 'Account/PynTotpEnrolment',
  component: PynTotpEnrolment,
}
export default meta
type Story = StoryObj<typeof PynTotpEnrolment>

export const Default: Story = { args: { enrolment } }
export const WrongCode: Story = { args: { enrolment, error: 'That code is not right.' } }
