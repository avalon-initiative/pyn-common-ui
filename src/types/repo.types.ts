import type { MemberSource } from './team.types'

export type Visibility = 'public' | 'private'

/** The identity of a repository, as far as navigation needs it. */
export interface RepoRef {
  owner: string
  name: string
}

/** The repository fields the pages show; the rest are filled by the server's repository listing. */
export interface RepoInfo extends RepoRef {
  visibility: Visibility
  lease_hours: number
  created_at: string
  /** The caller's role in the repository; absent when they have none. */
  role?: string | null
  max_locks_per_user?: number
  max_locks_per_user_setting?: number | null
  max_locks_set_by_policy?: boolean
}

/** The repository settings the form sets. */
export interface RepoSettings {
  name: string
  visibility: Visibility
  lease_hours: number
  /** Omitted leaves it alone (or the server default on create); null clears to the default. */
  max_locks_per_user?: number | null
}

/** What the repository form edits: the settings plus the lock-limit state the server reports. */
export type RepoFormValue = RepoSettings &
  Partial<Pick<RepoInfo, 'max_locks_per_user_setting' | 'max_locks_set_by_policy'>>

/** A person in a repository, with the effective role and where it comes from. */
export interface Member {
  user: string
  role: string
  source: MemberSource
}

export interface RoleGrant {
  role: string
  permissions: string[]
}

export interface InviteInfo {
  id: string
  role: string
  created_by: string
  created_at: string
  expires_at: string
  revoked_at?: string | null
  used_at?: string | null
  used_by?: string | null
}

export interface AuditEntry {
  id: number
  at: string
  actor: string
  action: string
  detail: string
  hash?: string
  previous?: string | null
  path?: string | null
}

export interface AuditFilter {
  path: string
  actor: string
  action: string
}

export interface NewUser {
  username: string
  password: string
  role: string
}

/** One revision of a path, as the history and file views show it. */
export interface Revision {
  id: number
  path: string
  author: string
  message: string
  created_at: string
  /** Set when this revision restored the content of an earlier one. */
  restored_from?: number | null
}
