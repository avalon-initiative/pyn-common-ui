import type { AccountStatus } from './auth.types'

export type AdminAccountStatus = AccountStatus

export interface AccountInfo {
  user: string
  email?: string | null
  email_verified: boolean
  status: AdminAccountStatus
  admin: boolean
  created_at: string
  disabled_at?: string | null
  disabled_reason?: string | null
}

export interface DisableRequest {
  user: string
  reason: string
}
