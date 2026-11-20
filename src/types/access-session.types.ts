export type AccessSessionReason =
  'abuse_report' | 'security_incident' | 'support_request' | 'legal_request' | 'other'

export type AccessSessionState = 'active' | 'ended' | 'expired'

export interface AccessSessionReach {
  method: string
  /** The route template, such as `/v1/repos/{owner}/{name}/files`. */
  route: string
  /** `owner/name` for a repository route, else empty. */
  target: string
  refused: boolean
  count: number
  first_at: string
  last_at: string
}

export interface AccessSessionInfo {
  id: string
  admin: string
  user: string
  reason: AccessSessionReason
  notes?: string | null
  started_at: string
  expires_at: string
  ended_at: string | null
  state: AccessSessionState
  reached: AccessSessionReach[]
}

export interface StartedAccessSession {
  /** Shown once and never stored. */
  secret: string
  info: AccessSessionInfo
}

export interface AccessSessionStart {
  reason: AccessSessionReason
  notes?: string
}
