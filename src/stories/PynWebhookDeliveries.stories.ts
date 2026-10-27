import type { Meta, StoryObj } from '@storybook/vue3'
import PynWebhookDeliveries from '../components/PynWebhookDeliveries.vue'

const meta: Meta<typeof PynWebhookDeliveries> = {
  title: 'Repository/PynWebhookDeliveries',
  component: PynWebhookDeliveries,
}
export default meta
type Story = StoryObj<typeof PynWebhookDeliveries>

const deliveries = [
  {
    id: 'd1',
    status: 'pending' as const,
    attempts: 2,
    created_at: '2026-10-08T09:00:00Z',
    next_attempt_at: '2026-10-08T09:30:00Z',
    last_status_code: 503,
    last_error: 'upstream unavailable',
    event_id: 'evt_1',
  },
  {
    id: 'd2',
    status: 'failed' as const,
    attempts: 6,
    created_at: '2026-10-07T09:00:00Z',
    failed_at: '2026-10-07T13:00:00Z',
    next_attempt_at: '2026-10-07T13:00:00Z',
    last_error:
      'error sending request: connection refused (os error 111) while connecting to hooks.example.com:443',
    event_id: 'evt_2',
  },
  {
    id: 'd3',
    status: 'delivered' as const,
    attempts: 1,
    created_at: '2026-10-06T09:00:00Z',
    delivered_at: '2026-10-06T09:00:02Z',
    next_attempt_at: '2026-10-06T09:00:00Z',
    last_status_code: 200,
    event_id: 'evt_3',
  },
]

export const Default: Story = { args: { deliveries, canRedeliver: true } }
export const ReadOnly: Story = { args: { deliveries } }
export const FailedOnly: Story = {
  args: { deliveries: [deliveries[1]], status: 'failed', canRedeliver: true, hasMore: true },
}
export const Redelivering: Story = {
  args: { deliveries, canRedeliver: true, redeliveringId: 'd2' },
}
export const Loading: Story = { args: { deliveries: [], loading: true } }
export const Empty: Story = { args: { deliveries: [], status: 'failed' } }
export const Refused: Story = { args: { deliveries, error: 'not allowed to view deliveries' } }
