import type { WebhookDelivery, WebhookDeliveryStatus } from '../types/webhook.types'

export const DELIVERY_STATUSES: WebhookDeliveryStatus[] = ['pending', 'delivered', 'failed']

/** Errors longer than this are collapsed behind an expander. */
export const ERROR_PREVIEW_LENGTH = 60

/** First line of an error, cut to the preview length with an ellipsis. */
export function errorPreview(text: string): string {
  const line = text.split('\n')[0]
  return line.length > ERROR_PREVIEW_LENGTH || line !== text
    ? `${line.slice(0, ERROR_PREVIEW_LENGTH).trimEnd()}…`
    : line
}

/** When the delivery reached its final state, with a label, or null while pending. */
export function finishedAt(d: WebhookDelivery): { label: string; at: string } | null {
  if (d.status === 'delivered' && d.delivered_at) return { label: 'Delivered', at: d.delivered_at }
  if (d.status === 'failed' && d.failed_at) return { label: 'Failed', at: d.failed_at }
  return null
}
