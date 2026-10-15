export type Visibility = 'public' | 'private'

/** The identity of a repository, as far as navigation needs it. */
export interface RepoRef {
  owner: string
  name: string
}

/** The repository fields the landing page shows. */
export interface RepoInfo extends RepoRef {
  visibility: Visibility
  lease_hours: number
  created_at: string
}

/** One revision of a path, as the history and file views show it. */
export interface Revision {
  id: number
  path: string
  author: string
  message: string
  created_at: string
  /** Set when this revision restored the content of an earlier one. */
  restored_from?: number | null
}
