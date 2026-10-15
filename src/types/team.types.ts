export type MemberSource = 'direct' | 'team' | 'org_owner'

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
