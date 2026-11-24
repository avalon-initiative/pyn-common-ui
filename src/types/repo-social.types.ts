import type { MenuItem } from './shell.types'

export type SocialKind = 'watch' | 'fork' | 'star'

/** One button of the Watch, Fork and Star group; a group member is shown only when given. */
export interface SocialButton {
  count: number
  /** Watching or starred; the label reads "Watching" or "Starred". */
  active?: boolean
  disabled?: boolean
  /** Items of the caret menu; without them there is no caret. */
  menu?: MenuItem[]
}

export interface RepoSocial {
  watch?: SocialButton
  fork?: SocialButton
  star?: SocialButton
}
