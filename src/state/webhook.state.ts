import type {
  WebhookDelivery,
  WebhookDeliveryStatus,
  WebhookSubscription,
} from '../types/webhook.types'

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

/** Splits a comma or newline separated list into trimmed, unique event types. */
export function parseEventTypes(text: string): string[] {
  return [
    ...new Set(
      text
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ]
}

export function eventTypesText(types: string[]): string {
  return types.join('\n')
}

/** Table cell text for the event types: "all events" when none are set. */
export function eventTypesLabel(types: string[]): string {
  return types.length ? types.join(', ') : 'all events'
}

/** A second secret exists only while rotating, and only then can one be retired. */
export function isRotating(w: Pick<WebhookSubscription, 'secrets'>): boolean {
  return w.secrets.length > 1
}
