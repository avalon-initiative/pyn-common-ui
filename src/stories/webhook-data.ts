import type { WebhookDelivery, WebhookSubscription } from '../types/webhook.types'

export const webhooks: WebhookSubscription[] = [
  {
    id: 1,
    name: 'CI notifier',
    url: 'https://hooks.example.com/ci',
    enabled: true,
    event_types: ['lock.acquired', 'checkin.created'],
    secrets: [{ id: 101, created_at: '2026-10-01T09:00:00Z', encrypted: true }],
    created_by: 'alice',
    created_at: '2026-10-01T09:00:00Z',
    updated_at: '2026-10-05T09:00:00Z',
  },
  {
    id: 2,
    name: 'Audit sink',
    url: 'https://audit.example.com/in',
    enabled: false,
    event_types: [],
    secrets: [
      { id: 102, created_at: '2026-09-01T09:00:00Z', encrypted: true },
      { id: 103, created_at: '2026-10-02T09:00:00Z', encrypted: true },
    ],
    created_by: 'bob',
    created_at: '2026-09-01T09:00:00Z',
    updated_at: '2026-10-02T09:00:00Z',
  },
]

export const deliveries: WebhookDelivery[] = [
  {
    id: 'd1',
    status: 'failed',
    attempts: 6,
    created_at: '2026-10-07T09:00:00Z',
    failed_at: '2026-10-07T13:00:00Z',
    next_attempt_at: '2026-10-07T13:00:00Z',
    last_error: 'connection refused',
    event_id: 'evt_2',
  },
  {
    id: 'd2',
    status: 'delivered',
    attempts: 1,
    created_at: '2026-10-06T09:00:00Z',
    delivered_at: '2026-10-06T09:00:02Z',
    next_attempt_at: '2026-10-06T09:00:00Z',
    last_status_code: 200,
    event_id: 'evt_3',
  },
]
