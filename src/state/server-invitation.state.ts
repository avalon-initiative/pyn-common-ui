import type {
  InvitationGrantRole,
  InvitationGrantTarget,
  MailerKind,
  ServerInvitation,
  ServerInvitationGrant,
  ServerInvitationStatus,
} from '../types/server-invitation.types'

export const EXPIRY_DEFAULT_DAYS = 7
export const EXPIRY_MIN_DAYS = 1
export const EXPIRY_MAX_DAYS = 90

const STATUS_LABELS: Record<ServerInvitationStatus, string> = {
  pending: 'Pending',
  used: 'Used',
  revoked: 'Revoked',
  expired: 'Expired',
}

export const invitationStatusLabel = (status: ServerInvitationStatus) =>
  STATUS_LABELS[status] ?? status

export const validExpiry = (days: number) =>
  Number.isInteger(days) && days >= EXPIRY_MIN_DAYS && days <= EXPIRY_MAX_DAYS

/** "reader in alice/site", "member of acme", or "No role". */
export function grantLabel(grant?: ServerInvitationGrant | null): string {
  if (!grant) return 'No role'
  if (grant.repository) return `${grant.role} in ${grant.repository}`
  if (grant.organization) return `${grant.role} of ${grant.organization}`
  return grant.role
}

/** A used or revoked invitation has nothing left to revoke. */
export const canRevoke = (i: Pick<ServerInvitation, 'status'>) =>
  i.status === 'pending' || i.status === 'expired'

export const targetKey = (t: InvitationGrantTarget) => `${t.kind}:${t.name}`

export const rolesFor = (roles: InvitationGrantRole[], kind: InvitationGrantTarget['kind']) =>
  roles.filter((r) => r.kind === kind)

export const MAILER_LABELS: Record<MailerKind, string> = {
  none: 'None',
  log: 'Log only',
  smtp: 'SMTP',
}

export const MAILER_SENTENCES: Record<MailerKind, string> = {
  none: 'No mailer is set, so the server sends no email.',
  log: 'Messages are only written to the server log. Nothing is delivered to anyone.',
  smtp: 'The server delivers email through an SMTP server.',
}

export const verificationSentence = (on: boolean) =>
  on
    ? 'Sign-up must confirm the email address before the account can sign in.'
    : 'Sign-up does not confirm email addresses.'
