export type Visibility = 'public' | 'private'

/** The identity of a repository, as far as navigation needs it. */
export interface RepoRef {
  owner: string
  name: string
}
