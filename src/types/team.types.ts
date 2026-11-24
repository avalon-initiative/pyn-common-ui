import type { AccessMode } from './access.types'
import type { PublicIdentity } from './profile.types'

export type MemberSource = 'direct' | 'team' | 'org_owner'

/** A repository where a team holds a role. */
export interface TeamRepo {
  /** `owner/name`. */
  repo: string
  role: string
}

export interface TeamInfo {
  id: string
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
  team_id: string
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
  identity?: PublicIdentity | null
}

/** One row of the manage-access list. */
export interface AccessRow extends Grantee {
  kind: 'person' | 'team'
}

export type AccessTab = 'direct' | 'organization'

export type AccessAdd = 'people' | 'teams'

/** Props of `PynAccessPage`. */
export interface AccessPageProps {
  /** Rows of the open tab, already filtered and paged by the app. */
  rows: AccessRow[]
  /** Total rows of the open tab across every page. */
  count: number
  roles: string[]
  visibility?: AccessMode
  /** Shows Manage visibility. */
  canManageVisibility?: boolean
  /** Role every organization member holds; absent means none. */
  baseRole?: string | null
  baseRoleHref?: string
  directPeople?: number
  directTeams?: number
  /** Absent for a repository owned by a person: the organization card says so. */
  organization?: string
  organizationHref?: string
  orgPeople?: number
  orgTeams?: number
  /** Selected type and role filters; `all` shows everything. */
  type?: string
  role?: string
  page?: number
  pageSize?: number
  /** Shows Create team, Add people and Add teams, and the row controls. */
  canManage?: boolean
  busy?: boolean
  loading?: boolean
  error?: string
  title?: string
}
