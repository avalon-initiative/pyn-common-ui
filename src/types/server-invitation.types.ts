export type ServerInvitationStatus = 'pending' | 'used' | 'revoked' | 'expired'

/** The role an invitation gives; exactly one of `repository` and `organization`. */
export interface ServerInvitationGrant {
  repository?: string | null
  organization?: string | null
  role: string
}

/** A server invitation as an administrator sees it; mirrors the server's `ServerInvitationInfo`. */
export interface ServerInvitation {
  id: string
  email?: string | null
  grant?: ServerInvitationGrant | null
  created_by: string
  created_at: string
  expires_at: string
  status: ServerInvitationStatus
  used_at?: string | null
  used_by?: string | null
  revoked_at?: string | null
}

/** Fields collected to create one; mirrors the server's request. */
export interface ServerInvitationCreate {
  email?: string
  expires_in_days: number
  grant?: ServerInvitationGrant
}

/** A repository (`owner/name`) or an organization an invitation may grant a role in. */
export interface InvitationGrantTarget {
  kind: 'repository' | 'organization'
  name: string
}

/** A role offered for targets of one kind. */
export interface InvitationGrantRole {
  kind: 'repository' | 'organization'
  value: string
  label?: string
}

export interface NewAccount {
  username: string
  password: string
}

export type MailerKind = 'none' | 'log' | 'smtp'
