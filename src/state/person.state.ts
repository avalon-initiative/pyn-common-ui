import type { PublicIdentity } from '../types/profile.types'

export interface PersonLabel {
  /** Nothing beyond the written name to show. */
  plain: boolean
  account: string
  display: string
  /** The written name, only when the account was renamed. */
  written: string
}

export function personLabel(
  name: string,
  current?: string | null,
  identity?: PublicIdentity | null,
): PersonLabel {
  const account = current || identity?.user || name
  const display = identity?.display_name?.trim() ?? ''
  const written = account !== name ? name : ''
  return { plain: !display && !written && !identity, account, display, written }
}
