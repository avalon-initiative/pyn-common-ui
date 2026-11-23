import type { Meta, StoryObj } from '@storybook/vue3'
import PynEmailStatus from '../components/PynEmailStatus.vue'

const meta: Meta<typeof PynEmailStatus> = {
  title: 'Admin/PynEmailStatus',
  component: PynEmailStatus,
  args: { mailer: 'smtp', verification: true },
}
export default meta
type Story = StoryObj<typeof PynEmailStatus>

export const Smtp: Story = {}
export const SmtpWithoutVerification: Story = { args: { verification: false } }
export const LogOnly: Story = { args: { mailer: 'log' } }
export const NoMailer: Story = { args: { mailer: 'none', verification: false } }
