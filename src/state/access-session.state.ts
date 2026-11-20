import type {
  AccessSessionInfo,
  AccessSessionReason,
  AccessSessionState,
} from '../types/access-session.types'

export const ACCESS_SESSION_NOTES_MAX = 500

export const ACCESS_SESSION_REASONS: { value: AccessSessionReason; label: string }[] = [
  { value: 'abuse_report', label: 'Abuse report' },
  { value: 'security_incident', label: 'Security incident' },
  { value: 'support_request', label: 'Support request' },
  { value: 'legal_request', label: 'Legal request' },
  { value: 'other', label: 'Other' },
]

export const ACCESS_SESSION_STATE_LABELS: Record<AccessSessionState, string> = {
  active: 'Active',
  ended: 'Ended by an administrator',
  expired: 'Expired',
}

export function reasonLabel(reason: string): string {
  return ACCESS_SESSION_REASONS.find((r) => r.value === reason)?.label ?? reason
}

export function stateLabel(state: string): string {
  return ACCESS_SESSION_STATE_LABELS[state as AccessSessionState] ?? state
}

/** Newest first, without mutating the input. */
export function newestFirst(sessions: AccessSessionInfo[]): AccessSessionInfo[] {
  return [...sessions].sort((a, b) => Date.parse(b.started_at) - Date.parse(a.started_at))
}

export function accessSessionProblem(reason: string, notes: string): string | null {
  if (!reason) return 'Choose a reason.'
  const text = notes.trim()
  if (reason === 'other' && !text) return 'Notes are required when the reason is Other.'
  if (text.length > ACCESS_SESSION_NOTES_MAX) {
    return `Notes are at most ${ACCESS_SESSION_NOTES_MAX} characters.`
  }
  return null
}
