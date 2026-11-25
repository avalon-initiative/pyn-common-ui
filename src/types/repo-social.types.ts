import type { RepoIcon, RepoRef } from './repo.types'
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

/** A fork in the Fork caret menu; `href` defaults to `/<owner>/<name>`, a given picture replaces the fork glyph. */
export interface ForkLink extends RepoRef, RepoIcon {
  href?: string
}

export interface RepoSocial {
  watch?: SocialButton
  fork?: SocialButton
  star?: SocialButton
  /**
   * Existing forks; given, the Fork caret lists them (or `forksEmpty`) under "Existing forks", then
   * "Create a new fork" (menu id `create`, left out while the Fork button is disabled), then `fork.menu`.
   */
  forks?: ForkLink[]
  /** Text of an empty forks list. */
  forksEmpty?: string
}
