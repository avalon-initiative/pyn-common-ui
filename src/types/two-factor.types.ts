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
