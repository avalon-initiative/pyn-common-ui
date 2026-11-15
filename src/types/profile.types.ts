export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

/** The public, user-edited part of an account (the server's `Profile`). */
export interface ProfileInfo {
  avatar_url?: string | null
  bio?: string | null
  company?: string | null
  display_name?: string | null
  links?: string[]
  location?: string | null
}

/** Mirrors the server's `PublicIdentity`: the public part of an account shown in lists. */
export interface PublicIdentity {
  user: string
  display_name?: string | null
  avatar_url?: string | null
}
