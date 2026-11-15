export interface PasswordFields {
  current: string
  next: string
  confirm: string
}

/** The first problem with a password change, or '' when it can be submitted. */
export function passwordProblem(f: PasswordFields, minLength = 0, hasPassword = true): string {
  if (hasPassword && !f.current) return 'Enter your current password.'
  if (minLength && f.next.length < minLength)
    return `The new password must be at least ${minLength} characters.`
  if (!f.next) return 'Enter a new password.'
  if (hasPassword && f.next === f.current)
    return 'The new password must differ from the current one.'
  if (f.next !== f.confirm) return 'The new password and its confirmation do not match.'
  return ''
}
