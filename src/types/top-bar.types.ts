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
  people: string
  orgs: string
  repositories: string
  explore: string
  locks: string
  notifications: string
  newRepo: string
  newOrg: string
}

/** An extra destination in the narrow-screen main menu. */
export interface TopBarLink {
  id: string
  label: string
  href: string
}

/** An entry in the bell panel: a notice, or an invitation with Accept and Decline. */
export interface BellEntry {
  id: string
  title: string
  /** ISO 8601 timestamp shown as a relative time. */
  at?: string
  href?: string
  /** An invitation shows Accept and Decline; a notice shows a dismiss button. Defaults to `notice`. */
  kind?: 'notice' | 'invitation'
  /** Disables the entry's actions while a request runs. */
  busy?: boolean
}
