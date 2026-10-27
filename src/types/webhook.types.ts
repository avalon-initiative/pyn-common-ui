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
