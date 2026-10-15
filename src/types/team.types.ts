export type MemberSource = 'direct' | 'team' | 'org_owner'

/** A repository where a team holds a role. */
export interface TeamRepo {
  /** `owner/name`. */
  repo: string
  role: string
}

export interface TeamInfo {
  /** ISO 8601 timestamp. */
  created_at: string
  description: string
  members: string[]
  name: string
  repos: TeamRepo[]
  slug: string
}

/** What the team form emits; `slug` is only present when creating. */
export interface TeamFormValue {
  slug?: string
  name: string
  description: string
}

/** A team's role in a repository. */
export interface RepoTeam {
  slug: string
  name: string
  description: string
  role: string
}

/** One row of a role list, whether the grantee is a person or a team. */
export interface Grantee {
  name: string
  role: string
  /** Absent for a team; otherwise where the role comes from. */
  source?: MemberSource
  href?: string
}
