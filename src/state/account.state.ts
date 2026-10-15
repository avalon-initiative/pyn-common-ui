import type { BlockedStatus } from '../types/auth.types'

export const NOTICE_TITLES: Record<BlockedStatus, string> = {
  pending_verification: 'Check your email',
  pending_approval: 'Waiting for approval',
  account_disabled: 'Account disabled',
}

export const NOTICE_TEXT: Record<BlockedStatus, string> = {
  pending_verification:
    'Follow the link in the verification email to activate the account. The link works once and expires after 24 hours.',
  pending_approval:
    'An administrator of this server must approve the account before it can sign in.',
  account_disabled:
    'An administrator disabled this account. Contact them to have it enabled again.',
}
