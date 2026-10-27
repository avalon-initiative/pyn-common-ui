export type WebhookDeliveryStatus = 'pending' | 'delivered' | 'failed'

export interface WebhookDelivery {
  id: string
  status: WebhookDeliveryStatus
  attempts: number
  created_at: string
  delivered_at?: string | null
  failed_at?: string | null
  next_attempt_at: string
  last_status_code?: number | null
  last_error?: string | null
  event_id: string
}

export interface WebhookSecret {
  id: string
  created_at: string
  encrypted: boolean
}

export interface WebhookSubscription {
  id: string
  name: string
  url: string
  enabled: boolean
  event_types: string[]
  secrets: WebhookSecret[]
  created_by: string
  created_at: string
  updated_at: string
}

/** Subscription fields the detail view can change; a partial update. */
export interface WebhookUpdate {
  name?: string
  url?: string
  enabled?: boolean
  event_types?: string[]
}

export type WebhookConfirm = { kind: 'delete' } | { kind: 'retire'; secretId: string }
