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

const MAX_NAME_BYTES = 256
const MAX_URL_BYTES = 2048

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length
}

/** Client-side hint for the name field; the server is the authority. */
export function webhookNameProblem(name: string): string | null {
  const n = byteLength(name.trim())
  if (n === 0) return 'Enter a name.'
  if (n > MAX_NAME_BYTES) return `Use at most ${MAX_NAME_BYTES} bytes.`
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(name)) return 'Do not use control characters.'
  return null
}

/** Client-side hint for the URL field: https, no credentials or fragment, at most 2048 bytes. */
export function webhookUrlProblem(url: string): string | null {
  const text = url.trim()
  if (!text) return 'Enter a URL.'
  if (byteLength(text) > MAX_URL_BYTES) return `Use at most ${MAX_URL_BYTES} bytes.`
  let u: URL
  try {
    u = new URL(text)
  } catch {
    return 'Enter a full URL such as https://hooks.example.com/pyn.'
  }
  if (u.protocol !== 'https:') return 'Use an https URL.'
  if (u.username || u.password) return 'Leave out the user name and password.'
  if (u.hash) return 'Leave out the fragment.'
  return null
}
