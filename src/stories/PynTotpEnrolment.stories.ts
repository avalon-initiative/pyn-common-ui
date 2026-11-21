import type { Meta, StoryObj } from '@storybook/vue3'
import PynTotpEnrolment from '../components/PynTotpEnrolment.vue'
import { enrolment } from './two-factor-data'
import { failCopy } from './copy-failure'

const meta: Meta<typeof PynTotpEnrolment> = {
  title: 'Account/PynTotpEnrolment',
  component: PynTotpEnrolment,
}
export default meta
type Story = StoryObj<typeof PynTotpEnrolment>

export const Default: Story = { args: { enrolment } }
export const WrongCode: Story = { args: { enrolment, error: 'That code is not right.' } }
export const CopyFailed: Story = {
  args: { enrolment },
  play: ({ canvasElement }) => failCopy(canvasElement, 'Copy key'),
}
