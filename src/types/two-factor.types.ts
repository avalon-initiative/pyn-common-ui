/** A passkey or security key registered to the account. */
export interface Passkey {
  id: string
  name: string
  created_at: string
  last_used_at?: string | null
  transports: string[]
  sign_count: number
  backup_eligible: boolean
  backup_state: boolean
}

/** A pending authenticator-app enrolment: the seed and its otpauth URI. */
export interface TotpEnrolment {
  id: string
  secret: string
  uri: string
}

export type SecondFactorKind = 'totp' | 'recovery'

export interface SecondFactorForm {
  kind: SecondFactorKind
  code: string
}

/** An authenticator app turned on for the account. */
export interface TwoFactorFactor {
  id: string
  kind: string
  label: string
  created_at: string
}

/** A requirement that the account hold a second factor. */
export interface TwoFactorRequired {
  by: 'server' | 'organization' | string
  organization?: string | null
  /** ISO 8601 timestamp; from here the account can only set up a second factor. */
  deadline: string
  enforced: boolean
}

/** The account's second-factor state. */
export interface TwoFactorStatus {
  enabled: boolean
  factors: TwoFactorFactor[]
  passkeys?: Passkey[]
  passkeys_available?: boolean
  recovery_codes_left: number
  required?: TwoFactorRequired | null
}

/** A message for the account, shown until dismissed. */
export interface Notice {
  id: string
  kind: string
  detail: string
  created_at: string
}

/** Whether second factors are required, and the grace period. */
export interface TwoFactorSetting {
  required: boolean
  grace_days?: number | null
  /** ISO 8601 timestamp of when the requirement was set. */
  since?: string | null
}

export interface TwoFactorRequirementChange {
  required: boolean
  grace_days: number
}
