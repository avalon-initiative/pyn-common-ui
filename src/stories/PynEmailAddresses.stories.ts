import type { Meta, StoryObj } from '@storybook/vue3'
import PynEmailAddresses from '../components/PynEmailAddresses.vue'

const meta: Meta<typeof PynEmailAddresses> = {
  title: 'Shell/PynEmailAddresses',
  component: PynEmailAddresses,
  args: {
    emails: [
      {
        address: 'alice@example.com',
        verified: true,
        primary: true,
        added_at: '2026-01-04T10:00:00Z',
        verified_at: '2026-01-04T10:05:00Z',
      },
      {
        address: 'alice@work.example',
        verified: true,
        primary: false,
        added_at: '2026-03-12T09:00:00Z',
        verified_at: '2026-03-12T09:30:00Z',
      },
      {
        address: 'alice@new.example',
        verified: false,
        primary: false,
        added_at: '2026-11-10T08:00:00Z',
      },
    ],
  },
}
export default meta
type Story = StoryObj<typeof PynEmailAddresses>

export const Default: Story = {}
export const LinkSent: Story = { args: { sent: 'alice@new.example' } }
export const Empty: Story = { args: { emails: [] } }
export const AtLimit: Story = { args: { max: 3 } }
export const Refused: Story = { args: { error: 'That address is not available.' } }
export const Busy: Story = { args: { busy: true } }
