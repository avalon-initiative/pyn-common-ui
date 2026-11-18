export type AccessMode = 'private' | 'public'

export type AccessCheckStatus = 'ok' | 'todo' | 'unknown'

export interface AccessCheckItem {
  id: string
  label: string
  status: AccessCheckStatus
  detail?: string
  href?: string
}
