/** What stops an account from signing in. */
export type BlockedStatus = 'pending_verification' | 'pending_approval' | 'account_disabled'

export type AccountStatus = 'pending_verification' | 'pending_approval' | 'active' | 'disabled'
export type RegistrationMode = 'open' | 'invite' | 'closed'
export type VerifyOutcome = 'verifying' | 'verified' | 'invalid'

export interface SignInForm {
  username: string
  password: string
}

export interface RegisterForm extends SignInForm {
  email?: string
  invite?: string
}

export interface ExternalProvider {
  name: string
  sign_in_url: string
}

export interface SshKey {
  id: string
  user: string
  title: string
  algorithm: string
  fingerprint: string
  created_at: string
  last_used_at?: string | null
}
