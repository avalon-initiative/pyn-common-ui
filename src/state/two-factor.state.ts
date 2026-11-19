export const GRACE_DAYS_MAX = 90
export const GRACE_DAYS_DEFAULT = 7

const NOTICE_TITLES: Record<string, string> = {
  two_factor_reset: 'Two-factor authentication was reset',
  passkey_clone_suspected: 'A passkey may have been copied',
}

/** A heading for a known notice kind; unknown kinds show their detail alone. */
export const noticeTitle = (kind: string): string | undefined => NOTICE_TITLES[kind]

/** A whole number of days within the range the server accepts. */
export function validGraceDays(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= GRACE_DAYS_MAX
}
