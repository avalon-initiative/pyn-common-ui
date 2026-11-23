/** An owner the person can act as: themselves or an organization. */
export interface OwnerOption {
  name: string
  kind: 'user' | 'org'
  /** Defaults to `/<name>`. */
  href?: string
}

/** Destinations of the top bar's links; each has a default. */
export interface TopBarHrefs {
  home: string
  profile: string
  settings: string
  admin: string
  locks: string
  notifications: string
  newRepo: string
  newOrg: string
}
