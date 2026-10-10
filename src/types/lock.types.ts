/** Mirrors the server's `Lock`. */
export interface LockInfo {
  path: string
  owner: string
  acquired_at: string
  expires_at: string
}

export type LockState = 'available' | 'locked' | 'mine' | 'expiring'
