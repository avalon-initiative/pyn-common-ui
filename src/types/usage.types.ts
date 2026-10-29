/** Limits on one owner; a null field is unlimited. `members` is always null for a user. */
export interface Limits {
  repositories: number | null
  members: number | null
  /** Bytes of distinct content across the owner's repositories. */
  storage_bytes: number | null
}

export interface OwnerLimits {
  owner_id: string
  kind: 'user' | 'org'
  /** The limits in force: the owner's own, else the server default. */
  effective: Limits
  /** Limits set for this owner alone; a null field follows the server default. */
  own: Limits
}

export interface Usage {
  repositories: number
  /** Organization members; null for a user. */
  members: number | null
  /** Bytes of distinct content, counted once per repository. */
  stored_bytes: number
}

export interface RepoUsage {
  /** `owner/name`. */
  repository: string
  repo_id: string
  stored_bytes: number
  files: number
  revisions: number
  /** The repository's own storage cap in bytes; null when it has none. */
  storage_cap: number | null
}

export interface OwnerUsage {
  owner: string
  owner_id: string
  limits: OwnerLimits
  usage: Usage
  repositories: RepoUsage[]
}

export interface FolderUsage {
  /** The top-level folder; empty for the files at the root. */
  folder: string
  stored_bytes: number
  files: number
}

export interface PathUsage {
  path: string
  stored_bytes: number
  revisions: number
}

export interface RepoUsageBreakdown {
  /** `owner/name`. */
  repository: string
  repo_id: string
  stored_bytes: number
  storage_cap: number | null
  folders: FolderUsage[]
  largest_paths: PathUsage[]
}

/** Body of `PUT /v1/repos/{owner}/{name}/storage-cap`; null removes the cap. */
export interface SetRepoStorageCapRequest {
  storage_bytes: number | null
}

export type UsageLevel = 'ok' | 'warning' | 'danger'
